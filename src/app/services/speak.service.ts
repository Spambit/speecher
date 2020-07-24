import { Injectable } from '@angular/core';
import { SpeechEvent } from './filter.result';
import { Subject, Observable } from 'rxjs';
import { ISpeechResult } from './speech.service';

@Injectable({ providedIn: 'root' })
export class SpeakService {
  constructor() {
    this.event$ = new Subject<SpeechEvent>();
    this.populateVoiceList();
    this.computer.addEventListener('voiceschanged', () =>
      this.populateVoiceList()
    );
  }
  private computer = window.speechSynthesis;
  event$: Subject<SpeechEvent|undefined>;

  private voices: SpeechSynthesisVoice[] = [];

  private populateVoiceList() {
    this.voices = this.computer.getVoices().sort((a, b) => {
      const aname = a.name.toUpperCase();
      const bname = b.name.toUpperCase();
      if (aname < bname) {
        return -1;
      } else if (aname === bname) {
        return 0;
      } else {
        return +1;
      }
    });
  }

  speak(str: string): Observable<SpeechEvent> {
    if (this.computer.speaking || str === '') {
      this.event$.error({err: 'Computer speaking already or some other error occured'});
    }

    if (str !== '') {
      const utterThis = new SpeechSynthesisUtterance(str);
      utterThis.onend = (event) => {
        this.event$.next(SpeechEvent.didStopSpeaking);
      };
      utterThis.onstart = (event) => {
        this.event$.next(SpeechEvent.didStartSpeaking);
      };
      utterThis.onerror = (event) => {
        this.event$.error({err: event});
      };
      for (const voice of this.voices) {
        if (voice.lang.toLowerCase() === 'en-us') {
          utterThis.voice = voice;
          break;
        }
      }
      this.computer.speak(utterThis);
    }
    return this.event$;
  }
}
