import {
  Injectable,
  ComponentFactoryResolver,
  ComponentFactory,
  Type,
  TemplateRef,
  ComponentRef,
  Injector,
  AfterViewInit,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { Subject, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class TemplateService {
  constructor(
    private resolver: ComponentFactoryResolver,
  ) {}
  public getTemplateContent(
    viewContainer: ViewContainerRef,
    component: Type<any>
  ): Promise<TemplateRef<any>> {
    return new Promise((resolve, reject) => {
      const factory: ComponentFactory<any> = this.resolver.resolveComponentFactory(
        component
      );
      const ref: ComponentRef<any> = viewContainer.createComponent(factory);
      const instance = ref.instance as TemplateWrapperBase;
      instance.getTemplateRef().subscribe(
        (template: TemplateRef<any>) => {
          if (template !== null) {
            resolve(template);
          } else {
            reject('template does not exist in this component: ' + component);
          }
          ref.destroy();
        },
        (error) => {
          reject(error);
          ref.destroy();
        }
      );
    });
  }
}

export class TemplateWrapperBase implements AfterViewInit {
  @ViewChild(TemplateRef) private content: TemplateRef<any>;
  private template: Subject<TemplateRef<any>> = new Subject();

  getTemplateRef(): Observable<TemplateRef<any>> {
    return this.template.asObservable();
  }

  ngAfterViewInit(): any {
    if (this.content) {
      this.template.next(this.content);
      this.template.complete();
    }
  }
}
