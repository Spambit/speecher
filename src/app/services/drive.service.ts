import { Injectable } from '@angular/core';
import { LoginService } from './login.service';
import { first } from 'rxjs/operators';
import { environment } from '../environments/env';
import { Observable } from 'rxjs';
import { rejects, strict } from 'assert';

declare var gapi: any;

@Injectable({ providedIn: 'root' })
export class DriveService {
  static readonly defaultFolderName = 'Speecher-Data-Folder';
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
        .then((found) => {
          if (found.IDs.length === 0) {
            return this.createFolderInternal({ name }).then(resolve);
          }
          return resolve({ id: found.IDs[0] });
        })
        .catch(reject);
    });
  }

  isLoggedIn() {
    return this.loginService.isLoggedIn({ forScope: this.loginOptions.scope });
  }
  /**
   * Retrieve a list of files belonging to a folder.
   *
   * @param folderId ID of the folder to retrieve files from.
   * @param callback Function to call when the request is complete.
   *
   */
  private allFilesInFolder(
    folderId: string,
    callback: (files: { id: string, mimeType: string, name: string }[]) => void
  ) {
    const retrievePageOfChildren = (request, result: { id: string, mimeType: string, name: string }[]) => {
      request.execute((resp) => {
        result = result.concat(resp.files);
        const nextPageToken = resp.nextPageToken;
        if (nextPageToken) {
          request = gapi.client.drive.files.list({
            q: 	`${folderId} in parents and trashed = false`,
            pageToken: nextPageToken,
            fields: '*'
          });
          retrievePageOfChildren(request, result);
        } else {
          callback(result);
        }
      });
    };
    const initialRequest = gapi.client.drive.files.list({
      q: `'${folderId}' in parents and trashed = false`,
      fields: 'nextPageToken, files(id, name)',
      spaces: 'drive',
    });
    retrievePageOfChildren(initialRequest, []);
  }

  fileContent(fileId: string): Promise<{content: string}> {
    return new Promise((resolve, reject) => {
      const request = (gapi.client as any).drive.files.get({
        fileId,
        alt: 'media',
      });
      request.execute((content: any) => {
          if (content.error) {
            reject();
          }
          resolve({ content });
      });
    });
  }

  allFilesInBaseFolder(): Promise<{ id: string }[]> {
    return new Promise((resolve, reject) => {
      this.findFile({name: DriveService.defaultFolderName}).then((folder) => {
        if (folder.IDs.length !== 0) {
          return folder.IDs[0];
        }
        return '';
       }).then(id => {
         if (id === ''){
           return [];
         }
         return this.allFilesInFolder(id, resolve);
       }).catch(reject);
    });
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
      query = `name = '${name}' and trashed = false`;
    } else if (id) {
      query = `'${id}' in parents and trashed = false`;
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
        })
        .then((fileIds) => {
          resolve({ IDs: fileIds });
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
    name = DriveService.defaultFolderName,
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
  }: {
    name: string;
    withContent: any;
    folderId?: string;
  }): Promise<{ id: string }> {
    return new Promise((resolve, reject) => {
      this.findFile({ name }).then((found) => {
        if (found.IDs.length !== 0) {
          return this.createFileWithJSONContent({
            name,
            data: JSON.stringify(withContent),
            fileId: found.IDs[0],
            update: true,
          })
            .then((val) => resolve(val))
            .catch(() => {
              console.log('Error: error updating file.');
              reject();
            });
        }
        return this.createFileWithJSONContent({
          name,
          data: JSON.stringify(withContent),
          parentFolderId: folderId,
          update: false,
        })
          .then((val) => resolve(val))
          .catch(() => {
            console.log('Error: error creating file.');
            reject();
          });
      });
    });
  }

  private createFileWithJSONContent({
    name,
    data,
    parentFolderId,
    update,
    fileId,
  }: {
    update: boolean;
    name: string;
    data: string;
    parentFolderId?: string;
    fileId?: string;
  }): Promise<{ id: string }> {
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
      if (fileId) {
        console.log(`Updating file in folder id: ${fileId}`);
      } else {
        console.log(`Creating file in folder id: ${parentFolderId}`);
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

      const urlPath = fileId
        ? `/upload/drive/v3/files/${fileId}`
        : `/upload/drive/v3/files`;
      const request = gapi.client.request({
        path: urlPath,
        method: !update ? 'POST' : 'PATCH',
        params: { uploadType: 'multipart' },
        headers: {
          'Content-Type': 'multipart/related; boundary="' + boundary + '"',
        },
        body: multipartRequestBody,
      });
      request.execute((file) => {
        if (!file) {
          return reject();
        }
        return resolve({ id: file.id });
      });
    });
  }
}
