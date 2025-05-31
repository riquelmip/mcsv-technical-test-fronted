import { Routes } from '@angular/router';
import LayoutComponent from './shared/components/layout/layout.component';
import { isAuthenticatedGuard, isNotAuthenticatedGuard } from './auth/guards';
import { publicGuard } from './auth/guards/public.guard';

export const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
  },
  {
    path: 'admin',
    component: LayoutComponent,
    canActivate: [isAuthenticatedGuard],
    loadChildren: () =>
      import('./admin/admin.module').then((m) => m.AdminModule),
  },
  {
    path: 'auth',
    canActivate: [isNotAuthenticatedGuard],
    loadChildren: () => import('./auth/auth.module').then((m) => m.AuthModule),
  },

  {
    path: 'public',
    component: LayoutComponent,
    canActivate: [publicGuard],
    loadChildren: () =>
      import('./public/public.module').then((m) => m.PublicModule),
  },
];
