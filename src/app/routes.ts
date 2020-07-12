import { Routes } from '@angular/router';

export const names = {
  home: 'home',
  story: 'story',
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
    loadChildren: () => import('./modules/create/create.module').then(m => m.SpeecherStoryCreationModule),
  },
  {
    path: names.story,
    pathMatch: 'full',
    loadChildren: () => import('./modules/read/read.module').then(m => m.SpeecherStoryReadingModule),
  }
];
