import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import {AuthGuardService }  from './service/auth-guard.service';
import {FirebaseService}   from './service/firebase.service';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AddEditComponent } from './add-edit/add-edit.component';
import { BeerComponent } from './beer/beer.component';
import { CreateOrderComponent } from './create-order/create-order.component';
import { FormComponent } from './form/form.component';
import { LandingComponent } from './landing/landing.component';
import { ListComponent } from './list/list.component';
import { LoginComponent } from './login/login.component';
import { NavbarComponent } from './navbar/navbar.component';
import { PayrollComponent } from './payroll/payroll.component';
import { PayslipComponent } from './payslip/payslip.component';
import { FilterPipe, UniquePipe, LimitTo, DateAgoPipe, GroupByPipe, OrderByPipe, Ifempty,RoundPipe  }     from './list/list.pipe';
import {MatTableModule} from '@angular/material/table';
import {MatDatepickerModule} from '@angular/material/datepicker';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatRadioModule} from '@angular/material/radio';



// Firebase services + enviorment module
import { AngularFireModule } from "@angular/fire";
import { AngularFireAuthModule } from "@angular/fire/auth";
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { environment } from '../environments/environment';
import {FirebaseConfig }       from './firebase.config';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ModalComponent } from './modal/modal.component';


@NgModule({
  declarations: [
    AppComponent,
    AddEditComponent,
    BeerComponent,
    CreateOrderComponent,
    FormComponent,
    LandingComponent,
    ListComponent,
    LoginComponent,
    NavbarComponent,
    PayrollComponent,
    PayslipComponent,
    FilterPipe,
    UniquePipe,
    LimitTo,
    DateAgoPipe,
    GroupByPipe,
    OrderByPipe,
    Ifempty,
    RoundPipe,
    ModalComponent
  ],
  imports: [
    NgbModule,
    BrowserModule,
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(FirebaseConfig.firebase),
    AngularFireAuthModule,
    AngularFirestoreModule,
    BrowserAnimationsModule,
    MatAutocompleteModule
  ],
  exports: [FormComponent, AddEditComponent, NavbarComponent],
  providers: [FirebaseService,AuthGuardService],
  bootstrap: [AppComponent]
})
export class AppModule { }
//exports: [FormComponent, AddEditComponent, ListSeparaterComponent, NavbarComponent,],
