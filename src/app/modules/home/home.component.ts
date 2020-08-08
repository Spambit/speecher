import { Component, OnInit, HostListener } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import * as AppRoutes from '../../routes';

@Component({
  selector: 'speecher-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  constructor(private router: Router, private route: ActivatedRoute) { }
  deferredPrompt: any;
  shouldShowAddToHomeBtn = false;
  ngOnInit() {
  }
  createTodaysNote() {
    this.router.navigate([AppRoutes.names.write]);
  }
  showAllNotes() {
    this.router.navigate([AppRoutes.names.read]);
  }

  @HostListener('window:beforeinstallprompt', ['$event'])
  onbeforeinstallprompt(e) {
    // Prevent Chrome 67 and earlier from automatically showing the prompt
    e.preventDefault();
    // Stash the event so it can be triggered later.
    this.deferredPrompt = e;
    this.shouldShowAddToHomeBtn = true;
  }


  addToHomeScreen() {
    // Show the prompt
    this.deferredPrompt.prompt();
    // Wait for the user to respond to the prompt
    this.deferredPrompt.userChoice
      .then((choiceResult) => {
        if (choiceResult.outcome === 'accepted') {
          console.log('User accepted the A2HS prompt');
          this.shouldShowAddToHomeBtn = false;
        } else {
          console.log('User dismissed the A2HS prompt');
          this.shouldShowAddToHomeBtn = true;
        }
        this.deferredPrompt = null;
      });
  }
}
