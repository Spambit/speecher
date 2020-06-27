import {Component, TemplateRef, HostBinding, ViewEncapsulation} from '@angular/core';
import {ToastService} from '@services/toast.service';


@Component({
  selector: 'speecher-toasts',
  styleUrls: ['./speecher-toast.component.scss'],
  template: `
    <ngb-toast
      *ngFor="let toast of toastService.toasts"
      [class]="toast.classname"
      [autohide]="true"
      [delay]="toast.delay || 6000000"
      (hide)="toastService.remove(toast)"
      [header]="toast.header"
    >
      <ng-template [ngIf]="isTemplate(toast)" [ngIfElse]="text">
        <ng-template [ngTemplateOutlet]="toast.textOrTpl"></ng-template>
      </ng-template>

      <ng-template #text>{{ toast.textOrTpl }}</ng-template>
    </ngb-toast>
  `,
})
export class ToastContainerComponent {
  constructor(public toastService: ToastService) {}
  @HostBinding('class.ngb-toasts') applyngbToastClass = true;
  isTemplate(toast) {
    return toast.textOrTpl instanceof TemplateRef;
  }
}
