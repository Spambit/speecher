import { Component, OnInit } from '@angular/core';
import { SpeechRecognizer, SpeechEvents } from './speech.service';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'speech-showcase';
  $: any;
  result: string;
  started = false;
  state = '';
  constructor(private recognizer: SpeechRecognizer) {
    console.log('New App component created');
  }
  ngOnInit(){
  }
  start() {
    if ( this.started ){
      this.stop();
      return;
    }

    this.recognizer.start().subscribe(( { result, event, error }) => {
      if ( event === SpeechEvents.didStartListening ) {
        this.started = true;
      }
      if ( event === SpeechEvents.didStopListening ) {
        this.started = false;
      }
      if (event === SpeechEvents.didReceiveResult ) {
        this.result += result.speech;
      }
    });
  }

  private stop() {
    this.recognizer.stop();
    this.state = 'Idle';
  }
}
