import { NgModule } from '@angular/core';
import { CORE_COMPONENTS } from '../../components/index';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { FormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    NgbModule,
    HttpClientModule,
    FontAwesomeModule,
  ],
  exports: [
    CommonModule,
    RouterModule,
    FormsModule,
    NgbModule,
    HttpClientModule,
    FontAwesomeModule,
    ...CORE_COMPONENTS,
  ],
  declarations: [...CORE_COMPONENTS],
})
export class SharedModule {}
