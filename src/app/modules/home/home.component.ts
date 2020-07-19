import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import * as AppRoutes from '../../routes';

@Component({
  selector: 'speecher-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  constructor(private router: Router, private route: ActivatedRoute) { }
  ngOnInit() {
  }
  createTodaysNote() {
    this.router.navigate([AppRoutes.names.write]);
  }
  showAllNotes() {
    this.router.navigate([AppRoutes.names.read]);
  }
}
