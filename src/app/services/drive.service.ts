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
    return new Promise((resolve, reject) => {
      this.loadGoogleDrive()
        .then(() => {
          return this.findFile({ name });
        })
        .then(found => {
          if (found.IDs.length === 0) {
            this.createFolderInternal({ name }).then(resolve);
          }
          return resolve({id: found.IDs[0]});
        })
        .catch(reject);
    });
  }

  isLoggedIn() {
    return this.loginService.isLoggedIn({ forScope: this.loginOptions.scope });
  }

  findFile({
    id,
    name,
  }: {
    id?: string;
    name?: string;
  }): Promise<{ IDs?: string[] }> {
    let query = '';
    if (name) {
      query = `name = '${name}'`;
    } else if (id) {
      query = `'${id}' in parents`;
    }

    return new Promise<{ IDs?: string[] }>((resolve, reject) => {
      this.loadGoogleDrive()
      .then(() => {
        return gapi.client.drive.files.list({
          // tslint:disable-next-line: quotemark
          q: query,
          fields: 'nextPageToken, files(id, name)',
          spaces: 'drive',
        });
      })
      .then((res) => {
        const files = res.result && res.result.files ? res.result.files : [];
        const fileIds: string[] = files.map((file) => file.id);
        return fileIds;
      }).
      then(fileIds => {
        resolve({IDs : fileIds});
      })
      .catch(() => {
        return [];
      });
    });
  }

  login(): Promise<void> {
    return this.loadGoogleDrive();
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

  createFile({
    name,
    withContent,
    folderId,
    fileId
  }: {
    name: string;
    withContent: any;
    folderId?: string;
    fileId?: string;
  }): Promise<void> {
    return this.findFile({ name }).then((found) => {
      if (found.IDs.length !== 0) {
        return this.createFileWithJSONContent({
          name,
          data: JSON.stringify(withContent),
          fileId,
          update: true,
        }).catch(() => console.log('Error: error updating file.'));
      }
      return this.createFileWithJSONContent({
        name,
        data: JSON.stringify(withContent),
        parentFolderId: folderId,
        update: false,
      }).catch((e) => {
        console.log('Error: error creating file.');
      });
    });
  }

  private createFileWithJSONContent({
    name,
    data,
    parentFolderId,
    update,
    fileId
  }: {
    update: boolean;
    name: string;
    data: string;
    parentFolderId?: string;
    fileId?: string;
  }): Promise<void> {
    return new Promise((resolve, reject) => {
      const boundary = '-------speecher-boundary';
      const delimiter = '\r\n--' + boundary + '\r\n';
      const closeDelim = '\r\n--' + boundary + '--';

      const contentType = 'application/json';

      const metadata: any = {
        name,
        mimeType: contentType,
      };
      if (parentFolderId) {
        metadata.parents = [parentFolderId];
      }

      const multipartRequestBody =
        delimiter +
        'Content-Type: application/json\r\n\r\n' +
        JSON.stringify(metadata) +
        delimiter +
        'Content-Type: ' +
        contentType +
        '\r\n\r\n' +
        data +
        closeDelim;

      const urlPath = fileId ? `/upload/drive/v3/files/${fileId}` : `/upload/drive/v3/files`;
      const request = gapi.client.request({
        path: urlPath,
        method: !update ? 'POST' : 'PUT',
        params: { uploadType: 'multipart' },
        headers: {
          'Content-Type': 'multipart/related; boundary="' + boundary + '"',
        },
        body: multipartRequestBody,
      });
      request.execute((_, res) => {
        if (res.status !== 200) {
          return reject();
        }
        resolve();
      });
    });
  }
}
