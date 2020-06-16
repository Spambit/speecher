import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import * as fromRoutes from './routes';

@NgModule({
  imports: [RouterModule.forRoot(fromRoutes.routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
