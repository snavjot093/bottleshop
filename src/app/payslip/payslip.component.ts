import { Component, OnInit } from '@angular/core';
import {FormGroup, FormBuilder, Validators} from '@angular/forms';
import * as moment from 'moment';

@Component({
  selector: 'app-payslip',
  templateUrl: './payslip.component.html',
  styleUrls: ['./payslip.component.scss']
})
export class PayslipComponent implements OnInit {

  payslipForm: FormGroup;
  hours   : any;       weekNumber:any;
  rate    : any;
  employeeName    :any;    lastFour        :any;
  startDate       :any;    endDate         :any;
  thisPeriod      :any;    yearToDate      :any;
  socialS         :any;    socialSToYear   :any;
  medicare        :any;    medicareToYear  :any;
  fedTax          :any;    fedTaxToYear    :any;
  stateTax        :any;    stateTaxToYear  :any;
  sOthers         :any;    sOthersToYear   :any;
  netPay          :any;    netPayToYear    :any;
  totalDeduction  :any;    totalDeductionToYear:any;

  constructor(formbuilder: FormBuilder) {
      this.payslipForm = formbuilder.group({
          name    : ['', Validators.required],
          social  : ['', [Validators.required, Validators.minLength(4),Validators.maxLength(4)]],
          sDate   : ['', Validators.required]
      });
  } //===========END OF constructor METHOD================
  socialCheck(sval:any){
      /*if(isNaN(sval)=== true){
          $("#social").val($("#social").val().substring(0, $("#social").val().length-1));// not gonna let write anything other than number.
      }*/
  }
  payslipFunc(val:any){
          this.employeeName = val.name;
          this.startDate = new Date(val.sDate).getTime()- 86400000*14;
          this.endDate = new Date(val.sDate).getTime(); //Calculating the 15days from the start date
          this.lastFour = val.social;
          this.hours  = 80;
          /*this.rate   = 28.125;
          this.socialS   = 161.20;
          this.medicare = 37.70;
          this.fedTax = 271.76;
          this.stateTax = 46.88;
          this.sOthers = 23.40;
          //this.totalDeduction = 540.94;
          this.totalDeduction = this.fedTax + this.socialS + this.medicare + this.stateTax + this.sOthers;
          this.netPay = 1709.06;*/

          this.rate   = 18.125;
          this.fedTax = 99.00;
          this.socialS   = 88.82;
          this.medicare = 20.773;
          this.stateTax = 30.00;
          this.sOthers = 17.40;
          this.totalDeduction = this.fedTax + this.socialS + this.medicare + this.stateTax + this.sOthers;
          //this.totalDeduction = 270.49;
          this.netPay = this.hours * this.rate - this.totalDeduction;

          this.thisPeriod = this.hours * this.rate;
          this.yearToDate = this.thisPeriod * this.weekNumber;
          this.socialSToYear = this.socialS * this.weekNumber;
          this.medicareToYear = this.medicare * this.weekNumber;
          this.fedTaxToYear = this.fedTax * this.weekNumber;
          this.stateTaxToYear = this.stateTax * this.weekNumber;
          this.sOthersToYear = this.sOthers * this.weekNumber;
          this.totalDeductionToYear = this.totalDeduction * this.weekNumber;
          this.netPayToYear = this.netPay * this.weekNumber;
  }
  getWeekNumber(now:any ){
      var hun = moment();
      this.weekNumber= moment(now).week()/2;//since pay period is 2weeks each, hence divided by 2.
  }
  ngOnInit()  {}
  ngDoCheck() {}

}
