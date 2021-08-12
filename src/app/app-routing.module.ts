import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './screens/dashboard/dashboard.component';
import { EducationResultsComponent } from './screens/education-results/education-results.component';
import { LoginBackdropComponent } from './screens/login-backdrop/login-backdrop.component';
import { MyToursComponent } from './screens/my-tours/my-tours.component';
import { OrderTourComponent } from './screens/order-tour/order-tour.component';
import { SearchComponent } from './screens/search/search.component';

const routes: Routes = [  { path: 'login', component: LoginBackdropComponent },
{ path: ':type', component: DashboardComponent },
{ path: ':type/search', component: SearchComponent },
{ path: 'education/results', component: EducationResultsComponent },
{ path: 'education/my-tours', component: MyToursComponent },
{ path: 'education/order-tour', component: OrderTourComponent },
{ path: '**', component: LoginBackdropComponent, pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
