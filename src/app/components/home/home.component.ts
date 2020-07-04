import { Component, OnInit } from '@angular/core';
import { SpeecherRecognizer, SpeechEvents } from '@services/speech.service';
import { faMicrophone } from '@fortawesome/free-solid-svg-icons';
import { CommandService } from '@services/command.service';
import { Filters } from '@services/filter.result';

@Component({
  selector: 'speecher-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  constructor(private recognizer: SpeecherRecognizer, private commandService: CommandService) { }
  result = '';
  started = false;
  state = '';
  icons = {
    microfone: faMicrophone
  };
  ngOnInit() {
    this.recognizer.events.subscribe(( { result, event, error }) => {
      if ( event === SpeechEvents.didStartListening ) {
        this.started = true;
      }
      if ( event === SpeechEvents.didStopListening ) {
        this.started = false;
      }
      if (event === SpeechEvents.didReceiveResult ) {
        this.result += this.correctPunctuation(result.speech);
      }
    }, (err) => {
      console.error(`Speecher error: ${err}`);
      this.started = false;
      this.stop();
    });
  }
  private correctPunctuation(str: string): string {
    const filteredResult = this.commandService.filter(str, [Filters.comma, Filters.dot]);
    if (filteredResult.length !== 0) {
      return this.commandService.process(filteredResult, str);
    }
    return str;
  }

  toggleStart() {
    if ( this.started ) {
      this.stop();
      return;
    }

    this.recognizer.start(true);
  }

  micColor(){
    const blue = getComputedStyle(document.documentElement).getPropertyValue('--blue');
    const light = getComputedStyle(document.documentElement).getPropertyValue('--light');
    return this.started ? blue  : light;
  }

  private stop() {
    this.recognizer.stop();
  }
}
