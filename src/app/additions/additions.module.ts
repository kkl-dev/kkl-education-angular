import { AdditionsRoutingModule } from './additions-routing.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RootComponent } from './components/root/root.component';



@NgModule({
  declarations: [
    RootComponent
  ],
  imports: [
    CommonModule,
    AdditionsRoutingModule
  ]
})
export class AdditionsModule { }
