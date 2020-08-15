import { Injectable, TemplateRef } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ToastService {
  toasts: any[] = [];

  show(textOrTpl: string | TemplateRef<any>, options: ToastOption  = {}) {
    this.toasts.push({ textOrTpl, ...options });
  }
  showStandard() {
    this.show('I am a standard toast');
  }

  showSuccess(successTpl: string | TemplateRef<any> = '', duration: number = 3000) {
    this.show(successTpl, {
      classname: 'bg-success text-light',
      header: 'Success',
      delay: duration
    });
  }

  showDanger(dangerTpl: string = '', duration: number = 3000) {
    this.show(dangerTpl, { classname: 'bg-danger text-light', delay: duration});
  }

  remove(toast) {
    this.toasts = this.toasts.filter(t => t !== toast);
  }
  removeLast(){
    this.toasts.pop();
  }
}

export interface ToastOption {
  context?: any;
  classname?: string;
  delay?: number;
  header?: string;
}
