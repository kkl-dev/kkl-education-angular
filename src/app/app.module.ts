import { RootComponent } from './screens/order-tour/root/root.component';
import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveComponentModule } from '@ngrx/component';

import { NavbarComponent } from './components/navbar/navbar.component';
import { UserInfoComponent } from './components/user-info/user-info.component';
import { ToursTableComponent } from './screens/my-tours/tours-table/tours-table.component';
import { MyToursComponent } from './screens/my-tours/my-tours.component';
import { EducationComponent } from './screens/search/education/education.component';
import { OrderTourComponent } from './screens/order-tour/order-tour.component';
import { FormContainerComponent } from './components/form/form-container/form-container.component';
import { LinksComponent } from './components/links/links.component';

// FULL CALENDER PLUGIN
import { FullCalendarModule } from '@fullcalendar/angular';
import dayGridPlugin from '@fullcalendar/daygrid';
import InteractionPlugin from '@fullcalendar/interaction';

import { DatePipe } from '@angular/common';
import { WizardComponent } from './components/wizard/wizard.component';
import { LayoutModule } from '@angular/cdk/layout';
import { AngularSvgIconModule } from 'angular-svg-icon';

import { MaterialModule } from './material/material.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';

import { AirbnbCalendarModule } from 'comrax-alex-airbnb-calendar';
import { GlobalErrorHandler } from './utilities/interceptors/error';

import { ApiModule } from 'src/app/open-api/';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import { MainComponent } from './components/main/main.component';
import { DashboardComponent } from './screens/dashboard/dashboard.component';

import { LoginComponent } from './screens/login-backdrop/login/login.component';
import { LoginBackdropComponent } from './screens/login-backdrop/login-backdrop.component';
import { LoginFormComponent } from './screens/login-backdrop/login-form/login-form.component';
import { OtpFormComponent } from './screens/login-backdrop/otp-form/otp-form.component';
import { LoginProcessComponent } from './screens/login-backdrop/login-process/login-process.component';

import { EducationResultsComponent } from './screens/education-results/education-results.component';
import { SearchComponent } from './screens/search/search.component';
import { DatePickerComponent } from './screens/search/education/date-picker/date-picker.component';
import { HeaderComponent } from './screens/education-results/header/header.component';
import { TooltipComponent } from './screens/education-results/tooltip/tooltip.component';
import { PaginationComponent } from './components/pagination/pagination.component';
import { NavigationComponent } from './components/navigation/navigation.component';
import { SpinnerComponent } from './components/spinner/spinner.component';
import { BottomNavigationComponent } from './components/bottom-navigation/bottom-navigation.component';
import { WorkingStepsComponent } from './components/working-steps/working-steps.component';
import { MapsComponent } from './screens/education-results/maps/maps.component';
import { InfoCardComponent } from './components/info-card/info-card.component';
import { NumberInputComponent } from './components/form/number-input/number-input.component';
import { IconComponent } from './components/icon/icon.component';
// import { AdditionsComponent } from './screens/order-tour/additions/additions.component';
import { DrawerComponent } from './components/drawer/drawer.component';
import { FormQuestionComponent } from './components/form/form-question/form-question.component';
import { FormInputComponent } from './components/form/form-input/form-input.component';
import { InputRadioComponent } from './components/form/input-radio/input-radio.component';
import { FormGroupComponent } from './components/form/form-group/form-group.component';

import { ExpendPanelComponent } from './components/expend-panel/expend-panel.component';

import { TypographyComponent } from './components/typography/typography.component';
import { DashboardCardComponent } from './components/dashboard-card/dashboard-card.component';

import { FlexRowComponent } from './components/grid/flex-row/flex-row.component';
import { FlexTableComponent } from './components/grid/flex-table/flex-table.component';

import { FormComponent } from './components/form/form/form.component';
import { FormHeaderComponent } from './components/form/form-header/form-header.component';

import { SvgIconComponent } from './components/svg-icon/svg-icon.component';
import { SimpleCardComponent } from './components/simple-card/simple-card.component';
import { NavigationGridComponent } from './screens/order-tour/additions/components/navigation-grid/navigation-grid.component';

import { FlexCellComponent } from './components/grid/flex-cell/flex-cell.component';

import { SquadAssembleComponent } from './screens/order-tour/squad-assemble/components/squad-assemble.component';
import { SquadGroupComponent } from './screens/order-tour/squad-assemble/components/squad-group/squad-group.component';

import { FormAutocompleteComponent } from './components/form/form-autocomplete/form-autocomplete.component';

import { SquadClientComponent } from './screens/order-tour/squad-assemble/components/squad-client/squad-client.component';
import { SquadScheduleComponent } from './screens/order-tour/squad-assemble/components/squad-schedule/squad-schedule.component';
import { SleepingOptionsComponent } from './screens/order-tour/sleeping-options/sleeping-options.component';
import { SleepingOptionsFormComponent } from './screens/order-tour/sleeping-options/sleeping-options-form/sleeping-options-form.component';
import { SleepingOptionsByDayComponent } from './components/sleeping-options-by-day/sleeping-options-by-day.component';

import { FacilitiesComponent } from './screens/order-tour/facilities/facilities.component';

import { TimelineCardComponent } from './screens/order-tour/facilities/timeline-card/timeline-card.component';

import { FilledNightComponent } from './screens/order-tour/sleeping-options/filled-night/filled-night.component';
import { FilledNightFormComponent } from './screens/order-tour/sleeping-options/filled-night-form/filled-night-form.component';

import { AdditionsComponent } from './screens/order-tour/additions/components/additions/additions.component';
import { TourTitleComponent } from './screens/order-tour/tour-title/tour-title.component';
import { TransportFormComponent } from './screens/order-tour/additions/components/transport-form/transport-form.component';
import { TourPanelComponent } from './screens/order-tour/additions/components/tour-panel/tour-panel.component';
import { TransportModel } from './screens/order-tour/additions/models/transport.model';


import { SummaryComponent } from './screens/order-tour/summary/summary.component';

import { NumberToTimePipe } from './utilities/pipes/numberToTime.pipe';
import { ActivitiesCardComponent } from './components/activities-card/activities-card.component';

import { IconCardComponent } from './components/icon-card/icon-card.component';
import { CalendarComponent } from './screens/order-tour/facilities/calendar/calendar.component';
import { ActiveStateDirective } from './utilities/directivs/active-state.directive';
import { SizeDirective } from './utilities/directivs/size.directive';
import { ConfirmDialogComponent } from './utilities/confirm-dialog/confirm-dialog.component';
import { SquadDetailsComponent } from './screens/order-tour/squad-assemble/components/squad-details/squad-details.component';
import { SquadBudgetComponent } from './screens/order-tour/squad-assemble/components/squad-budget/squad-budget.component';
import { SquadNewClientComponent } from './screens/order-tour/squad-assemble/components/squad-new-client/squad-new-client.component';
import { SquadGroupGenderComponent } from './screens/order-tour/squad-assemble/components/squad-group-gender/squad-group-gender.component';
import { AddFacilityComponent } from './screens/order-tour/facilities/add-facility/add-facility.component';
import { SaveActivityComponent } from './screens/order-tour/facilities/save-activity/save-activity.component';
import { AddActivityComponent } from './screens/order-tour/facilities/add-activity/add-activity.component';
import { ModalComponent } from './components/modal/modal.component';
import { OutsideDirective } from './utilities/directivs/outside.directive';
import { SleepingMapComponent } from './screens/order-tour/sleeping-map/sleeping-map.component';
import { DynamicComponent } from './components/dynamic/dynamic.component';
import { CalendarCardComponent } from './screens/order-tour/facilities/calendar/calendar-card/calendar-card.component';
import { FormDetailsComponent } from './screens/order-tour/additions/components/form-details/form-details.component';
import { EconomyFormComponent } from './screens/order-tour/additions/components/economy-form/economy-form.component';
import { GudianceFormComponent } from './screens/order-tour/additions/components/gudiance-form/gudiance-form.component';
import { HostingFormComponent } from './screens/order-tour/additions/components/hosting-form/hosting-form.component';
import { SiteOrderFormComponent } from './screens/order-tour/additions/components/site-order-form/site-order-form.component';
import { SecuringOrderFormComponent } from './screens/order-tour/additions/components/securing-order-form/securing-order-form.component';
import { MusicActivationFormComponent } from './screens/order-tour/additions/components/music-activation-form/music-activation-form.component';
import { TransportDetailsTableComponent } from './screens/order-tour/additions/transport-details-table/transport-details-table.component';

FullCalendarModule.registerPlugins([
  dayGridPlugin,
  InteractionPlugin
]);

@NgModule({
  declarations: [
    CalendarCardComponent,
    AppComponent,
    MainComponent,
    DashboardComponent,

    // PIPES
    NumberToTimePipe,

    // LOGIN COMPS
    LoginComponent,
    LoginBackdropComponent,
    LoginFormComponent,
    OtpFormComponent,
    LoginProcessComponent,

    //TOUR COMPS
    ToursTableComponent,
    MyToursComponent,
    OrderTourComponent,

    // EDUCATION COMPS
    EducationComponent,
    EducationResultsComponent,

    // FORM COMPS
    FormContainerComponent,
    FormQuestionComponent,
    FormQuestionComponent,
    FormInputComponent,
    FormInputComponent,
    FormComponent,
    FormHeaderComponent,
    InputRadioComponent,
    NumberInputComponent,
    FormGroupComponent,

    // KKL DESIGN
    ModalComponent,
    NavbarComponent,
    WizardComponent,
    LinksComponent,
    UserInfoComponent,
    SearchComponent,
    DatePickerComponent,
    HeaderComponent,
    TooltipComponent,
    PaginationComponent,
    NavigationComponent,
    SpinnerComponent,
    BottomNavigationComponent,
    WorkingStepsComponent,
    DrawerComponent,
    InfoCardComponent,
    IconComponent,
    ExpendPanelComponent,
    TypographyComponent,
    DashboardCardComponent,
    SvgIconComponent,
    SimpleCardComponent,
    ActivitiesCardComponent,
    // ORDER TOUR ROOT COMP
    RootComponent,

    // SQUAD ASSEMBLE COMPONENTS
    SquadAssembleComponent,
    SquadGroupComponent,

    // SLEEPINGS COMPS
    SleepingOptionsComponent,
    SleepingOptionsFormComponent,
    SleepingOptionsByDayComponent,
    FilledNightComponent,

    // FACILITIES COMPS
    FacilitiesComponent,
    TimelineCardComponent,
    AddFacilityComponent,
    SaveActivityComponent,
    AddActivityComponent,

    // ADDITIONS COMPONENTS
    AdditionsComponent,
    TourTitleComponent,
    TransportFormComponent,
    NavigationGridComponent,
    TourPanelComponent,

    // SUMMERY COMPS
    SummaryComponent,

    // FLEX GRID COMPS
    FlexRowComponent,
    FlexTableComponent,
    FlexCellComponent,

    MapsComponent,
    IconCardComponent,
    CalendarComponent,
    ActiveStateDirective,
    SizeDirective,
    FilledNightFormComponent,
    ConfirmDialogComponent,
    FormAutocompleteComponent,
    SquadClientComponent,
    SquadScheduleComponent,
    SquadDetailsComponent,
    SquadBudgetComponent,
    SquadNewClientComponent,
    SquadGroupGenderComponent,
    OutsideDirective,
    SleepingMapComponent,
    CalendarCardComponent,
    FormDetailsComponent,
    EconomyFormComponent,
    GudianceFormComponent,
    HostingFormComponent,
    SiteOrderFormComponent,
    SecuringOrderFormComponent,
    MusicActivationFormComponent,
    TransportDetailsTableComponent,
    DynamicComponent

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveComponentModule,
    BrowserAnimationsModule,
    MaterialModule,
    FontAwesomeModule,
    AngularSvgIconModule.forRoot(),
    HttpClientModule,
    LayoutModule,
    FormsModule,
    ReactiveFormsModule,
    AirbnbCalendarModule,
    ApiModule,
    FullCalendarModule,
    NgxMaterialTimepickerModule.setLocale('he-IL'),
  ],
  providers: [
    { provide: ErrorHandler, useClass: GlobalErrorHandler },
    { provide: TransportModel, useValue: new TransportModel() },
    DatePipe,
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
