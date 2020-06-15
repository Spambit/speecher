import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

const SpeechRecognition =
  window.SpeechRecognition || (window as any).webkitSpeechRecognition;
const SpeechGrammarList =
  window.SpeechGrammarList || (window as any).webkitSpeechGrammarList;
const SpeechRecognitionEvent =
  window.SpeechRecognitionEvent || (window as any).webkitSpeechRecognitionEvent;

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
      this.subject.complete();
    } else {
      this.subject = new Subject<SpeechResult>();
    }
    this._started = val;
  }
  private get started() {
    return this._started;
  }
  constructor() {
    this.sentence = 0;
    this.recognition = new SpeechRecognition();
    this.configureSpeechRecognizer();
  }

  didFail(event) {
    this.subject.error((event as any).error);
  }

  didStartAudio(event) {
    // Fired when the user agent has started to capture audio.
    this.subject.next({
      event: SpeechEvents.didStartCaptureAudio,
    });
  }

  didEndAudio(event) {
    // Fired when the user agent has finished capturing audio.
    this.subject.next({
      event: SpeechEvents.didEndCaptureAudio,
    });
  }

  didEndRecognizingSpeech(event) {
    // Fired when the speech this.recognition service has disconnected.
    this.subject.next({
      event: SpeechEvents.didStopListening,
    });
  }

  didNotMatchAny(event) {
    // Fired when the speech this.recognition service
    // returns a final result with no significant recognition.
    // This may involve some degree of recognition,
    // which doesn't meet or exceed the confidence threshold.
    this.subject.next({
      event: SpeechEvents.noMatchAnyGrammer,
    });
  }

  didStartSound(event) {
    // Fired when any sound — recognisable speech or not — has been detected.
    this.subject.next({
      event: SpeechEvents.didDetectSound,
    });
  }

  didEndSound(event) {
    // Fired when any sound — recognisable speech or not — has stopped being detected.
    this.subject.next({
      event: SpeechEvents.didStopDetectingSound,
    });
  }

  didStartSpeech(event) {
    // Fired when sound that is recognised by the speech recognition
    // service as speech has been detected.
    this.subject.next({
      event: SpeechEvents.didDetectRecognizableSound,
    });
  }

  didStart(event) {
    // Fired when the speech this.recognition service has begun listening to
    // incoming audio with intent to recognize grammars associated with the current SpeechRecognition.
    this.subject.next({
      event: SpeechEvents.didStartListening,
    });
  }

  configureSpeechRecognizer() {
    this.recognition.lang = 'en-US';
    this.recognition.interimResults = false;
    this.recognition.maxAlternatives = 1;
    this.recognition.continuous = true;
    this.recognition.onresult = this.didRecognizedSpeech.bind(this);
    this.recognition.onerror = this.didFail.bind(this);
    this.recognition.onaudiostart = this.didStartAudio.bind(this);
    this.recognition.onaudioend = this.didEndAudio.bind(this);
    this.recognition.onend = this.didEndRecognizingSpeech.bind(this);
    this.recognition.onnomatch = this.didNotMatchAny.bind(this);
    this.recognition.onsoundstart = this.didStartSound.bind(this);
    this.recognition.onsoundend = this.didEndSound.bind(this);
    this.recognition.onspeechstart = this.didStartSpeech.bind(this);
    this.recognition.onstart = this.didStart.bind(this);
  }

  didRecognizedSpeech(event) {
    // The SpeechRecognitionEvent results property returns a SpeechRecognitionResultList object
    // The SpeechRecognitionResultList object contains SpeechRecognitionResult objects.
    // It has a getter so it can be accessed like an array
    // The first [0] returns the SpeechRecognitionResult at position 0.
    // Each SpeechRecognitionResult object contains SpeechRecognitionAlternative objects that contain individual results.
    // These also have getters so they can be accessed like arrays.
    // The second [0] returns the SpeechRecognitionAlternative at position 0.
    // We then return the transcript property of the SpeechRecognitionAlternative object
    const speech = event.results[this.sentence][0].transcript + '.';
    const confidence = event.results[this.sentence][0].confidence;
    if (this.recognition.continuous) {
      this.sentence++;
    }
    this.subject.next({
      result: { speech, confidence },
      event: SpeechEvents.didReceiveResult,
    });
  }

  start() {
    this.recognition.continuous = true;
    this.started = true;
    setTimeout(() => {
      this.recognition.start();
    }, 100);
    return this.subject;
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
