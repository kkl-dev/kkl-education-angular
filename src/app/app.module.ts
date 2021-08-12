import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './material/material.module';
import { NavbarComponent } from './components/navbar/navbar.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { HttpClientModule } from '@angular/common/http';
import { WizardComponent } from './components/wizard/wizard.component';
import { LayoutModule } from '@angular/cdk/layout';
import { MatPaginatorModule } from '@angular/material/paginator';
import { UserInfoComponent } from './components/user-info/user-info.component';
import { LinksComponent } from './components/links/links.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoginComponent } from './screens/login-backdrop/login/login.component';
import { LoginBackdropComponent } from './screens/login-backdrop/login-backdrop.component';
import { LoginFormComponent } from './screens/login-backdrop/login-form/login-form.component';
import { MainComponent } from './components/main/main.component';
import { DashboardComponent } from './screens/dashboard/dashboard.component';
import { OtpFormComponent } from './screens/login-backdrop/otp-form/otp-form.component';
import { LoginProcessComponent } from './screens/login-backdrop/login-process/login-process.component';
import { AirbnbCalendarModule } from 'comrax-alex-airbnb-calendar';
import { SearchComponent } from './screens/search/search.component';

import { DatePickerComponent } from './screens/search/education/date-picker/date-picker.component';
import { EducationResultsComponent } from './screens/education-results/education-results.component';
import { HeaderComponent } from './screens/education-results/header/header.component';
import { TooltipComponent } from './screens/education-results/tooltip/tooltip.component';
import { MyToursComponent } from './screens/my-tours/my-tours.component';
import { ToursTableComponent } from './screens/my-tours/tours-table/tours-table.component';
import { PaginationComponent } from './components/pagination/pagination.component';
import { SquadAssambleComponent } from './screens/order-tour/squad-assamble/squad-assamble.component';
import { FormContainerComponent } from './components/form-container/form-container.component';
import { OrderTourComponent } from './screens/order-tour/order-tour.component';
import { DynamicFormQuestionComponent } from './components/form-container/dynamic-form-question/dynamic-form-question.component';
import { NavigationComponent } from './components/navigation/navigation.component';
import { SpinnerComponent } from './components/spinner/spinner.component';
import { BottomNavigationComponent } from './components/bottom-navigation/bottom-navigation.component';
import { WorkingStepsComponent } from './components/working-steps/working-steps.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { EducationComponent } from './screens/search/education/education.component';
import { NumberInputComponent } from './components/number-input/number-input.component';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    WizardComponent,
    UserInfoComponent,
    LinksComponent,
    LoginComponent,
    LoginBackdropComponent,
    LoginFormComponent,
    MainComponent,
    DashboardComponent,
    OtpFormComponent,
    LoginProcessComponent,
    SearchComponent,
    EducationComponent,
    DatePickerComponent,
    EducationResultsComponent,
    HeaderComponent,
    TooltipComponent,
    MyToursComponent,
    ToursTableComponent,
    PaginationComponent,
    SquadAssambleComponent,
    FormContainerComponent,
    OrderTourComponent,
    DynamicFormQuestionComponent,
    NavigationComponent,
    SpinnerComponent,
    BottomNavigationComponent,
    WorkingStepsComponent,
    
    NumberInputComponent
  ], 
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule,
    FontAwesomeModule,
    AngularSvgIconModule.forRoot(),
    HttpClientModule,
    LayoutModule,
    FormsModule,
    ReactiveFormsModule,
    AirbnbCalendarModule,
    MatPaginatorModule,
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
