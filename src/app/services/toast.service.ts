import { Injectable, TemplateRef } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ToastService {
  toasts: any[] = [];

  show(textOrTpl: string | TemplateRef<any>, options: any = {}) {
    this.toasts.push({ textOrTpl, ...options });
  }
  showStandard() {
    this.show('I am a standard toast');
  }

  showSuccess(successTpl: string | TemplateRef<any> = '') {
    this.show(successTpl, {
      classname: 'bg-success text-light',
      header: 'Success'
    });
  }

  showDanger(dangerTpl: string = '') {
    this.show(dangerTpl, { classname: 'bg-danger text-light'});
  }

  remove(toast) {
    this.toasts = this.toasts.filter(t => t !== toast);
  }
}
