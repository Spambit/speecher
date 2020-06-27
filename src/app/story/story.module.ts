// Angular Imports
import { NgModule } from '@angular/core';

// This Module's Components
import { StoryComponent } from './story.component';
import { RouterModule } from '@angular/router';
import { ToastContainerComponent } from '@components/speecher-toast/speecher-toast.component';
import { AccordianComponent } from '@components/accordian/accordian.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';

const routes = [{
  path : '',
  component: StoryComponent,
  pathMatch: 'full',
}];

@NgModule({
    imports: [
      CommonModule,
      RouterModule.forChild(routes),
      NgbModule
    ],
    declarations: [
        StoryComponent,
        ToastContainerComponent,
    ],
    exports: [
        StoryComponent,
        ToastContainerComponent
    ]
})
export class StoryModule {
}
