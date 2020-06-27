import { Component, ViewEncapsulation, ViewChild, OnInit, AfterViewChecked, AfterViewInit, ContentChild } from '@angular/core';
import { TemplateWrapperBase } from '@services/template.service';
import { NgbAccordion } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'speecher-toast-accordian',
    templateUrl: 'accordian.component.html',
    styleUrls: ['accordian.component.scss'],
})
export class AccordianComponent extends TemplateWrapperBase {
}
