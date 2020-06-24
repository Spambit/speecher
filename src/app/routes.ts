import { Routes } from '@angular/router';
import { HomeComponent } from '@components/home/home.component';
import { StoryModule } from './story/story.module';

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
    component: HomeComponent,
    pathMatch: 'full',
  },
  {
    path: names.story,
    pathMatch: 'full',
    loadChildren: () => import('./story/story.module').then(m => m.StoryModule),
  }
];
