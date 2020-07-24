import { Routes } from '@angular/router';

export const names = {
  home: 'home',
  read: 'read',
  write: 'write',
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
    pathMatch: 'full',
    loadChildren: () => import('./modules/home/home.module').then(m => m.SpeecherHomeModule),
  },
  {
    path: names.write,
    pathMatch: 'full',
    loadChildren: () => import('./modules/create/create.module').then(m => m.SpeecherStoryCreationModule),
  },
  {
    path: names.read,
    pathMatch: 'full',
    loadChildren: () => import('./modules/read/read.module').then(m => m.SpeecherStoryReadingModule),
  }
];
