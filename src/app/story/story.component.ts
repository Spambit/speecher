import { Component } from '@angular/core';
import { ToastService } from '@services/toast.service';

@Component({
    selector: 'speecher-story',
    templateUrl: 'story.component.html',
    styleUrls: ['story.component.scss']
})
export class StoryComponent {
  constructor(private toastService: ToastService){}
  showToast() {
    this.toastService.showSuccess();
  }
}
