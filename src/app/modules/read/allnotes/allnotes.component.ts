import {
  Component,
  OnInit,
  TemplateRef,
  ViewContainerRef,
} from '@angular/core';
import { Note } from '@services/filter.result';
import { NavConfig } from '@components/speecher-nav/speecher-nav.component';
import { TemplateService } from '@services/template.service';
import { AccordianComponent } from '@components/accordian/accordian.component';
import { LocalStorageService, StoreType } from '@services/store.service';
import { DriveService } from '@services/drive.service';
import { NoteService } from '@services/note.service';
import { IAlert } from '@services/filter.result';

@Component({
  selector: 'speecher-allnotes',
  templateUrl: 'allnotes.component.html',
  styleUrls: ['allnotes.component.scss'],
})
export class AllNotesComponent implements OnInit {
  notes: Note[] = [];
  alerts: IAlert[] = [];
  selectedItem: HTMLElement;
  contentTemplate: TemplateRef<any>;
  constructor(
    private templateService: TemplateService,
    private viewRef: ViewContainerRef,
    private storeService: LocalStorageService,
    private driveService: DriveService,
    private noteService: NoteService
  ) {}
  navConfig: NavConfig = {
    button: {
      dropdown: true,
      dropdownTitle: 'All Stories',
      dropdownItems: [
        {
          text: `Sync`,
          click: (e, item) => this.getMissingDriveNotesToLocalStorage(),
        },
        {
          text: `Backup`,
          click: (e, item) => this.backupToDrive(),
        },
      ],
    },
  };
  async ngOnInit() {
    this.templateService
      .getTemplateContent(this.viewRef, AccordianComponent)
      .then((ref) => {
        this.contentTemplate = ref;
      });

    this.notes = await this.storeService.allNotes<Note>();
  }

  identify(index: number) {
    return index;
  }

  private async getMissingDriveNotesToLocalStorage() {
    const files = await this.driveService.allFilesInBaseFolder();
    if (files.length !== 0) {
      for (const file of files) {
        const driveFile = await this.driveService.fileContent(file.id);
        if (driveFile) {
          const storeFiles = this.storeService.allNotes<Note>();
          const note = JSON.parse(driveFile.content) as Note;
          const index = (await storeFiles).findIndex(
            (item) => item.name === note.name
          );
          if (index === -1) {
            this.storeService.store(note, note.name, StoreType.note);
          }
        }
      }
    }
  }

  closeAlert(alert: IAlert) {
    const index = this.alerts.findIndex(item => item.message === alert.message);
    if (index !== -1) {
      this.alerts.splice(index, 1);
    }
  }

  private showAlert(
    type:
      | 'success'
      | 'info'
      | 'primary'
      | 'secondary'
      | 'light'
      | 'warning'
      | 'dark',
    msg: string
  ) {
    const alert = {
      type, message: msg
    };
    this.alerts.push(alert);
    setTimeout(() => {
      this.closeAlert(alert);
    }, 3000);
  }

  private async backupToDrive() {
    const storeFiles = await this.storeService.allNotes<Note>();
    let failed: boolean;
    for (const note of storeFiles) {
      this.noteService
        .saveNoteInGoogleDrive(note)
        .then(() => {
          this.showAlert(
            'warning',
            'All notes backed up to your google drive.'
          );
        })
        .catch((e) => {
          failed = true;
        });
    }
    if (failed) {
      this.alerts.push({
        type: 'warning',
        message: `Could note save one or mpre notes in your google drive.`,
      });
    }
  }
}
