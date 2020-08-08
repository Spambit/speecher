import { Component, Input } from '@angular/core';
import { TemplateWrapperBase } from '@services/template.service';
import { IWord } from '@services/filter.result';

@Component({
    selector: 'speecher-toast-accordian',
    templateUrl: 'accordian.component.html',
    styleUrls: ['accordian.component.scss'],
})
export class AccordianComponent extends TemplateWrapperBase {
  identify(index: number, item: string) {
    return index;
  }
}
