import { Routes } from '@angular/router';
import { HomeComponent } from '@components/home/home.component';

export const names = {
  home: 'home',
};

export const routes: Routes = [
  {
    path: '',
    redirectTo: names.home,
    pathMatch: 'full'
  },
  {
    path: 'index.html',
    redirectTo: names.home,
    pathMatch: 'full',
  },
  {
    path: names.home,
    component: HomeComponent,
    pathMatch: 'full',
  },
];
