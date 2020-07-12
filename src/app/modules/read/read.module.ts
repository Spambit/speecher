import { NgModule } from '@angular/core';
import { StoryComponent } from './read.component';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../shared/shared.module';

const routes = [{
  path : '',
  component: StoryComponent,
  pathMatch: 'full',
}];

@NgModule({
    imports: [
      SharedModule,
      RouterModule.forChild(routes),
    ],
    declarations: [
        StoryComponent,
    ],
    exports: [
        StoryComponent,
    ]
})
export class SpeecherStoryReadingModule {
}
