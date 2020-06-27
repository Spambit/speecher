import {
  Component,
  ContentChild,
  ViewChild,
  TemplateRef,
  OnInit,
  ViewContainerRef,
} from '@angular/core';
import { ToastService } from '@services/toast.service';
import { TemplateService } from '@services/template.service';
import { AccordianComponent } from '@components/accordian/accordian.component';

@Component({
  selector: 'speecher-story',
  templateUrl: 'story.component.html',
  styleUrls: ['story.component.scss'],
})
export class StoryComponent implements OnInit {
  private toastBody: TemplateRef<any>;
  constructor(
    private toastService: ToastService,
    private templateService: TemplateService,
    private viewRef: ViewContainerRef
  ) {}
  ngOnInit() {
    this.templateService.getTemplateContent(this.viewRef, AccordianComponent).then((ref) => {
      this.toastBody = ref;
    });
  }
  showToast() {
    this.toastService.showSuccess(this.toastBody);
  }
}
