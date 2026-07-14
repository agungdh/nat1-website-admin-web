import { Routes } from '@angular/router';
import { Login } from './pages/login/login';
import { Layout } from './pages/layout/layout';
import { authGuard, noAuthGuard } from './guards/auth.guard';
import { Dashboard } from './pages/dashboard/dashboard';
import { Tags } from './pages/tags/tags';

export const routes: Routes = [
  { path: 'login', component: Login, canActivate: [noAuthGuard] },
  {
    path: '',
    component: Layout,
    canActivate: [authGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: Dashboard },
      { path: 'tags', component: Tags },
    ],
  },
];
