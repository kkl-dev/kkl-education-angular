import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatBadgeModule } from '@angular/material/badge';
import {MatListModule} from '@angular/material/list';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatSelectModule} from '@angular/material/select';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatSortModule} from '@angular/material/sort';
import {MatTableModule} from '@angular/material/table';
import {MatRadioModule} from '@angular/material/radio';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
//import and export material modules

const MaterialComponents = [MatButtonModule];

@NgModule({
  imports: [
    MatButtonModule,
    MatToolbarModule,
    MatGridListModule,
    MatBadgeModule,
    MatListModule,
    MatSidenavModule,
    MatSelectModule,
    MatFormFieldModule,
    MatInputModule,
    MatSortModule,
    MatTableModule,
    MatRadioModule,
    MatTooltipModule,
    MatCheckboxModule,
    MatIconModule,
    MatProgressSpinnerModule
    
  ],
  exports: [
    MatButtonModule,
    MatToolbarModule,
    MatGridListModule,
    MatBadgeModule,
    MatListModule,
    MatSidenavModule,
    MatSelectModule,
    MatFormFieldModule,
    MatInputModule,
    MatSortModule,
    MatTableModule,
    MatRadioModule,
    MatTooltipModule,
    MatCheckboxModule,
    MatIconModule,
    MatProgressSpinnerModule
  ],
})
export class MaterialModule {}
