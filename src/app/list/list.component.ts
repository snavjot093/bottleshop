import { OnInit, Inject} from '@angular/core';
import { Component, Directive, EventEmitter, Input, Output, QueryList, ViewChildren } from '@angular/core';

import { FormBuilder } from '@angular/forms';
import { Validators } from '@angular/forms';
import { FormArray } from '@angular/forms';

import {Router} from '@angular/router';
import { AngularFirestore, AngularFirestoreDocument, AngularFirestoreCollection } from '@angular/fire/firestore';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import { FirebaseService } from '../service/firebase.service';
//import { SetTimeout } from 'timers';
const INVENTORY_DB = 'inventory';
const LIQUORNAMES_DB = 'LiquorNames';



@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {
    searchInventory = this.formbuilder.group({
        'invoiceNum':   [''],
        'startDate':  [''],
        'endDate':      ['']
    });
    searchTerm:any;
    liqNameOptions  : any;//[] | any;
    salesPersonData : any;//string[];
    liqTypeOptions  : any;//string[];
    liquorSizeData  : any;//string[];
    companyData:any;
    responseData:any;
    totalEntries:any;
    filteredOptionsType:any;
  constructor( private formbuilder: FormBuilder,private router: Router, private db: AngularFirestore, private fb: FirebaseService) {
      this.fb.localLiqNames().subscribe((resps:any)=>{
          this.liqNameOptions = resps.map((req:any) =>(req));
          //this.filteredOptions = resps;//this.myForm.controls['liqName'].valueChanges.pipe(startWith(''),map(value => this.nameFilter(value)));
      });
      this.fb.localLiqTypes().subscribe((resps:any)=>{
          this.liqTypeOptions = resps;//.map(req =>(req));
          this.filteredOptionsType = resps;//ngForm.liqType.valueChanges.pipe(startWith(''),map((value:any) => this.typeFilter(value)));
      });
      this.fb.localSalesMan().subscribe((data:any)=>{  this.salesPersonData = data });
      this.fb.localLiqSizes().subscribe((data:any)=>{  this.liquorSizeData = data  });
      this.fb.localCompanies().subscribe((data:any)=>{ this.companyData = data });
  }
  searchNow(searchInventory:any){
      let invoiceNum = isNotNull(searchInventory.value.invoiceNum) ? searchInventory.value.invoiceNum : '';
      let sDate = isNotNull(searchInventory.value.startDate) ? new Date(searchInventory.value.startDate).getTime() : '';
      let eDate = isNotNull(searchInventory.value.endDate) ? new Date(searchInventory.value.endDate).getTime() : '';

      this.fb.formSearchByDate(sDate, eDate).subscribe(actions => {
          this.responseData = actions.map(action => ({$key: action.payload.doc.id, ...action.payload.doc.data()}));
          this.totalEntries = this.responseData.length;
      });
  }
  ngOnInit() { }
}
function isNotNull(varName:any) {
    return varName === undefined || varName === "undefined" || varName === null || varName === "null" || varName === '' ? false : true;
}
