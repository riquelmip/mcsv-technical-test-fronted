import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { UserPageComponent } from './pages/user-page/user-page.component';
import { CustomerPageComponent } from './pages/customer-page/customer-page.component';

const routes: Routes = [
  {
    path: 'home',
    component: DashboardComponent,
  },
  {
    path: 'users',
    component: UserPageComponent,
  },
  {
    path: 'customers',
    component: CustomerPageComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminRoutingModule {}
