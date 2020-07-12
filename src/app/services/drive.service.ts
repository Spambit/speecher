import { Injectable } from '@angular/core';
import { LoginService } from './login.service';
import { first } from 'rxjs/operators';
import { environment } from '../environments/env';
import { Observable } from 'rxjs';
import { rejects } from 'assert';

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
  }): Promise<{ id?: string }> {
    const fileMetadata = {
      name,
      mimeType: 'application/vnd.google-apps.folder',
      folderColorRgb: '#007bff',
    };
    console.log('Logged in and trying to create folder in drive.');
    return new Promise((resolve, reject) => {
      const options = {
        resource: fileMetadata,
        fields: 'id',
      };
      gapi.client.drive.files.create(options).then((response) => {
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

  createFile({ name, withContent, folderId }: {name: string, withContent: string, folderId: string}): Promise<void> {
    return this.createFileWithJSONContent({name, data : withContent, folderId});
  }

  private createFileWithJSONContent({ name, data, folderId }: {name: string, data: any, folderId: string}): Promise<void> {
    return new Promise((resolve, reject) => {
      const boundary = '-------speecher-boundary';
      const delimiter = '\r\n--' + boundary + '\r\n';
      const closeDelim = '\r\n--' + boundary + '--';

      const contentType = 'application/json';

      const metadata = {
        name,
        mimeType: contentType,
        parents: [folderId]
      };

      const multipartRequestBody =
        delimiter +
        'Content-Type: application/json\r\n\r\n' +
        JSON.stringify(metadata) +
        delimiter +
        'Content-Type: ' +
        contentType +
        '\r\n\r\n' +
        JSON.stringify(data) +
        closeDelim;

      const request = gapi.client.request({
        path: '/upload/drive/v3/files',
        method: 'POST',
        params: { uploadType: 'multipart' },
        headers: {
          'Content-Type': 'multipart/related; boundary="' + boundary + '"',
        },
        body: multipartRequestBody,
      });
      request.execute((_ , res) => {
        if (res.status !== 200) {
          return reject();
        }
        resolve();
      });
    });
  }
}
