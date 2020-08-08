import { Injectable, ApplicationRef } from '@angular/core';
import { SwUpdate, UpdateActivatedEvent, UpdateAvailableEvent } from '@angular/service-worker';
import { first } from 'rxjs/operators';
import { interval, concat } from 'rxjs';
import { environment } from '../environments/env';

@Injectable({providedIn: 'root'})
export class AppUpdateService {
  private readonly sixHours = 6 * 60 * 60 * 1000;
  private readonly twoMinutes = 2 * 60 * 1000;
  private updateCheckInternal = this.sixHours;
  constructor(private updates: SwUpdate, private appRef: ApplicationRef) {
    if (environment.swDebug) {
      this.updateCheckInternal = this.twoMinutes;
    }
    this.logUpdates();
    this.configureCheckForUpdate();
    this.promptIfUpdateAvailable();
  }

  private logUpdates() {
    this.updates.available.subscribe(event => {
      console.log('Current version is: ', event.current);
      console.log('Available version is: ', event.available);
    });
    this.updates.activated.subscribe(event => {
      console.log('Old version was: ', event.previous);
      console.log('New version is: ', event.current);
    });
  }

  private promptUser(event: UpdateAvailableEvent): boolean {
    return window.confirm('Install update?');
  }

  private promptIfUpdateAvailable() {
    this.updates.available.subscribe(event => {
      if (this.promptUser(event)) {
        this.updates.activateUpdate().then(() => document.location.reload());
      }else {
        console.log('User opted not to install updates.');
      }
    });
  }

  private configureCheckForUpdate() {
    // Allow the app to stabilize first, before starting polling for updates with `interval()`.
    const appIsStable$ = this.appRef.isStable.pipe(first(isStable => isStable === true));
    const updateCheckInterval$ = interval(this.updateCheckInternal);
    const updateCheckOnceAppIsStable$ = concat(appIsStable$, updateCheckInterval$);

    updateCheckOnceAppIsStable$.subscribe(() => this.updates.checkForUpdate());
  }
}
