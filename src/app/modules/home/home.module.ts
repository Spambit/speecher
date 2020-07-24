import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home.component';
import { SharedModule } from '../shared/shared.module';
import { RouterModule } from '@angular/router';
const routes = [{
  path : '',
  component: HomeComponent,
  pathMatch: 'full',
}];
@NgModule({
  imports: [
    SharedModule,
    RouterModule.forChild(routes),
  ],
  declarations: [HomeComponent]
})
export class SpeecherHomeModule { }
