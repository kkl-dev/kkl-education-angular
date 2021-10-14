import { RootComponent } from './screens/order-tour/root/root.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './screens/dashboard/dashboard.component';
import { EducationResultsComponent } from './screens/education-results/education-results.component';
import { LoginBackdropComponent } from './screens/login-backdrop/login-backdrop.component';
import { MyToursComponent } from './screens/my-tours/my-tours.component';

import { OrderTourComponent } from './screens/order-tour/order-tour.component';
import { SquadAssembleComponent } from './screens/order-tour/squad-assemble/components/squad-assemble.component';
import { SleepingOptionsComponent } from './screens/order-tour/sleeping-options/sleeping-options.component';
import { FacilitiesComponent } from './screens/order-tour/facilities/facilities.component';
import { AdditionsComponent } from './screens/order-tour/additions/components/additions/additions.component';
import { SummaryComponent } from './screens/order-tour/summary/summary.component';
import { SearchComponent } from './screens/search/search.component';

const routes: Routes = [
  { path: 'login', component: LoginBackdropComponent },
  {
    path: 'education',
    children: [
      {
        path: '',
        component: DashboardComponent,
      },
      { path: 'search', component: SearchComponent },

      {
        path: 'results',
        component: EducationResultsComponent,
      },
      {
        path: 'my-tours',
        component: MyToursComponent,
      },
    ],
  },
  {
    path: 'education/order-tour',
    component: RootComponent,
    children: [
      {
        path: 'squad-assemble',
        component: SquadAssembleComponent,
      },
      {
        path: 'sleeping',
        component: SleepingOptionsComponent,
      },
      {
        path: 'facilities',
        component: FacilitiesComponent,
      },
      {
        path: 'additions',
        component: AdditionsComponent,
      },
      {
        path: 'summary',
        component: SummaryComponent,
      },
    ],
  },
  { path: '**', component: LoginBackdropComponent, pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
