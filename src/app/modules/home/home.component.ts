import {
  Component,
  OnInit,
  ChangeDetectorRef,
  OnChanges,
  NgZone,
} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import * as AppRoutes from '../../routes';
import { LoginService } from '@services/login.service';
import { DriveService } from '@services/drive.service';
import { ToastService } from '@services/toast.service';
import {
  NavConfig,
} from '@components/speecher-nav/speecher-nav.component';

@Component({
  selector: 'speecher-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  constructor(
    private router: Router,
    private driveService: DriveService,
    private loginService: LoginService,
    private cd: ChangeDetectorRef
  ) {}
  deferredPrompt: any;
  shouldShowAddToHomeBtn = false;
  isLoggedIn = false;
  user: {
    avatar?: string;
    name?: string;
    email?: string;
    shortName?: string;
  } = {};
  navConfig: NavConfig = {
    button: {
      dropdown: true,
      dropdownTitle: 'Start Now',
      dropdownItems: [
        {
          text: `Create Today's Note`,
          click: (e, item) => this.createTodaysNote(),
        },
        {
          text: `My Days`,
          click: (e, item) => this.showAllNotes(),
        },
        {
          text: `All My Words`,
          click: (e, item) => {},
        },
        {
          text: `All My Phrases`,
          click: (e, item) => {},
        },
        {
          text: `Pick 5 Randoms`,
          click: (e, item) => {},
        },
        {
          text: `A Random Sweet Old Day`,
          click: (e, item) => {},
        }
      ],
    },
  };
  ngOnInit() {
    this.loginService.login$.subscribe({
      next: (loggedIn) => {
        if (loggedIn) {
          this.loginSuccess();
        } else {
          this.loggedOut();
        }
      },
      error: (err) => {
        this.loginFail(err);
      },
    });
  }

  private createTodaysNote() {
    this.router.navigate([AppRoutes.names.write]);
  }

  private showAllNotes() {
    this.router.navigate([AppRoutes.names.read]);
  }

  login() {
    this.driveService.login();
  }

  logout() {
    this.loginService.logout();
  }

  loginSuccess() {
    this.isLoggedIn = true;
    this.user = this.loginService.getUserInfo();
    setTimeout(() => this.cd.detectChanges(), 500);
  }

  loginFail(err: any) {
    this.isLoggedIn = false;
    this.user = {};
  }

  loggedOut() {
    this.isLoggedIn = false;
    this.user = {};
    setTimeout(() => this.cd.detectChanges(), 500);
  }
}
