import * as Utils from '../utils';
import { Injectable } from '@angular/core';
import { Observable, Subject, of } from 'rxjs';

declare var gapi: any;

@Injectable({ providedIn: 'root' })
export class LoginService {
  readonly login$: Subject<boolean> = new Subject();
  private googleAuth: any;
  constructor() {
    this.loadGoogleApi();
  }

  private initClient({
    scope = '',
    apiKey = '',
    clientId = '',
    discoveryDocs = ([] = ['']),
  }): Promise<any> {
    if (!gapi) {
      return Promise.reject('Google Api not available.');
    }

    return gapi.client
      .init({
        apiKey,
        clientId,
        scope,
        discoveryDocs,
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
    console.log(`Logged in : ${isLoggedIn}`);
    this.login$.next(isLoggedIn);
  }

  private loadGoogleApi() {
    const gapiUrl = 'https://apis.google.com/js/api.js';
    const script = document.createElement('script');
    script.addEventListener('load', () => this.googleApiDidLoad());
    script.setAttribute('src', gapiUrl);
    document.body.appendChild(script);
  }

  isLoggedIn({ forScope = '' }): boolean {
    if (!this.googleAuth) {
      return false;
    }
    const user = this.googleAuth.currentUser.get();
    return user.hasGrantedScopes(forScope);
  }

  getUserInfo(): { avatar: string, name: string, email: string, shortName: string } {
    if (!this.googleAuth || !this.googleAuth.currentUser) {
      return;
    }
    const user = this.googleAuth.currentUser.get().getBasicProfile();
    return {
      avatar: user.getImageUrl(),
      name: user.getName(),
      email: user.getEmail(),
      shortName: user.getFamilyName()
    };
  }

  private googleApiDidLoad() {
    gapi.load('client:auth2', () => {
      console.log('Google auth loaded.');
    });
  }

  private throwDeferedError(msg: string): void {
    Utils.defer(() => {
      this.login$.error(msg);
    });
  }

  public login({
    scope = '',
    key = '',
    clientId = '',
    discoveryDocs = ([] = ['']),
  }): Observable<boolean> {
    this.initClient({ scope, apiKey: key, clientId, discoveryDocs })
      .then((_) => {
        if (this.googleAuth.isSignedIn.get()) {
          this.login$.next(true);
        } else {
          const builder = new gapi.auth2.SigninOptionsBuilder();
          builder.setPrompt('select_account');
          builder.setScope('profile').setScope('email');
          this.googleAuth.signIn(builder).catch((e) => {
            this.throwDeferedError(e);
          });
        }
      })
      .catch((e) => {
        this.login$.error(e);
      });
    return this.login$;
  }
  public logout(): Observable<boolean> {
    if (!this.googleAuth) {
      this.throwDeferedError('Google Auth was not loaded.');
    } else if (!this.googleAuth.isSignedIn.get()) {
      Utils.defer(() => this.login$.next(false));
    } else {
      this.googleAuth.signOut().catch((e) => {
        this.throwDeferedError('logout failed');
      });
    }
    return this.login$;
  }
}
