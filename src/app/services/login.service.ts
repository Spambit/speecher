import * as Utils from '../utils';
import { Injectable } from '@angular/core';
import { environment } from '~/environments/environment';
import { Observable, Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class LoginService {
  private login$: Subject<boolean> = new Subject();
  private googleAuth: any;
  constructor(private http: HttpClient) {
    this.loadGoogleApi();
  }

  private initClient(): Promise<any> {
    if (!gapi) {
      return Promise.reject('Google Api not available.');
    }

    return gapi.client
      .init({
        apiKey: environment.youtube_api_key,
        clientId: environment.youtube_client_id,
        scope: 'https://www.googleapis.com/auth/youtube.force-ssl',
        discoveryDocs: [
          'https://www.googleapis.com/discovery/v1/apis/youtube/v3/rest',
        ],
      })
      .then(
        () => {
          this.googleAuth = gapi.auth2.getAuthInstance();
          // Listen for sign-in state changes.
          this.googleAuth.isSignedIn.listen((isSignedIn) =>
            this.updateSigninStatus(isSignedIn)
          );
        },
        (e) => Promise.reject(e)
      );
  }

  private updateSigninStatus(isLoggedIn: boolean) {
    this.login$.next(isLoggedIn);
  }

  private loadGoogleApi() {
    const gapi = 'https://apis.google.com/js/api.js';
    const script = document.createElement('script');
    script.addEventListener('load', () => this.googleApiDidLoad());
    script.setAttribute('src', gapi);
    document.body.appendChild(script);
  }

  private googleApiDidLoad() {
    gapi.load('client:auth2', () => {
      this.initClient().catch((e) => {
        this.login$.error(e);
      });
    });
  }

  private buildSignInOptions(): gapi.auth2.SigninOptionsBuilder {
    const options = new gapi.auth2.SigninOptionsBuilder();
    options.setPrompt('select_account');
    options.setScope('profile').setScope('email');
    return options;
  }

  private throwDeferedError(msg: string): void {
    Utils.defer(() => {
      this.login$.error(msg);
      this.login$ = new Subject();
    });
  }

  public login(): Observable<boolean> {
    if (!this.googleAuth) {
      this.throwDeferedError('Google Auth was not loaded.');
    } else if (this.googleAuth.isSignedIn.get()) {
      Utils.defer(() => this.login$.next(true));
    } else {
      this.googleAuth.signIn(this.buildSignInOptions()).catch((e) => {
        this.throwDeferedError(e);
      });
    }
    return this.login$; // TODO - check its deferness later - if signIn immediately emits next.
  }
  public logout(): Observable<boolean> {
    if (!this.googleAuth) {
      this.throwDeferedError('Google Auth was not loaded.');
    } else if (!this.googleAuth.isSignedIn.get()) {
      Utils.defer(() => this.login$.next(true));
    } else {
      this.googleAuth.signOut().catch((e) => {
        this.throwDeferedError('logout failed');
      });
    }
    return this.login$;
  }
}
