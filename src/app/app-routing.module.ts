import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
//import { AuthGuardService as AuthGuard } from './service/auth-guard.service';

import {ListComponent}      from './list/list.component';
import {FormComponent}      from './form/form.component';
import {PayrollComponent}   from './payroll/payroll.component';
import {PayslipComponent }  from './payslip/payslip.component';
import {LandingComponent}   from './landing/landing.component';
import {LoginComponent}     from './login/login.component';
import {CreateOrderComponent}     from './create-order/create-order.component';
//import {ReportComponent}   from './report/report.component';
import { AddEditComponent } from './add-edit/add-edit.component';
import { BeerComponent } from './beer/beer.component';


const routes: Routes = [
  {path: '', component: LandingComponent},
  {path: 'list', component: ListComponent},
  {path: 'form', component: FormComponent},// canActivate: [AuthGuard]},
  {path: 'payroll', component: PayrollComponent},//, canActivate: [AuthGuard]},
  {path: 'payslip', component: PayslipComponent},
  {path: 'login', component: LoginComponent},
  {path: 'createOrder', component: CreateOrderComponent},
  //{path: 'report', component: ReportComponent},
  {path: 'addEdit',component: AddEditComponent},
  {path: 'beer',component: BeerComponent},
  {path: '**', component: LandingComponent},

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
