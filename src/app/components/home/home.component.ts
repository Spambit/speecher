import { Component, OnInit } from '@angular/core';
import { SpeecherRecognizer, SpeechEvents } from '@services/speech.service';

@Component({
  selector: 'speecher-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  constructor(private recognizer: SpeecherRecognizer) { }
  result = '';
  started = false;
  state = '';
  ngOnInit() {
    this.recognizer.events.subscribe(( { result, event, error }) => {
      if ( event === SpeechEvents.didStartListening ) {
        this.started = true;
      }
      if ( event === SpeechEvents.didStopListening ) {
        this.started = false;
      }
      if (event === SpeechEvents.didReceiveResult ) {
        this.result += ' ' + result.speech;
      }
    }, (err) => {
      console.error(`Speecher error: ${err}`);
      this.started = false;
      this.stop();
    });
  }
  toggleStart() {
    if ( this.started ) {
      this.stop();
      return;
    }

    this.recognizer.start(true);
  }

  private stop() {
    this.recognizer.stop();
  }
}
