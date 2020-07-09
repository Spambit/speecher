import { Component, OnInit } from '@angular/core';
import {
  SpeecherRecognizer,
  SpeechEvents,
} from '@services/speech.service';
import { faMicrophone } from '@fortawesome/free-solid-svg-icons';
import { CommandService } from '@services/command.service';
import { Filters, CreateNote, Note } from '@services/filter.result';
import { LocalStorageService, StoreType } from '@services/store.service';
import { DateService } from '@services/date.service';
import { first } from 'rxjs/operators';
import { DriveService } from '@services/drive.service';

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
    private dateService: DateService,
    private driveService: DriveService
  ) {}
  result = { final: '', intrim: '' };
  started = false;
  icons = {
    microfone: faMicrophone,
  };
  private noteNow?: Note;
  private gdriveParentFolderId = '';
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
    this.noteNow = CreateNote({
      note: this.result.final,
      timeNow: this.dateService.now,
      driveParentFolderId: this.gdriveParentFolderId,
      name: this.today,
    }),
    this.storeService
      .store(
        this.noteNow,
        this.today,
        StoreType.note
      )
      .then((data) => {
        console.log('Data stored.');
      });
    if (processedResult.shouldSaveNote) {
        this.saveNoteInGoogleDrive();
    }
  }

  private processCommands(str: string): { result: string, shouldSaveNote: boolean} {
    let result = '';
    let shouldSaveNote = false;
    const filteredResults = this.commandService.filter(str, [
      Filters.comma,
      Filters.dot,
      Filters.newpara,
      Filters.savenote,
    ]);
    if (filteredResults.length !== 0) {
      result = this.commandService.process(filteredResults, str);
      shouldSaveNote = filteredResults.some(
        (filterResult) => filterResult.command.id === Filters.savenote
      );
    }
    return { result, shouldSaveNote};
  }

  private saveNoteInGoogleDrive(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.findFolder({ id: this.gdriveParentFolderId }).then((found) => {
        if (!found) {
          return this.driveService
            .createBaseFolder()
            .then((ret) => {
              this.saveNoteInternal(this.gdriveParentFolderId).then(resolve).catch(reject);
            })
            .catch(reject);
        }
        return this.saveNoteInternal(this.gdriveParentFolderId).then(resolve).catch(reject);
      });
    });
  }

  private saveNoteInternal(parentFolderId: string): Promise<void> {
    return this.driveService
      .createFile({
        withContent: this.result.final,
        name: this.today,
        folderId: parentFolderId
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
    this.driveService
      .createBaseFolder('Speecher-Data-Folder')
      .then((ret) => {
        this.gdriveParentFolderId = ret.id;
      })
      .catch(console.error);
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
