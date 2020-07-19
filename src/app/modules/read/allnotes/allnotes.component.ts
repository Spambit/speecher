import { Component, OnInit } from '@angular/core';
import { Note } from '@services/filter.result';
import { createInstanceOfClass } from 'src/app/utils';
import { NavConfig } from '@components/speecher-nav/speecher-nav.component';

@Component({
  selector: 'speecher-allnotes',
  templateUrl: 'allnotes.component.html',
  styleUrls: ['allnotes.component.scss'],
})
export class AllNotesComponent implements OnInit{
  navConfig: NavConfig = {
    header: 'All Stories',
    button: { show : false}
  };
  notes: Note[] = [];
  selectedItem: HTMLElement;
  listClick(event: Event, listItem: HTMLElement) {
    this.selectedItem = listItem;
  }
  ngOnInit() {
    for (let i = 0; i < 20; i++) {
      this.notes.push(createInstanceOfClass(Note, { name: 'One item' }));
    }
  }
}
