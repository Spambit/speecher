import { Injectable } from '@angular/core';
import { DriveService } from './drive.service';
import { DateService } from './date.service';
import { Note } from './filter.result';

@Injectable({providedIn: 'root'})
export class NoteService {
  constructor(private driveService: DriveService, private dateService: DateService) { }
  public saveNoteInGoogleDrive(note: Note): Promise<void> {
    return new Promise((resolve, reject) => {
      this.findFolder({ name: DriveService.defaultFolderName }).then((found) => {
        if (found.IDs.length === 0) {
          console.log('Not found base folder');
          return this.driveService
            .createBaseFolder()
            .then((ret) => {
              console.log(`Base folder created with id: ${ret.id}`);
              this.saveNoteInternal({note, parentFolderId: ret.id })
                .then(() => resolve())
                .catch(reject);
            })
            .catch(reject);
        }
        console.log(`Found base folder : ${found.IDs[0]}`);
        return this.saveNoteInternal({ parentFolderId : found.IDs[0], note })
          .then(() => resolve())
          .catch(reject);
      });
    });
  }

  private findFolder({ name = '' }): Promise<{IDs?: string[]}> {
    return this.driveService.findFile({ name });
  }

  private saveNoteInternal({ note, parentFolderId}: { note: Note; parentFolderId: string}): Promise<{id: string}> {
    return this.driveService
      .createFile({
        withContent: JSON.stringify(note),
        name: note.name,
        folderId: parentFolderId,
      });
  }
}
