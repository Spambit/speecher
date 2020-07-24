import {
  Component,
  OnInit,
  ViewContainerRef,
  TemplateRef,
} from '@angular/core';
import { SpeecherRecognizerService } from '@services/speech.service';
import { faMicrophone } from '@fortawesome/free-solid-svg-icons';
import { CommandService } from '@services/command.service';
import {
  Filter,
  Note,
  SpeechEvent,
  IFilterResult,
} from '@services/filter.result';
import { LocalStorageService } from '@services/store.service';
import { DateService } from '@services/date.service';
import { DriveService } from '@services/drive.service';
import { ToastService } from '@services/toast.service';
import { SpeakService } from '@services/speak.service';
import { createInstanceOfClass } from 'src/app/utils';
import { NavConfig } from '@components/speecher-nav/speecher-nav.component';
import { TemplateService } from '@services/template.service';
import { AccordianComponent } from '@components/accordian/accordian.component';
import { first, take } from 'rxjs/operators';

@Component({
  selector: 'speecher-home',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss'],
})
export class CreateStoryComponent implements OnInit {
  constructor(
    private recognizerService: SpeecherRecognizerService,
    private commandService: CommandService,
    private storeService: LocalStorageService,
    private dateService: DateService,
    private driveService: DriveService,
    private toastService: ToastService,
    private templateService: TemplateService,
    private viewRef: ViewContainerRef,
    private speakService: SpeakService
  ) {}
  private mutableWordPanelData = this.immutableWordPanelData;
  navConfig: NavConfig = {
    button: {
      iconColor: this.micColor(),
      show: true,
      icon: faMicrophone,
      click: (e: Event) => this.toggleStart(),
    },
    header: this.today,
  };
  toastTemplate: TemplateRef<any>;
  result: IResult = { final: '', intrim: '' };
  wordResult: IResult = { final: '', intrim: '' };
  pause = false;
  started = false;
  private noteNow?: Note;
  private gdriveParentFolderId = '';
  private wordPanelVisibleInternal = false;
  set wordPanelVisible(val: boolean) {
    if (!val) {
      this.clearWordPanelData();
    }
    this.wordPanelVisibleInternal = val;
  }
  get wordPanelVisible() {
    return this.wordPanelVisibleInternal;
  }
  async ngOnInit() {
    this.toastTemplate = await this.templateService.getTemplateContent(
      this.viewRef,
      AccordianComponent
    );
    this.noteNow = await this.storeService.todaysNote();
    this.result.final = (this.noteNow && this.noteNow.note) || '';
    this.recognizerService.events.subscribe(
      ({ result, event, error }) => {
        if (event === SpeechEvent.didStartListening) {
          this.started = true;
        }
        if (event === SpeechEvent.didStopListening) {
          this.started = false;
        }
        if (event === SpeechEvent.didReceiveResult) {
          if (!this.pause) {
            this.processResult(result);
          }
        }
      },
      (err) => {
        console.error(`Speecher error: ${err}`);
        this.started = false;
        this.stop();
      }
    );
  }

  private clearWordPanelData() {
    this.wordResult.final = '';
    this.wordResult.intrim = '';
    this.mutableWordPanelData = this.immutableWordPanelData;
  }

  private get immutableWordPanelData() {
    return {
      context: {
        word: {
          example: [],
          name: '',
          meaning: '',
          dirtySection: WordSection.name,
        },
      },
    };
  }

  private findFolder({ id = '' }): Promise<boolean> {
    return this.driveService.findFile({ id });
  }

  private processResult(result: {
    speech: string;
    confidence: any;
    isFinal: boolean;
  }) {
    if (this.wordPanelVisible) {
      return this.processWordResult(result);
    }
    return this.processNoteResult(result);
  }

  private processWordResult(result: {
    speech: string;
    confidence: any;
    isFinal: boolean;
  }) {
    if (result.isFinal) {
      let utter = '';
      const commands = this.processWordCommands(result.speech);
      if (commands.shouldSelectExampleWordSection) {
        this.mutableWordPanelData.context.word.dirtySection =
          WordSection.examples;
        utter = 'Say an example';
      } else if (commands.shouldSelectMeaningWordSection) {
        this.mutableWordPanelData.context.word.dirtySection =
          WordSection.meaning;
        utter = 'Say the meaning';
      } else if (commands.shouldSelectNameWordSection) {
        this.mutableWordPanelData.context.word.dirtySection = WordSection.name;
        utter = 'Say the word';
      }
      this.pause = true;
      this.speakService
        .speak(utter)
        .pipe(take(2))
        .subscribe(
          (e) => {
            if (e === SpeechEvent.didStopSpeaking) {
              this.pause = false;
              this.setResultInCurrentActiveWordSection(commands.result);
            }
          },
          (err) => (this.pause = false)
        );

      if (commands.close) {
        this.toastService.removeLast();
        this.wordPanelVisible = false;
      }
    }
  }

  private setResultInCurrentActiveWordSection(str: string) {
    switch (this.mutableWordPanelData.context.word.dirtySection) {
      case WordSection.name:
        if (str.length !== 0) {
          this.mutableWordPanelData.context.word.name = str;
        }
        break;
      case WordSection.meaning:
        if (str.length !== 0) {
          this.mutableWordPanelData.context.word.meaning = str;
        }
        break;
      case WordSection.examples:
        if (str.length !== 0) {
          this.mutableWordPanelData.context.word.example.push(str);
        }
        break;
    }
  }

  private processNoteResult(result: {
    speech: string;
    confidence: any;
    isFinal: boolean;
  }) {
    const intrimResult = this.result.final + ' ' + result.speech;
    if (!result.isFinal) {
      if (intrimResult.length > this.result.intrim.length) {
        this.result.intrim = intrimResult;
      }
      return;
    }
    this.result.intrim = '';
    const processedResult = this.processNoteCommands(result.speech);
    this.result.final += ' ' + processedResult.result;
    this.noteNow = createInstanceOfClass(Note, {
      name: this.today,
      note: this.result.final,
      when: this.dateService.now,
      drive: {
        destFolderId: this.gdriveParentFolderId,
      },
      words: [],
    });
    this.storeService
      .storeTodaysNote(this.noteNow)
      .catch(console.error)
      .then((data) => {
        console.log('Data stored.');
      });
    if (processedResult.shouldSaveNote) {
      this.saveNoteInGoogleDrive()
        .then(() => console.log('Note saved in drive'))
        .catch(console.error);
    }
    if (processedResult.shouldShowCreateWordPanel) {
      this.toggleCreateWordPanel();
    }
  }

  private toggleCreateWordPanel() {
    this.wordPanelVisible = !this.wordPanelVisible;
    if (!this.wordPanelVisible) {
      return;
    }

    this.toastService.show(this.toastTemplate, this.mutableWordPanelData);
    this.pause = true;
    this.speakService
      .speak('Say the word')
      .pipe(take(2))
      .subscribe(
        (e) => {
          if (e === SpeechEvent.didStopSpeaking) {
            this.pause = false;
          }
        },
        () => (this.pause = false)
      );
  }

  private processWordCommands(
    str: string
  ): {
    result: string;
    shouldSelectMeaningWordSection: boolean;
    shouldSelectNameWordSection: boolean;
    shouldSelectExampleWordSection: boolean;
    close: boolean;
  } {
    let result = str;
    let shouldSelectNameWordSection = false;
    let shouldSelectExampleWordSection = false;
    let shouldSelectMeaningWordSection = false;
    let close = false;
    const filteredResults = this.commandService.filter(str, [
      Filter.wordname,
      Filter.wordmeaning,
      Filter.wordexample,
    ]);
    if (filteredResults.length !== 0) {
      result = this.commandService.process(filteredResults, str);
      shouldSelectNameWordSection = filteredResults.some(
        (filterResult) => filterResult.command.id === Filter.wordname
      );
      shouldSelectMeaningWordSection = filteredResults.some(
        (filterResult) => filterResult.command.id === Filter.wordmeaning
      );
      shouldSelectExampleWordSection = filteredResults.some(
        (filterResult) => filterResult.command.id === Filter.wordexample
      );
      close = filteredResults.some(
        (filterResult) => filterResult.command.id === Filter.wordclose
      );
    }
    return {
      result,
      shouldSelectNameWordSection,
      shouldSelectMeaningWordSection,
      shouldSelectExampleWordSection,
      close,
    };
  }

  private processNoteCommands(
    str: string
  ): {
    result: string;
    shouldSaveNote: boolean;
    shouldShowCreateWordPanel: boolean;
  } {
    let result = str;
    let shouldSaveNote = false;
    let shouldShowCreateWordPanel = false;
    const filteredResults = this.commandService.filter(str, [
      Filter.comma,
      Filter.dot,
      Filter.newpara,
      Filter.savenote,
      Filter.createword,
    ]);
    if (filteredResults.length !== 0) {
      result = this.commandService.process(filteredResults, str);
      shouldSaveNote = filteredResults.some(
        (filterResult) => filterResult.command.id === Filter.savenote
      );
      shouldShowCreateWordPanel = filteredResults.some(
        (filterResult) => filterResult.command.id === Filter.createword
      );
    }
    return {
      result,
      shouldSaveNote,
      shouldShowCreateWordPanel,
    };
  }

  private saveNoteInGoogleDrive(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.findFolder({ id: this.gdriveParentFolderId }).then((found) => {
        if (!found) {
          console.log('Not found');
          return this.driveService
            .createBaseFolder()
            .then((ret) => {
              this.gdriveParentFolderId = ret.id;
              this.saveNoteInternal(this.gdriveParentFolderId)
                .then(resolve)
                .catch(reject);
            })
            .catch(reject);
        }
        console.log('found');
        return this.saveNoteInternal(this.gdriveParentFolderId)
          .then(resolve)
          .catch(reject);
      });
    });
  }

  private saveNoteInternal(parentFolderId: string): Promise<void> {
    return this.driveService
      .createFile({
        withContent: JSON.stringify(this.noteNow),
        name: this.today,
        folderId: parentFolderId,
      })
      .then((res) => Promise.resolve())
      .catch(Promise.reject);
  }

  toggleStart() {
    if (this.started) {
      this.stop();
      return;
    }
    this.recognizerService.start();
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
    this.recognizerService.stop();
  }

  get today() {
    return this.dateService.today;
  }
}

interface IResult {
  final: string;
  intrim: string;
}

enum WordSection {
  name,
  meaning,
  examples,
}
