import { Component, OnInit, HostListener, ChangeDetectorRef, AfterViewInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import * as AppRoutes from '../../routes';
import { LoginService } from '@services/login.service';
import { DriveService } from '@services/drive.service';
import { ToastService } from '@services/toast.service';

@Component({
  selector: 'speecher-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  constructor(
    private router: Router,
    private driveService: DriveService,
    private toastService: ToastService,
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
  ngOnInit() {
    this.loginService.login$.subscribe({
      next: (loggedIn) => {
        if (loggedIn) {
          this.loginSuccess();
        }else {
          this.loggedOut();
        }
      },
      error: (err) => {
        this.loginFail(err);
      },
    });
    // setInterval(() => { this.isLoggedIn = !this.isLoggedIn; }, 5000);
  }

  createTodaysNote() {
    this.router.navigate([AppRoutes.names.write]);
  }

  showAllNotes() {
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
    this.cd.detectChanges();
  }

  loginFail(err: any) {
    this.isLoggedIn = false;
    this.user = {};
    this.cd.detectChanges();
  }

  loggedOut() {
    this.isLoggedIn = false;
    this.user = {};
    this.cd.detectChanges();
  }
}
