import { Component, OnInit } from '@angular/core';
import { SpeecherRecognizer, SpeechEvents, ISpeechResult } from '@services/speech.service';
import { faMicrophone } from '@fortawesome/free-solid-svg-icons';
import { CommandService } from '@services/command.service';
import { Filters } from '@services/filter.result';
import { LocalStorageService, StoreType } from '@services/store.service';
import { DateService } from '@services/date.service';

@Component({
  selector: 'speecher-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  constructor(
    private recognizer: SpeecherRecognizer,
    private commandService: CommandService,
    private storeService: LocalStorageService,
    private dateService: DateService
  ) {}
  result = { final: '', intrim: '' };
  started = false;
  state = '';
  icons = {
    microfone: faMicrophone,
  };
  ngOnInit() {
    this.recognizer.events.subscribe(
      ({ result, event, error }) => {
        if (event === SpeechEvents.didStartListening) {
          this.started = true;
        }
        if (event === SpeechEvents.didStopListening) {
          this.started = false;
        }
        if (event === SpeechEvents.didReceiveResult) {
          this.processResult(result);
        }
      },
      (err) => {
        console.error(`Speecher error: ${err}`);
        this.started = false;
        this.stop();
      }
    );
  }

  private processResult(result: {
    speech: string;
    confidence: any;
    isFinal: boolean;
  }) {
    const intrimResult = this.result.final + ' ' + result.speech;
    if (!result.isFinal) {
      if (intrimResult.length > this.result.intrim.length){
        this.result.intrim = intrimResult;
      }
      return;
    }
    this.result.intrim = '';
    this.result.final += ' ' + this.correctPunctuation(result.speech);
    this.storeService
      .store(
        {
          note: this.result.final,
          when: this.dateService.now,
        },
        this.today,
        StoreType.note
      )
      .then((data) => {
        console.log('Data stored.');
      });
  }

  private correctPunctuation(str: string): string {
    const filteredResult = this.commandService.filter(str, [
      Filters.comma,
      Filters.dot,
      Filters.newpara,
    ]);
    if (filteredResult.length !== 0) {
      return this.commandService.process(filteredResult, str);
    }
    return str;
  }

  toggleStart() {
    if (this.started) {
      this.stop();
      return;
    }

    this.recognizer.start(true);
  }

  micColor() {
    const blue = getComputedStyle(document.documentElement).getPropertyValue(
      '--blue'
    );
    const light = getComputedStyle(document.documentElement).getPropertyValue(
      '--light'
    );
    return this.started ? blue : light;
  }

  private stop() {
    this.recognizer.stop();
  }

  get today() {
    return this.dateService.today;
  }
}
