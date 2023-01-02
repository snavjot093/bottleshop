
import {Component, OnInit, Inject, Input, Output, EventEmitter, HostListener} from '@angular/core';
import {MatSortModule,Sort} from '@angular/material/sort';
import {MatSelectModule} from '@angular/material/select';
import {Router} from '@angular/router';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import { AngularFirestore, AngularFirestoreDocument, AngularFirestoreCollection } from '@angular/fire/firestore';
import {Observable} from 'rxjs';
import { HttpClient, HttpParams,HttpHeaders } from '@angular/common/http';
import {map, startWith} from 'rxjs/operators';
import { FirebaseService } from '../service/firebase.service';
import { property } from 'lodash';
const INVENTORY_DB = 'inventory';
const LIQUORNAMES_DB = 'LiquorNames';
const INVOICE_RECORD_DB = 'invoiceRecord';


@Component({
    selector: 'app-form',
    templateUrl: './form.component.html',
    styleUrls: ['./form.component.scss']
})
export class FormComponent implements OnInit {
    searchTerm:any;
    opened: boolean= true;
    inventoryCompleteList: boolean= true;
    reportByLiquorNameHide: boolean= true;
    paymentTrans: boolean= true;
    otherTrans: boolean= true;
    formHide:   boolean = true;
    filteredOptionsEdit: Observable<string[]>|undefined;
    filteredOptionsEditing: Observable<string[]>|undefined;
    filteredOptionsType:any;
    liqNameOptions:any;
    responseData:any;
    response:any;
    salesPersonData:any;
    liquorSizeData:any;
    totalEntries:number =0;
    sortTest:any;
    editKarna:boolean=true;
    deleteKarna:boolean=true;
    byName:boolean=false;
    byInvoiceNumber:boolean = true;
    byDates:boolean = true;
    header:any;
    sticky:any;
    myRadioPick:any;
    liqSizeForRadio:any;
    searchedResponse: any[] = [];
    math= Math;

    filteredOptionsSearch: Observable<string[]>|undefined;
    filteredOptionReport: Observable<string[]>|undefined;
    invoiceForm:FormGroup;
    reportSearchForm:  FormGroup;
    searchInventory : FormGroup;
    keyword:any = "";
    deleteInfo:any="";
    constructor(formbuilder: FormBuilder, private router: Router, private db: AngularFirestore, private fb: FirebaseService) {
   
        this.sortTest = {active:'invoiceDate', direction:'desc'};
        //=================JUST ADDED TO EDIT THE INVOICE ENTRIES====================
        this.invoiceForm = formbuilder.group({
            'invoiceDate': [null, Validators.compose([Validators.required, Validators.minLength(1), Validators.maxLength(50)])],
            'invoiceNum': [null, Validators.compose([Validators.required, Validators.minLength(1), Validators.maxLength(50)])],
            'liqName': [null, Validators.compose([Validators.required, Validators.minLength(1), Validators.maxLength(50)])],
            'liqType': [null, Validators.compose([Validators.required, Validators.minLength(1), Validators.maxLength(50)])],
            'liqSize': [null, Validators.compose([Validators.required, Validators.minLength(1), Validators.maxLength(50)])],
            'salesPerson': [null, Validators.compose([Validators.required, Validators.minLength(1), Validators.maxLength(50)])],
            'price': [null, Validators.compose([Validators.required, Validators.minLength(1), Validators.maxLength(50)])],
            'sellPrice': [null, Validators.compose([Validators.required, Validators.minLength(1), Validators.maxLength(50)])],
            'quantity': [null, Validators.compose([Validators.required, Validators.minLength(1), Validators.maxLength(200)])],
            'company': [null, Validators.compose([Validators.required, Validators.minLength(1), Validators.maxLength(50)])],
            'dueDate': [null, Validators.compose([Validators.required, Validators.minLength(1), Validators.maxLength(50)])],
            'amount': [null, Validators.compose([Validators.required, Validators.minLength(1), Validators.maxLength(50)])],
            'paymentDate': [null, Validators.compose([Validators.required, Validators.minLength(1), Validators.maxLength(50)])],
            'paidWith': [null, Validators.compose([Validators.required, Validators.minLength(1), Validators.maxLength(50)])],
            'key': [null, Validators.compose([Validators.required, Validators.minLength(1), Validators.maxLength(100)])]

        });
        this.reportSearchForm = formbuilder.group({
            'liqName': [null, Validators.compose([Validators.required, Validators.minLength(1), Validators.maxLength(200)])],
        });
        this.searchInventory = formbuilder.group({
            'liqName'   :   [''],
            'invoiceNum':   [''],
            'startDate' :   [''],
            'endDate'   :   ['']
        });
    }
    ngOnInit() {
        this.liquorNamesCall();
        this.header = document.getElementById('searchTerm') as HTMLElement;
        this.sticky = 360;
    }
    @HostListener('window:scroll', ['$event']) // for window scroll events
    onScroll(event:any) {
        //console.log(event);
        if (window.pageYOffset > this.sticky) {
            this.header.classList.add("sticky");
        } else {
            this.header.classList.remove("sticky");
        }
    }
    

    searchNow(searchInventory:any){
        let sDate = isNotNull(searchInventory.value.startDate) ? new Date(searchInventory.value.startDate).getTime() : '';
        let eDate = isNotNull(searchInventory.value.endDate) ? new Date(searchInventory.value.endDate).getTime() : '';
        this.fb.formSearchByDate(sDate, eDate).subscribe(actions => {
            this.response = actions.map(action => ({$key: action.payload.doc.id, ...action.payload.doc.data()}));
            
            this.totalEntries = this.responseData.length;
            this.sortData(this.sortTest);
        });
       /*this.fb.localInventory().subscribe((data:any) => { //FOR TESTING SO WE WONT MAKE API CALLS
            this.responseData = data; 
            this.sortData(this.sortTest); // REQUIRED FOR TABLE SORTING 
            this.totalEntries = this.responseData.length;
        });*/
    }
    filterInvoiceNum(originalArray:any ,prop:any){
        let newArray = [];
        let invoiceNumObj:any  = {};
        for(var i in originalArray) {
            invoiceNumObj[originalArray[i][prop]] = originalArray[i];
        }
        for(i in invoiceNumObj) {
            newArray.push(invoiceNumObj[i]);
        }
        this.response= newArray
        this.responseData = this.response.slice(); //keeping this.response updated because of the sortData function.
        this.totalEntries = this.responseData.length; // total entries just for display purpose
    };
    liquorNamesCall=()=>{
        this.fb.localLiqNames().subscribe((data:any)=>{
            this.liqNameOptions = data ;//resps.map(req =>(req));
            this.filteredOptionsEdit = this.reportSearchForm.controls['liqName'].valueChanges.pipe(startWith(''),map((value:any) => this._filter(value, data))); //Setting Observable
            this.filteredOptionsEditing = this.searchInventory.controls['liqName'].valueChanges.pipe(startWith(''),map((value:any) => this._filter(value, data))); //Setting Observable
        });
    }
    radioFilter=(value:string)=>{
        this.byName = true;
        this.byInvoiceNumber = true;
        this.byDates = true;
        if(value === 'byName'){
            this.byName = false;
        }else if(value === 'byInvoiceNumber'){
            this.byInvoiceNumber = false;
        }else if (value === 'byDates'){
            this.byDates = false;
        }
    }
    //===========Sorting the liquor dropdown list -==================
    private _filter(value: string, data:any) {
        if(value !== undefined){
            const filterValue = value.toLowerCase();
            return data.filter((option:any) => option.toLowerCase().includes(filterValue)).sort();
        }else{ return null;  }
    }
    //====================  OnClick function =======================
        radioChecked(val:any){
            this.responseData=[];
            if(val ==='all'){
                this.responseData = this.searchedResponse;
            }else{
                this.searchedResponse.forEach(obj => {
                    if(obj.liqSize === val){
                        this.responseData.push(obj);
                    }
                });
            }
        }
     //===================SEARCH LIQUOR USING THE LIQUOR NAME QUERY==================
     searchLiquorReport(form:any) {
         console.log(form)
        this.myRadioPick = null;    //unchecking the radio button for next search
        this.responseData = [];
        const curr = form.map((data:any) => data.liqSize);   // Setting up the radio buttons for UI
        this.liqSizeForRadio = curr.filter((x:any, i:any, a:any) => x && a.indexOf(x) === i);
        this.liqSizeForRadio.length>1?this.liqSizeForRadio.push('all'): this.liqSizeForRadio;
        console.log(this.liqSizeForRadio);
        this.totalEntries = this.searchedResponse.length;
        this.sortData(this.sortTest);
    }
    commonQueryFunction=(name:any, value:any)=>{
        this.searchedResponse=[];
        if(value !=='' && value !== null){
            this.fb.commonQuery(name, value).subscribe(actions => {
                console.log(this.response);
                if(name === 'liqName'){
                    this.searchedResponse = actions.map((action:any) => ({$key: action.payload.doc.id, ...action.payload.doc.data()}));
                    this.searchLiquorReport(this.searchedResponse);
                }else{
                    this.response = actions.map(action => ({$key: action.payload.doc.id, ...action.payload.doc.data()}));
                    // this.responseData = this.response.slices(); // REQUIRED FOR TABLE SORTING 
                    
                    this.totalEntries = this.responseData.length;
                    this.sortData(this.sortTest);
                }   
            });
        }
        
       /* this.fb.localInventory().subscribe((data:any) => {
            this.responseData = data; 
            this.sortData(this.sortTest); // REQUIRED FOR TABLE SORTING 
            this.totalEntries = this.responseData.length;
        });*/
    
    };
    salesPersonCall=()=>{
        this.fb.localSalesMan().subscribe((data:any)=>{
          this.salesPersonData = data });
    }
    liquorSizesCall=()=>{
        this.fb.localLiqSizes().subscribe((data:any)=>{ this.liquorSizeData = data  });
    }
    //================== EDIT LIQUOR ENTRY FROM INVENTORY=====
    editEntry=(item:any)=>{
        this.editKarna =false;
        this.keyword = item;
        //window.scrollTo(0, 0);
    }
    deleteEntry=(element:any ,item:any, content:any)=> {
        this.deleteKarna = false;
       // this.deleteInfo = 
        const xthis = this;
        this.fb.deleteLiquorItem(item, INVENTORY_DB).then(function () {
            console.log('Invoice successfully deleted!');
            console.log(xthis.responseData) ;
        }).catch(function (error:any) {
            console.log('Invoice removing document: ', error);
        });
    }

/*
  //===================== DELETE ITEM FROM THE INVENTORY=======
      
      cancelForm(){
          location.reload();
      };
      filterInvoiceNum(originalArray:any ,prop:any){
          let newArray = [];
          let invoiceNumObj:any  = {};
          for(var i in originalArray) {
              invoiceNumObj[originalArray[i][prop]] = originalArray[i];
          }
          for(i in invoiceNumObj) {
              newArray.push(invoiceNumObj[i]);
          }
          this.response= newArray
          this.responseData = this.response.slice(); //keeping this.response updated because of the sortData function.
          this.totalEntries = this.responseData.length; // total entries just for display purpose
      };
      onEditSubmit(form:any) {
          //console.log(form)
          const __this = this;
          this.formHide = true;
          if(form.invoiceDate !== undefined && form.invoiceDate !== null && form.invoiceDate !== ''){
              form.invoiceDate = form.invoiceDate.getTime();
          }
          if(form.dueDate !== undefined && form.dueDate !== null && form.dueDate !== ''){
              form.dueDate=form.dueDate.getTime();
          }
          if(form.paymentDate !== undefined && form.paymentDate !== null && form.paymentDate !== ''){
              form.paymentDate = form.paymentDate.getTime();
          }
          //console.log(form);
          if(this.paymentTrans === false){
              delete form.liqName;
              delete form.liqSize;
              delete form.liqType;
              delete form.price;
              delete form.quantity;
              delete form.salesPerson;
              delete form.sellPrice;
              console.log(form);
              this.fb.editLiquorItem(form.key , form, INVOICE_RECORD_DB).then(function(docRef:any){
                  console.log('Edited invoice entry has been modified written with ID: ', docRef);
                  __this.router.navigateByUrl('/form');
              }).catch(function (error:any) {
                  console.log('Error adding document: ', error);
              });
          }
          else if(this.otherTrans === false){
              delete form.amount;
                  delete form.company;
                  delete form.dueDate;
                  delete form.paidWith;
                  delete form.paymentDate;

              console.log(form);
              this.fb.editLiquorItem(form.key , form, INVENTORY_DB).then(function(docRef:any){
              //    __this.loadInvetList();
                  console.log('Edited invoice entry has been modified written with ID: ', docRef);
                  //__this.router.navigateByUrl('/list'); // not needed any more in this page.
              }).catch(function (error:any) {
                  console.log('Error adding document: ', error);
              });
          }
      };
      showPaymentHistory(){
          let date = new Date().getTime() - 1000*60*60*24*120 ;
          this.fb.queryInvoiceHistory(date).subscribe((actions:any) => {               //ES6 syntex
              const __this = this;
              if(this.response !==undefined){ }
              else{
                  this.response= actions.map((action:any) => ({$key: action.payload.doc.id, ...action.payload.doc.data()}));
                  this.responseData = this.response.slice();  //====Next 3 Lines to sort data by Liquor name
                  //__this.sortData(this.test);
                  this.totalEntries = this.responseData.length;
                  console.log(this.responseData);
              }
          });
      }

  
*/

    

  //========================SORT FUNCTION for TABLE SORTING=======================
    sortData(sort: Sort): void  {
        let data;
        data = this.response === undefined? this.responseData.slice():this.response.slice();
        if (!sort.active || sort.direction === '') {
            this.responseData = data;
            return;
        }  
        this.responseData = data.sort((a:any, b:any) => {
            const isAsc = sort.direction === 'asc';
            switch (sort.active) {
                case 'invoiceDate': return compare(a.invoiceDate, b.invoiceDate, isAsc);
                case 'invoiceNum': return compare(a.invoiceNum, b.invoiceNum, isAsc);
                case 'liqName': return compare(a.liqName, b.liqName, isAsc);
                case 'liqSize': return compare(a.liqSize, b.liqSize, isAsc);
                case 'liqType': return compare(a.liqType, b.liqType, isAsc);
                case 'price': return compare(a.price, b.price, isAsc);
                case 'sellPrice': return compare(a.sellPrice, b.sellPrice, isAsc);
                case 'salesPerson': return compare(a.price, b.price, isAsc);
                case 'quantity': return compare(a.price, b.price, isAsc);
                case 'company': return compare(a.company, b.company, isAsc);
                case 'dueDate': return compare(a.dueDate, b.dueDate, isAsc);
                case 'amount': return compare(a.amount, b.amount, isAsc);
                case 'paymentDate': return compare(a.paymentDate, b.paymentDate, isAsc);
                case 'paidWith': return compare(a.paidWith, b.paidWith, isAsc);
                default: return 0;
            }
        });
    }
}//==========End of export class ListComponent============

  function compare(a:any, b:any, isAsc:boolean) {
      return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }
  
function isNotNull(varName:any) {
    return varName === undefined || varName === "undefined" || varName === null || varName === "null" || varName === '' ? false : true;
}