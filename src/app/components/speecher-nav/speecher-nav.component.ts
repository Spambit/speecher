import { Component, Input, OnInit } from '@angular/core';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';

@Component({
  selector: 'speecher-nav',
  templateUrl: 'speecher-nav.component.html',
  styleUrls: ['speecher-nav.component.scss'],
})
export class SpeecherNavComponent implements OnInit{
  constructor(){}
  @Input() config?: NavConfig = {
    header: '',
    button: { show: false },
  };
  ngOnInit() {
  }
}

export interface NavConfig {
  button?: {
    iconColor?: string;
    show: boolean;
    icon?: IconDefinition;
    click?: (e: Event) => void;
  };
  header?: string;
}
