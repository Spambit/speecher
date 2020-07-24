import { NgModule } from '@angular/core';
import { CreateStoryComponent } from './create.component';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
const routes = [
  {
    path: '',
    component: CreateStoryComponent,
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [
    SharedModule,
    RouterModule.forChild(routes),
  ],
  exports: [
    CreateStoryComponent
  ],
  declarations: [CreateStoryComponent],
})
export class SpeecherStoryCreationModule {}
