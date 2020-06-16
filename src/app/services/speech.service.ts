import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

export const SpeechRecognition =
(window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
export const SpeechGrammarList =
(window as any).SpeechGrammarList || (window as any).webkitSpeechGrammarList;
export const SpeechRecognitionEvent =
(window as any).SpeechRecognitionEvent || (window as any).webkitSpeechRecognitionEvent;

@Injectable({ providedIn: 'root' })
export class SpeechRecognizer {
  private recognition: SpeechRecognition;
  private subject: Subject<SpeechResult>;
  private sentence: number;
  // tslint:disable-next-line: variable-name
  private _started: boolean;
  private set started(val) {
    if (!val) {
      this.sentence = 0;
    }
    this._started = val;
  }
  private get started() {
    return this._started;
  }
  constructor() {
    this.sentence = 0;
    this.subject = new Subject<SpeechResult>();
    this.recognition = new SpeechRecognition();
    this.configureSpeechRecognizer();
  }

  private didFail(event) {
    this.subject.error((event as any).error);
  }

  private didStartAudio(event) {
    // Fired when the user agent has started to capture audio.
    this.subject.next({
      event: SpeechEvents.didStartCaptureAudio,
    });
  }

  private didEndAudio(event) {
    // Fired when the user agent has finished capturing audio.
    this.subject.next({
      event: SpeechEvents.didEndCaptureAudio,
    });
  }

  private didEndRecognizingSpeech(event) {
    // Fired when the speech this.recognition service has disconnected.
    this.subject.next({
      event: SpeechEvents.didStopListening,
    });
  }

  private didNotMatchAny(event) {
    // Fired when the speech this.recognition service
    // returns a final result with no significant recognition.
    // This may involve some degree of recognition,
    // which doesn't meet or exceed the confidence threshold.
    this.subject.next({
      event: SpeechEvents.noMatchAnyGrammer,
    });
  }

  private didStartSound(event) {
    // Fired when any sound — recognisable speech or not — has been detected.
    this.subject.next({
      event: SpeechEvents.didDetectSound,
    });
  }

  private didEndSound(event) {
    // Fired when any sound — recognisable speech or not — has stopped being detected.
    this.subject.next({
      event: SpeechEvents.didStopDetectingSound,
    });
  }

  private didStartSpeech(event) {
    // Fired when sound that is recognised by the speech recognition
    // service as speech has been detected.
    this.subject.next({
      event: SpeechEvents.didDetectRecognizableSound,
    });
  }

  private didStart(event) {
    // Fired when the speech recognition service has begun listening to
    // incoming audio with intent to recognize grammars associated with the current SpeechRecognition.
    this.subject.next({
      event: SpeechEvents.didStartListening,
    });
  }

  private configureSpeechRecognizer() {
    this.recognition.lang = 'en-US';
    this.recognition.interimResults = false;
    this.recognition.maxAlternatives = 1;
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
    const speech = this.trimAndCapitalizeFirstLetter(event.results[this.sentence][0].transcript + '.');
    const confidence = event.results[this.sentence][0].confidence;
    if (this.recognition.continuous) {
      this.sentence++;
    }
    this.subject.next({
      result: { speech, confidence },
      event: SpeechEvents.didReceiveResult,
    });
  }

  get events(){
    return this.subject;
  }

  start(continuous = false) {
    this.recognition.continuous = continuous;
    this.started = true;
    this.recognition.start();
  }

  stop() {
    if (!this.started) {
      return;
    }
    this.subject.next({ event: SpeechEvents.didRequestStop });
    this.recognition.stop();
    this.started = false;
  }
}

export interface SpeechResult {
  result?: { speech: string; confidence: any };
  error?: { reason: string; original: any };
  event: SpeechEvents;
}

export enum SpeechEvents {
  didStartCaptureAudio,
  didEndCaptureAudio,
  didStopListening,
  noMatchAnyGrammer,
  didDetectSound,
  didStopDetectingSound,
  didDetectRecognizableSound,
  didStartListening,
  didReceiveResult,
  didRequestStop,
}
