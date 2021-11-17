
import {Component, OnInit, Inject} from '@angular/core';
//import {Sort} from '@angular/material';
import {MatSortModule,Sort} from '@angular/material/sort';
import {MatSelectModule} from '@angular/material/select';
import {Router} from '@angular/router';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import { AngularFirestore, AngularFirestoreDocument, AngularFirestoreCollection } from '@angular/fire/firestore';
//import {AngularFirestore, AngularFirestoreCollection} from 'angularfire2/firestore';
import {Observable} from 'rxjs';
import { HttpClient, HttpParams,HttpHeaders } from '@angular/common/http';
import {map, startWith} from 'rxjs/operators';
import { FirebaseService } from '../service/firebase.service';
//import { ListSeparaterComponent }  from '../list-separater/list-separater.component';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
//import { SetTimeout } from 'timers';
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
    filteredOptionsType:any;
    liqNameOptions:any;
    responseData:any;
    response:any;
    salesPersonData:any;
    liquorSizeData:any;
    totalEntries:number =0;
    liquorName: string= '';


    myRadioPick:any;
    liqSizeForRadio:any;
    searchedResponse: any[] = [];
    ml12    :any[]  =[];
    ml16    :any[]  =[];
    ml50    :any[]  =[];
    ml100   :any[]  =[];
    ml187   :any[]  =[];
    ml1874pk:any[]  =[];
    ml200   :any[]  =[];
    ml375   :any[]  =[];
    ml500   :any[]  =[];
    ml750   :any[]  =[];
    lt1     :any[]  =[];
    lt15    :any[]  =[];
    lt175   :any[]  =[];
    lt3     :any[]  =[];
    Math: any;

    filteredOptionsSearch: Observable<string[]>|undefined;
    filteredOptionReport: Observable<string[]>|undefined;
    invoiceForm:FormGroup;
    reportSearchForm:  FormGroup;
    constructor(formbuilder: FormBuilder, private router: Router, private db: AngularFirestore, private fb: FirebaseService,private modalService: NgbModal) {

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
    }
    ngOnInit() {
        this.liquorNamesCall();
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
    showAndHideTabs(tab:any){
        this.opened = false;
        this.inventoryCompleteList = true;
        this.reportByLiquorNameHide = true;
        this.otherTrans = true;
        this.paymentTrans = true;
        this.responseData= [];
        this.totalEntries =0;
        console.log(tab)
        if(tab === 'reportByLiquorName'){
            this.reportByLiquorNameHide = false;
            this.inventoryCompleteList= false;
            this.otherTrans = false;
            this.liquorNamesCall();

        }else if(tab === 'paymentHistory'){
            this.inventoryCompleteList= false;
            this.paymentTrans = false;
           // this.showPaymentHistory()//('invoiceRecord');

        }else if(tab === 'loadWholeInventroy'){
            this.inventoryCompleteList = false;
            this.otherTrans = false;
            this.paymentTrans = true;
            //this.loadInvetList();

        }

    };
    liquorNamesCall=()=>{
        this.fb.localLiqNames().subscribe((data:any)=>{
           // console.log(data);
              this.liqNameOptions = data ;//resps.map(req =>(req));
             // console.log(this.liqNameOptions);
              this.filteredOptionsEdit = this.invoiceForm.controls['liqName'].valueChanges
              .pipe(startWith(''), map((value:any) => this._filter(value))); //Setting Observable
              //console.log(this.filteredOptionsEdit);
              this.filteredOptionReport = this.reportSearchForm.controls['liqName'].valueChanges
              .pipe(startWith(''), map((value:any) => this._filter(value))); //Setting Observable
             // console.log(this.filteredOptionReport);
        });
    }
    //===========Sorting the liquor dropdown list -==================
    private _filter(value: string) {
        if(value !== undefined){
            const filterValue = value.toLowerCase();
            //console.log(this.liqNameOptions)
            return this.liqNameOptions.filter((option:any) => option.toLowerCase().includes(filterValue)).sort();
          }else{
            return null;
          }
    }

    //====================  OnClick function =======================
        radioChecked(val:any){
            console.log(val)
            if(val ==='12 oz'){
                this.responseData = this.ml12;
            }
            if(val ==='16 oz'){
                this.responseData = this.ml16;
            }
            if(val==="50 ml"){
                this.responseData = this.ml50;
            }
            if(val==="100 ml"){
                this.responseData = this.ml100;
            }
            if(val==="187 ml"){
                this.responseData = this.ml187;
            }
            if(val==="187 ml (4pk)"){
                this.responseData = this.ml1874pk;
            }
            if(val==="200 ml"){
                this.responseData = this.ml200;
            }
            if(val==="375 ml"){
                this.responseData = this.ml375;
            }
            if(val==="500 ml"){
                this.responseData = this.ml500;
            }
            if(val==="750 ml"){
                this.responseData = this.ml750;
            }
            if(val==="1 Liter"){
                this.responseData = this.lt1;
            }
            if(val==="1.5 Liter"){
                this.responseData = this.lt15;
            }
            if(val==="1.75 Liter"){
                this.responseData = this.lt175;
            }
            if(val==="3 Liter"){
                this.responseData = this.lt3;
            }
            if(val ==='all'){
                this.responseData = this.searchedResponse;
            }

        }
     //===================SEARCH LIQUOR USING THE LIQUOR NAME QUERY==================
     searchLiquorReport(form:any) {
        this.myRadioPick = null;    //unchecking the radio button for next search
        this.responseData = [];
        this.ml50.length =0; this.ml100.length =0; this.ml187.length =0;
        this.ml200.length=0; this.ml375.length =0; this.ml750.length =0;
        this.lt1.length =0;  this.lt15.length =0;this.lt175.length =0;this.lt3.length =0;
        this.liquorName = form.liqName;
        if(form.liqName !== null && form.liqName !==""){
            this.fb.queryLiquorReport(form.liqName).subscribe((actions:any) => {
                this.searchedResponse = actions.map((action:any) => ({$key: action.payload.doc.id, ...action.payload.doc.data()}));
                console.log(this.searchedResponse);
                const curr = this.searchedResponse.map(data => data.liqSize);   // Setting up the radio buttons for UI
                this.liqSizeForRadio = curr.filter((x, i, a) => x && a.indexOf(x) === i);
                this.liqSizeForRadio.length>1?this.liqSizeForRadio.push('all'): this.liqSizeForRadio;
                console.log(this.liqSizeForRadio);
                this.totalEntries = this.searchedResponse.length;
                this.searchedResponse.forEach(obj => {
                    if(obj.liqSize === '12 oz'){
                        this.ml12.push(obj);
                    }
                    if(obj.liqSize === '16 oz'){
                        this.ml16.push(obj);
                    }
                    if(obj.liqSize === '50 ml'){
                        this.ml50.push(obj);
                    }
                    if(obj.liqSize === '100 ml'){
                        this.ml100.push(obj);
                    }
                    if(obj.liqSize === '187 ml'){
                        this.ml187.push(obj);
                    }
                    if(obj.liqSize === '187 ml (4pk)'){
                        this.ml1874pk.push(obj);
                    }
                    if(obj.liqSize === '200 ml'){
                        this.ml200.push(obj);
                    }
                    if(obj.liqSize === '375 ml'){
                        this.ml375.push(obj);
                    }
                    if(obj.liqSize === '500 ml'){
                        this.ml500.push(obj);
                    }
                    if(obj.liqSize === '750 ml'){
                        this.ml750.push(obj);
                    }
                    if(obj.liqSize === '1 Liter'){
                        this.lt1.push(obj);
                    }
                    if(obj.liqSize === '1.5 Liter'){
                        this.lt15.push(obj);
                    }
                    if(obj.liqSize === '1.75 Liter'){
                        this.lt175.push(obj);
                    }
                    if(obj.liqSize === '3 Liter'){
                        this.lt3.push(obj);
                    }
                });
            });
        }
        else{
            this.searchedResponse = [];
        }
    }
    salesPersonCall=()=>{
        this.fb.localSalesMan().subscribe((data:any)=>{
          this.salesPersonData = data });
    }
    liquorSizesCall=()=>{
        this.fb.localLiqSizes().subscribe((data:any)=>{ this.liquorSizeData = data  });
    }
    //================== EDIT LIQUOR ENTRY FROM INVENTORY=====
        editEntry=(item:any)=>{
            //this.salesPersonCall();
            ///this.liquorSizesCall();
            console.log(item);
            window.scrollTo(0, 0);
            this.formHide = false;
            this.invoiceForm.controls['invoiceDate'].setValue(new Date(item.invoiceDate));
            this.invoiceForm.controls['invoiceNum'].setValue(item.invoiceNum);
            this.invoiceForm.controls['liqName'].setValue(item.liqName);
            this.invoiceForm.controls['liqType'].setValue(item.liqType);
            this.invoiceForm.controls['liqSize'].setValue(item.liqSize);
            this.invoiceForm.controls['salesPerson'].setValue(item.salesPerson);
            this.invoiceForm.controls['price'].setValue(item.price);
            this.invoiceForm.controls['sellPrice'].setValue(item.sellPrice);
            this.invoiceForm.controls['quantity'].setValue(item.quantity);
            this.invoiceForm.controls['company'].setValue(item.company);
            this.invoiceForm.controls['dueDate'].setValue(new Date(item.dueDate));
            this.invoiceForm.controls['amount'].setValue(item.amount);
            this.invoiceForm.controls['paymentDate'].setValue(new Date(item.paymentDate));
            this.invoiceForm.controls['paidWith'].setValue(item.paidWith);
            this.invoiceForm.controls['key'].setValue(item.$key);
        }
//=== DURING CLEAN UP IT LOOKS LIKE IT IS NOT BEING USED AT ALL
    /*private xfilter(value:any) {
        if(value !== undefined){
             const xfilterValue = value.toLowerCase();
             const types = this.liqTypeOptions.filter((option:any) => option.toLowerCase().includes(xfilterValue)).sort();
             return types;
           }else{
             return null;
           }
    }*/












/*      displayedColumns = ['Invoicedate', 'invoiceNum', 'liqName', 'liqSize', 'salesPerson', 'price','sellPrice','quantity', 'company','dueDate','amount','paymentDate','paidWith','edit','delete'];
      liquorSizeData: any ;//any[];
      liquorSizeDataSearch: any;//[];
      salesPersonData: any;//[];

      response:any[]=[];
      responseData:any[]=[];
      //beerList:any[]:[];
      searchedResponse: any[] = [];


      searchForm:     FormGroup;
      reportSearchForm:  FormGroup;
      invoiceForm:    FormGroup;
      formHide:       boolean = true;
      inventoryCompleteList:boolean = true;
       //closeResult: string;
       //e: string[];
      test:any;

      totalEntries:number= 0;
      searchTerm:any

      //searchedResponseLength: number ;

      mySort: string[]|undefined;
      liqTypeOptions: string[]|undefined;
      liquorName: string= '';
      events: string[] = [];
      opened: boolean= true;
      reportByLiquorNameHide: boolean= true;
      paymentTrans: boolean= true;
      otherTrans: boolean= true;
      filteredOptionsEdit: Observable<string[]>|undefined;
      filteredOptionsType:any;
      liqNameOptions:any;
      filteredOptionsSearch: Observable<string[]>|undefined;
      filteredOptionReport: Observable<string[]>|undefined;
      radioSelectionValue : string ='Roxana - SWS';
      constructor(formbuilder: FormBuilder, private router: Router, private db: AngularFirestore, private fb: FirebaseService,private modalService: NgbModal) {
          this.Math = Math;
          this.test ={ active: "liqName",direction: "asc"}; // Manually setting the liqName to the sortData.
          this.fb.localLiqTypes().subscribe((data:any)=>{
            console.log(data);
              //    this.liqTypeOptions =  data.sort();
              //    console.log(this.liqTypeOptions);
                  this.filteredOptionsType = data;
              });

          this.fb.localLiqNames().subscribe((data:any)=>{
            console.log(data);
              this.liqNameOptions = data ;//resps.map(req =>(req));
              //console.log(this.liqNameOptions);
              this.filteredOptionsEdit = this.invoiceForm.controls['liqName'].valueChanges
              .pipe(startWith(''), map(value => this._filter(value))); //Setting Observable
              //console.log(this.filteredOptionsEdit);
              this.filteredOptionReport = this.reportSearchForm.controls['liqName'].valueChanges
              .pipe(startWith(''), map(value => this._filter(value))); //Setting Observable
              //console.log(this.filteredOptionReport);
          });
          this.searchForm = formbuilder.group({
              'invoiceDate': [null, Validators.compose([Validators.required, Validators.minLength(1),Validators.maxLength(25)])],
              'invoiceNum': [null, Validators.compose([Validators.required, Validators.minLength(1),Validators.maxLength(25)])],
              'liqName': [null, Validators.compose([Validators.required, Validators.minLength(1),Validators.maxLength(25)])],
              'liqSize': [null, Validators.compose([Validators.required, Validators.minLength(1),Validators.maxLength(25)])]
          });
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
          //==========================API CALLS FOR THIS PAGE============================

  }; //===================END OF  CONSTRUCTOR METHOD====================

  //==========================END OF  CONSTRUCTOR METHOD====================

  //==============================================================================
  ngOnInit(){}


      onRadioButtonSelectionChange(value:any){
          this.radioSelectionValue = value;
          console.log(value);
      }

  //====================    ONCLICK FUNCTION         ======================
  //====================    ONCLICK FUNCTION         ======================
  //====================    ONCLICK FUNCTION         ======================

      liquorSizesCall(){
          if(this.liquorSizeData !== undefined){}
          else if(this.liquorSizeData === undefined){
              this.fb.localLiqSizes().subscribe((data:any)=>{
                  this.liquorSizeData = data;
                  this.liquorSizeDataSearch = data;
                  console.log(this.liquorSizeData);
              });
      //       this.fb.getCallFor('sizes').subscribe(actions => {
      //==========this.liquorSizeData= actions.map(action => ({$key: action.payload.doc.id, ...action.payload.doc.data()}));
      //            this.liquorSizeData= actions.map(action => (action.payload.doc.data().name)).sort();
      //            this.liquorSizeDataSearch = actions.map(action => (action.payload.doc.data().name)).sort();
      ///            console.log(this.liquorSizeData);
      //        });
          }
      };
      salesPersonCall(){
          if(this.salesPersonData !== undefined){}
          else if(this.salesPersonData === undefined){
              this.fb.localSalesMan().subscribe((data:any)=>{ this.salesPersonData = data });
          //    this.fb.getCallFor('salesPerson').subscribe(actions =>{
          //        this.salesPersonData = actions.map(action =>(action.payload.doc.data().name)).sort();
          //        console.log(this.salesPersonData);
          //    });
          }
      }
      liquorTypesCall(){
             this.fb.getCallFor('liquorType').subscribe(actions=>{
                  this.liqTypeOptions = actions.map(action =>(action.payload.doc.data().type));
                  console.log(this.liqTypeOptions);
                  this.filteredOptionsType = this.invoiceForm.controls['liqType'].valueChanges.pipe(startWith(''),
                      map(value => this.xfilter(value)));
                      //console.log(this.filteredOptionsType);
                      //console.log(JSON.stringify(this.liqTypeOptions));
              });
          }
      }
      showAndHideTabs(tab:any){
          this.opened = false;
          this.inventoryCompleteList = true;
          this.reportByLiquorNameHide = true;
          this.otherTrans = true;
          this.paymentTrans = true;
          this.responseData= [];
          this.totalEntries =0;
          console.log(tab)
          if(tab === 'reportByLiquorName'){
              this.reportByLiquorNameHide = false;
              this.inventoryCompleteList= false;
              this.otherTrans = false;
              //this.liquorNamesCall();

          }else if(tab === 'paymentHistory'){
              this.inventoryCompleteList= false;
              this.paymentTrans = false;
              this.showPaymentHistory()//('invoiceRecord');

          }else if(tab === 'loadWholeInventroy'){
              this.inventoryCompleteList = false;
              this.otherTrans = false;
              this.paymentTrans = true;
              this.loadInvetList();

          }

      };
  //==================== LOAD THE COMPLETE LIST OF INVENTORY=======================
      loadInvetList() {
          this.fb.invResp.subscribe((actions:any) => {
              this.response= actions.map((action:any) => ({$key: action.payload.doc.id, ...action.payload.doc.data()}));
              this.responseData = this.response.slice();                            //====Next 3 Lines to sort data by Liquor name
              //this.sortData(this.test);
              this.totalEntries = this.responseData.length;
              console.log(this.responseData);
          });
      }

  //===================== DELETE ITEM FROM THE INVENTORY=======
      deleteInvoice(element:any ,item:any, content:any) {
          const xthis = this;
          this.fb.deleteLiquorItem(item, INVENTORY_DB).then(function () {
              console.log('Invoice successfully deleted!');
              console.log(xthis.responseData) ;
          }).catch(function (error:any) {
              console.log('Invoice removing document: ', error);
          });
      }
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

  //========================SORT FUNCTION for TABLE SORTING=======================
     sortData(sort: Sort) {
          let data;
          data = this.response === undefined? this.responseData.slice():this.response.slice();
          if (!sort.active || sort.direction === '') {
              this.responseData = data;
              return;
          }

          this.responseData = data.sort((a, b) => {
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
      }*/



/*

    search_terms:any = ['apple', 'apple watch', 'apple macbook', 'apple macbook pro', 'iphone', 'iphone 12'];

    autocompleteMatch=(input:string)=> {
    if (input == '') {
        return [];
    }
    var reg = new RegExp(input)
        return this.search_terms.filter((term:string)=>{
            return term.match(reg)? term:'';
        });
    }

showResults=(val:any)=> {
    let res = document.getElementById("result");
    if(res) (res as HTMLFormElement).reset();
  res.innerHTML = '';
  let list = '';
  let terms = this.autocompleteMatch(val);
  for (let i=0; i<terms.length; i++) {
    list += '<li>' + terms[i] + '</li>';
  }
  res.innerHTML = '<ul>' + list + '</ul>';
}
*/




/*


currentFocus:number=0;






autocomplete = (inp:any, arr:any)=>{
    inp.addEventListener("input", (e:Event)=> {
        var a, b, i, val = this.value;
        closeAllLists();
        if (!val) { return false;}
        this.currentFocus = -1;
        a = document.createElement("DIV");
        a.setAttribute("id", this.id + "autocomplete-list");
        a.setAttribute("class", "autocomplete-items");
        this.parentNode.appendChild(a);
        for (i = 0; i < arr.length; i++) {

          if (arr[i].substr(0, val.length).toUpperCase() == val.toUpperCase()) {
            b = document.createElement("DIV");
            b.innerHTML = "<strong>" + arr[i].substr(0, val.length) + "</strong>";
            b.innerHTML += arr[i].substr(val.length);
            b.innerHTML += "<input type='hidden' value='" + arr[i] + "'>";
            b.addEventListener("click", function(e) {
                inp.value = this.getElementsByTagName("input")[0].value;
                closeAllLists();
            });
            a.appendChild(b);
          }
        }
    });
    inp.addEventListener("keydown", function(e:Event) {
        const x = document.getElementById(this.id + "autocomplete-list");
        if (x) x = x.getElementsByTagName("div");
        if (e.keyCode == 40) {
            this.currentFocus++;
            addActive(x);
        } else if (e.keyCode == 38) {
          this.currentFocus--;
          addActive(x);
        } else if (e.keyCode == 13) {
          e.preventDefault();
          if (this.currentFocus > -1) {
            if (x:any) x[this.currentFocus].click();
          }
        }
    });
    const addActive= (x:any)=>{
     if (!x) return false;
     removeActive(x);
      if (this.currentFocus >= x.length) this.currentFocus = 0;
      if (this.currentFocus < 0) this.currentFocus = (x.length - 1);
      x[this.currentFocus].classList.add("autocomplete-active");
    }
    const removeActive= (x:any)=> {
      for (var i = 0; i < x.length; i++) {
        x[i].classList.remove("autocomplete-active");
      }
    }
    const closeAllLists=(elmnt:any)=> {
      var x = document.getElementsByClassName("autocomplete-items");
      for (var i = 0; i < x.length; i++) {
        if (elmnt != x[i] && elmnt != inp) {
          x[i].parentNode.removeChild(x[i]);
        }
      }
    }
    document.addEventListener("click", function (e) {
        closeAllLists(e.target);
    });
  }*/

  }//==========End of export class ListComponent============

  function compare(a:any, b:any, isAsc:any) {
      return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }
