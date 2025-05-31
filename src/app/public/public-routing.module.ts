import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import LayoutComponent from '../shared/components/layout/layout.component';
import { ResetPaswordComponent } from '../auth/pages/reset-pasword/reset-pasword.component';
import { ForgotPaswordComponent } from '../auth/pages/forgot-pasword/forgot-pasword.component';

const routes: Routes = [
  {
    path: 'reset-password',
    component: ResetPaswordComponent,
  },
  { path: 'forgot-password', component: ForgotPaswordComponent },
  { path: 'home', component: HomeComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PublicRoutingModule {}
