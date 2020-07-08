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
  private readonly urls = {
    createfolder: `https://www.googleapis.com/drive/v3/files?keepRevisionForever=true&key=${environment.drive_api_key}`,
  };
  constructor(private loginService: LoginService, private http: HttpClient) {}
  createFolder(name: string): Promise<void> {
    if (!this.loginService.isLoggedIn({ forScope: this.loginOptions.scope })) {
      this.loginService
        .login(this.loginOptions)
        .pipe(first())
        .subscribe((loggedIn) => {
          if (loggedIn) {
            this.loadApi().then(() => this.createFolderInternal({ name }));
          }
        });

      return Promise.resolve();
    }
    return this.loadApi().then(() => this.createFolderInternal({ name }));
  }

  private loadApi(): Promise<void> {
    return gapi.client.load('drive', 'v3');
  }

  private createFolderInternal({
    name = 'Speecher-Default-Folder',
  }): Promise<void> {
    const fileMetadata = {
      name,
      mimeType: 'application/vnd.google-apps.folder',
      folderColorRgb: '#007bff'
    };
    console.log('Logged in and trying to create folder in drive.');
    return gapi.client.drive.files
      .create({
        resource: fileMetadata,
        fields: 'id',
      })
      .then((response) => {
        switch (response.status) {
          case 200:
            const file = response.result;
            console.log('Created Folder Id: ', file.id);
            break;
          default:
            console.log('Error creating the folder, ' + response);
            break;
        }
      });
  }

  logout(): Observable<boolean> {
    return this.loginService.logout();
  }
}
