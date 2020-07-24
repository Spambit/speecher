import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { ISpeechError, SpeechEvent } from './filter.result';

export const SpeechRecognition =
(window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
export const SpeechGrammarList =
(window as any).SpeechGrammarList || (window as any).webkitSpeechGrammarList;
export const SpeechRecognitionEvent =
(window as any).SpeechRecognitionEvent || (window as any).webkitSpeechRecognitionEvent;

@Injectable({ providedIn: 'root' })
export class SpeecherRecognizerService {
  private recognition: SpeechRecognition;
  private subject: Subject<ISpeechResult>;
  // tslint:disable-next-line: variable-name
  private _started: boolean;
  private set started(val) {
    this._started = val;
  }
  private get started() {
    return this._started;
  }
  constructor() {
    this.subject = new Subject<ISpeechResult>();
    this.recognition = new SpeechRecognition();
    this.configureSpeechRecognizer();
  }

  private didFail(event) {
    this.subject.error((event as any).error);
  }

  private didStartAudio(event) {
    // Fired when the user agent has started to capture audio.
    this.subject.next({
      event: SpeechEvent.didStartCaptureAudio,
    });
  }

  private didEndAudio(event) {
    // Fired when the user agent has finished capturing audio.
    this.subject.next({
      event: SpeechEvent.didEndCaptureAudio,
    });
  }

  private didEndRecognizingSpeech(event) {
    // Fired when the speech this.recognition service has disconnected.
    this.started = false;
    this.subject.next({
      event: SpeechEvent.didStopListening,
    });
  }

  private didNotMatchAny(event) {
    // Fired when the speech this.recognition service
    // returns a final result with no significant recognition.
    // This may involve some degree of recognition,
    // which doesn't meet or exceed the confidence threshold.
    this.subject.next({
      event: SpeechEvent.noMatchAnyGrammer,
    });
  }

  private didStartSound(event) {
    // Fired when any sound — recognisable speech or not — has been detected.
    this.subject.next({
      event: SpeechEvent.didDetectSound,
    });
  }

  private didEndSound(event) {
    // Fired when any sound — recognisable speech or not — has stopped being detected.
    this.subject.next({
      event: SpeechEvent.didStopDetectingSound,
    });
  }

  private didStartSpeech(event) {
    // Fired when sound that is recognised by the speech recognition
    // service as speech has been detected.
    this.subject.next({
      event: SpeechEvent.didDetectRecognizableSound,
    });
  }

  private didStart(event) {
    // Fired when the speech recognition service has begun listening to
    // incoming audio with intent to recognize grammars associated with the current SpeechRecognition.
    this.started = true;
    this.subject.next({
      event: SpeechEvent.didStartListening,
    });
  }

  private configureSpeechRecognizer() {
    this.recognition.lang = 'en-IN';
    this.recognition.maxAlternatives = 1;
    this.recognition.interimResults = true;
    this.recognition.continuous = true;

    this.recognition.addEventListener('end', e => this.didEndRecognizingSpeech(e));
    this.recognition.addEventListener('start', e => this.didStart(e));
    this.recognition.addEventListener('result', e => this.didRecognizedSpeech(e));
    this.recognition.addEventListener('error', e => this.didFail(e));
    this.recognition.addEventListener('audiostart', e => this.didStartAudio(e));
    this.recognition.addEventListener('audioend', e => this.didEndAudio(e));
    this.recognition.addEventListener('speechstart', e => this.didStartSpeech(e));
    this.recognition.addEventListener('soundend', e => this.didEndSound(e));
    this.recognition.addEventListener('soundstart', e => this.didStartSound(e));
    this.recognition.addEventListener('nomatch', e => this.didNotMatchAny(e));
  }

  private trimAndCapitalizeFirstLetter(str: string) {
    str = str.trim();
    return str.charAt(0).toUpperCase() + str.substring(1);
  }

  private didRecognizedSpeech(event) {
    // The SpeechRecognitionEvent results property returns a SpeechRecognitionResultList object
    // The SpeechRecognitionResultList object contains SpeechRecognitionResult objects.
    // It has a getter so it can be accessed like an array
    // The first [0] returns the SpeechRecognitionResult at position 0.
    // Each SpeechRecognitionResult object contains SpeechRecognitionAlternative objects that contain individual results.
    // These also have getters so they can be accessed like arrays.
    // The second [0] returns the SpeechRecognitionAlternative at position 0.
    // We then return the transcript property of the SpeechRecognitionAlternative object
    const speechResult = event.results[event.results.length - 1] as SpeechRecognitionResult;
    const lastRecognisedResult = speechResult[0] as SpeechRecognitionAlternative;
    const speech = this.trimAndCapitalizeFirstLetter(lastRecognisedResult.transcript);
    const confidence = lastRecognisedResult.confidence;
    const isFinal = speechResult.isFinal;
    this.subject.next({
      result: { speech, confidence, isFinal },
      event: SpeechEvent.didReceiveResult,
    });
  }

  get events(){
    return this.subject;
  }

  start() {
    this.recognition.start();
  }

  stop() {
    if (!this.started) {
      return;
    }
    this.subject.next({ event: SpeechEvent.didRequestStop });
    this.recognition.stop();
    this.started = false;
  }
}

export interface ISpeechResult {
  result?: { speech: string; confidence: any, isFinal: boolean };
  error?: ISpeechError;
  event: SpeechEvent;
}
