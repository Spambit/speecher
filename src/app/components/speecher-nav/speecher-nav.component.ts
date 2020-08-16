import { Component, Input, OnInit } from '@angular/core';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';

@Component({
  selector: 'speecher-nav',
  templateUrl: 'speecher-nav.component.html',
  styleUrls: ['speecher-nav.component.scss'],
})
export class SpeecherNavComponent implements OnInit {
  constructor() {}
  @Input() config?: NavConfig = {
    header: '',
    button: { simple: { show: false }, dropdown: false },
  };
  ngOnInit() {}
}

export interface NavConfig {
  button?: {
    simple?: {
      iconColor?: string;
      show: boolean;
      icon?: IconDefinition;
      click?: (e: Event) => void;
    };
    dropdownTitle?: string;
    dropdown?: boolean;
    dropdownItems?: NavDropDownItem[];
  };
  header?: string;
}

export interface NavDropDownItem {
  click?: (e: Event, item: NavDropDownItem) => void;
  text?: string;
}
