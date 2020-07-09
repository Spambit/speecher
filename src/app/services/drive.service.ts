import { Injectable } from '@angular/core';
import { LoginService } from './login.service';
import { first } from 'rxjs/operators';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from '../environments/env';
import { Observable } from 'rxjs';

declare var gapi: any;

@Injectable({ providedIn: 'root' })
export class DriveService {
  private loginOptions = {
    key: environment.drive_api_key,
    clientId: environment.drive_client_id,
    scope: 'https://www.googleapis.com/auth/drive.appdata',
    discoveryDocs: [
      'https://www.googleapis.com/discovery/v1/apis/drive/v3/rest',
    ],
  };
  constructor(private loginService: LoginService) {}
  createBaseFolder(name?: string): Promise<{ id?: string }> {
    return this.loadGoogleDrive().then(() =>
      this.createFolderInternal({ name })
    );
  }

  createFile({
    withContent = '',
    folderId = '',
    name = ''
  }): Promise<{ id?: string; err?: any }> {
    return this.loadGoogleDrive().then(() =>
      this.createFileInternal({ name, folderId, content: withContent })
    );
  }

  findFile({ id }: { id: string }): Promise<boolean> {
    return this.loadGoogleDrive().then(() => {
      return gapi.client.drive
        .list({
          // tslint:disable-next-line: quotemark
          q: `id=${id}`,
          fields: 'nextPageToken, files(id, name)',
          spaces: 'drive',
        })
        .then((res) => (res.status === 200 ? true : false))
        .catch(() => false);
    });
  }

  private loadGoogleDrive(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (
        !this.loginService.isLoggedIn({ forScope: this.loginOptions.scope })
      ) {
        this.loginService
          .login(this.loginOptions)
          .pipe(first())
          .subscribe((loggedIn) => {
            if (loggedIn) {
              this.loadApi().then(resolve).catch(reject);
            } else {
              reject();
            }
          });
        return;
      }
      this.loadApi().then(resolve).catch(reject);
    });
  }

  private loadApi(): Promise<void> {
    if (gapi && gapi.client.drive) {
      return Promise.resolve();
    }
    return gapi.client.load('drive', 'v3');
  }

  private createFolderInternal({
    name = 'Speecher-Data-Folder',
  }): Promise<{ id?: string}> {
    const fileMetadata = {
      name,
      mimeType: 'application/vnd.google-apps.folder',
      folderColorRgb: '#007bff',
    };
    console.log('Logged in and trying to create folder in drive.');
    return this.createFileOrFolder({metadata: fileMetadata});
  }

  private createFileInternal({
    name,
    folderId,
    content
  }): Promise<{id?: string }> {
    const fileMetadata = {
      name,
      parent: [folderId],
    };
    const media = {
      mimeType: 'application/json',
      body: content
    };
    console.log('Logged in and trying to create file in drive.');
    return this.createFileOrFolder({metadata: fileMetadata, media});
  }

  private createFileOrFolder({ media, metadata }: {media?: any, metadata: any}): Promise<{id?: string}> {
    return new Promise((resolve, reject) => {
      gapi.client.drive.files
        .create({
          resource: metadata,
          media,
          fields: 'id',
        })
        .then((response) => {
          switch (response.status) {
            case 200:
              const file = response.result;
              console.log('Created file or folder Id: ', file.id);
              resolve({ id: file.id });
              break;
            default:
              console.log('Error creating the file or folder, ' + response);
              reject(response);
              break;
          }
        });
    });
  }

  logout(): Observable<boolean> {
    return this.loginService.logout();
  }
}
