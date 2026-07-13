import { Routes } from '@angular/router';
import { Login } from './pages/login/login';
import { Dashboard } from './pages/dashboard/dashboard';
import { authGuard, noAuthGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: 'login', component: Login, canActivate: [noAuthGuard] },
  { path: '', component: Dashboard, canActivate: [authGuard] },
];
