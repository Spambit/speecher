import { Component, OnInit } from '@angular/core';
import { SpeecherRecognizer, SpeechEvents } from '@services/speech.service';
import { faMicrophone } from '@fortawesome/free-solid-svg-icons';
import { CommandService } from '@services/command.service';
import { Filters, Note } from '@services/filter.result';
import { LocalStorageService } from '@services/store.service';
import { DateService } from '@services/date.service';
import { DriveService } from '@services/drive.service';
import { ToastService } from '@services/toast.service';
import { first } from 'rxjs/operators';
import { createInstanceOfClass } from 'src/app/utils';

@Component({
  selector: 'speecher-home',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss'],
})
export class CreateStoryComponent implements OnInit {
  constructor(
    private recognizer: SpeecherRecognizer,
    private commandService: CommandService,
    private storeService: LocalStorageService,
    private dateService: DateService,
    private driveService: DriveService,
    private toastService: ToastService
  ) {}
  result = { final: 'Ok this is final result.', intrim: '' };
  started = false;
  icons = {
    microfone: faMicrophone,
  };
  private noteNow?: Note;
  private gdriveParentFolderId = '';
  createWordPanelVisible = false;
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

  private findFolder({ id = '' }): Promise<boolean> {
    return this.driveService.findFile({ id });
  }

  private processResult(result: {
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
    const processedResult = this.processCommands(result.speech);
    this.result.final += ' ' + processedResult.result;
    this.noteNow = createInstanceOfClass(Note, {
      name: this.today,
      note: this.result.final,
      when: this.dateService.now,
      drive: {
        destFolderId: this.gdriveParentFolderId,
      },
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
    this.createWordPanelVisible = !this.createWordPanelVisible;
    this.toastService.show('Test');
  }

  private processCommands(
    str: string
  ): {
    result: string;
    shouldSaveNote: boolean;
    shouldShowCreateWordPanel: boolean;
  } {
    let result = '';
    let shouldSaveNote = false;
    let shouldShowCreateWordPanel = false;
    const filteredResults = this.commandService.filter(str, [
      Filters.comma,
      Filters.dot,
      Filters.newpara,
      Filters.savenote,
      Filters.createword,
    ]);
    if (filteredResults.length !== 0) {
      result = this.commandService.process(filteredResults, str);
      shouldSaveNote = filteredResults.some(
        (filterResult) => filterResult.command.id === Filters.savenote
      );
      shouldShowCreateWordPanel = filteredResults.some(
        (filterResult) => filterResult.command.id === Filters.createword
      );
    }
    return { result, shouldSaveNote, shouldShowCreateWordPanel };
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
      this.driveService
        .logout()
        .pipe(first())
        .subscribe((loggedIn) => {
          if (!loggedIn) {
            console.log('logged out');
          }
        });
      this.started = false;
      return;
    }

    this.started = true;
    this.processResult({
      speech: `Ok that's all. save note`,
      confidence: 0.09,
      isFinal: true,
    });
    return;

    if (this.started) {
      this.stop();
      return;
    }

    this.recognizer.start();
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
