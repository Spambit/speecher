// Angular Imports
import { NgModule } from '@angular/core';

// This Module's Components
import { StoryComponent } from './story.component';
import { RouterModule } from '@angular/router';

const routes = [{
  path : '',
  component: StoryComponent,
  pathMatch: 'full',
}];

@NgModule({
    imports: [
      RouterModule.forChild(routes),
    ],
    declarations: [
        StoryComponent,
    ],
    exports: [
        StoryComponent,
    ]
})
export class StoryModule {
}
