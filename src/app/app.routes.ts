import { Routes } from '@angular/router';
import { LoginComp } from './components/login-comp/login-comp';
import { RegisterComp } from './components/register-comp/register-comp';
import { AccountDetaiComp } from './components/account-detai-comp/account-detai-comp';
import { authServiceGuard } from './auth/auth-service-guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'home',
    loadComponent: () => import('./pages/home/home').then(m => m.HomeComponent),
    title: 'Home - Movie App'
  },
 
  {
    path:'login',
    component : LoginComp,
    title:"Login"
  },
  {
    path:'register',
    component : RegisterComp,
    title:"Register"
  },
  {
    path:'accdetails',
    component : AccountDetaiComp,
    title:"AccountDetails",
    canActivate: [authServiceGuard]
  },

  {
    path: '**',
    redirectTo: 'home'
  },
];
