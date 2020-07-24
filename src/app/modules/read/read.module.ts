import { NgModule } from '@angular/core';
import { StoryComponent } from './read.component';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { AllNotesComponent } from './allnotes/allnotes.component';

const routes = [
  {
    path : '',
    component: AllNotesComponent,
    pathMatch: 'full',
  },
  {
    path: 'story',
    component: StoryComponent,
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [SharedModule, RouterModule.forChild(routes)],
  declarations: [StoryComponent, AllNotesComponent],
  exports: [StoryComponent, AllNotesComponent],
})
export class SpeecherStoryReadingModule {}
