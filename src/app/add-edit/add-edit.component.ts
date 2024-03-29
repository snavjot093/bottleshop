import { Component, OnInit,Input } from '@angular/core';
//import { FormGroup, FormControl, FormBuilder } from '@angular/forms';

import { FormGroup, FormBuilder, Validators } from '@angular/forms';
//import { Validators } from '@angular/forms';
import { FormArray } from '@angular/forms';
import { AngularFirestore, AngularFirestoreDocument, AngularFirestoreCollection } from '@angular/fire/firestore';
import { FirebaseService } from '../service/firebase.service';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
//import {MatDatepickerModule} from '@angular/material/datepicker';
import {Observable} from 'rxjs';
import {map, filter, switchMap, startWith} from 'rxjs/operators';

const INVENTORY_DB = 'inventory';
const LIQNAMES_DB = 'LiquorNames';
const LIQTYPE_DB = 'liquorType';
const INVRECORD_DB ='invoiceRecord';
@Component({
    selector: 'app-add-edit',
    templateUrl: './add-edit.component.html',
    styleUrls: ['./add-edit.component.scss']
})
export class AddEditComponent implements OnInit {
    inventroyForm:boolean = false;
    invoiceRecordForm:boolean = false;
    jsonCode:any;
    salesPersonData :   Observable<string[]>|undefined;
    liquorSizeData  :   Observable<string[]>|undefined;
    companyData:        Observable<string[]>|undefined;
    filteredOptionsType:Observable<string[]>|undefined;
    filteredLiquorName: Observable<string[]>|undefined;
    constructor(private formbuilder: FormBuilder, private db: AngularFirestore, private fb: FirebaseService) {
        //==========================api calls ==========================
        this.fb.localSalesMan().subscribe((data:any)=>{
             this.salesPersonData = this.myForm.controls['salesPerson'].valueChanges.pipe(startWith(''), map((value:any) => this._filter(value, data)));
        });
        this.fb.localLiqSizes().subscribe((data:any)=>{
            this.liquorSizeData = this.myForm.controls['liqSize'].valueChanges.pipe(startWith(''), map((value:any) => this._filter(value, data)));
        });
        this.fb.localCompanies().subscribe((data:any)=>{
            this.companyData = this.myForm.controls['company'].valueChanges.pipe(startWith(''), map((value:any) => this._filter(value, data)));
        });
        this.fb.localLiqTypes().subscribe((data:any)=>{
            this.filteredOptionsType = this.myForm.controls['liqType'].valueChanges.pipe(startWith(''), map((value:any) => this._filter(value, data)));
        });
    }
    @Input() keyword!:any;
    @Input() editKarna!:boolean;
    myForm = this.formbuilder.group({
        'invoiceDate':  ['', Validators.compose([Validators.required, Validators.minLength(1), Validators.maxLength(100)])],
        'invoiceNum':   ['', Validators.compose([Validators.required, Validators.minLength(1), Validators.maxLength(50)])],
        'liqName':      ['', Validators.compose([Validators.required, Validators.minLength(1), Validators.maxLength(100)])],
        'liqType':      ['', Validators.compose([Validators.required, Validators.minLength(1), Validators.maxLength(50)])],
        'liqSize':      ['', Validators.compose([Validators.required, Validators.minLength(1), Validators.maxLength(50)])],
        'salesPerson':  ['', Validators.compose([Validators.required, Validators.minLength(1), Validators.maxLength(100)])],
        'price':        ['', Validators.compose([Validators.required, Validators.minLength(1), Validators.maxLength(50)])],
        'sellPrice':    ['', Validators.compose([Validators.required, Validators.minLength(1), Validators.maxLength(50)])],
        'quantity':     ['', Validators.compose([Validators.required, Validators.minLength(1), Validators.maxLength(250)])],
        'amount':       ['', Validators.compose([Validators.minLength(1), Validators.maxLength(50)])],
        'company':      ['', Validators.compose([Validators.minLength(1), Validators.maxLength(50)])],
        'dueDate':      ['', Validators.compose([Validators.minLength(1), Validators.maxLength(50)])],
        'paidWith':     ['', Validators.compose([Validators.minLength(1), Validators.maxLength(100)])],
        'paymentDate':  ['', Validators.compose([Validators.minLength(1), Validators.maxLength(50)])],
        'key':          ['', Validators.compose([Validators.minLength(1), Validators.maxLength(100)])],
    });
    ngOnChanges(){
        console.log(this.keyword);
        this.inventroyForm = false;
        this.invoiceRecordForm = true;
        this.myForm.patchValue({
            invoiceDate:    new Date(this.keyword.invoiceDate),//new Date(this.keyword.invoiceDate- 43200000),
            invoiceNum:     this.keyword.invoiceNum,
            liqName:        this.keyword.liqName,
            liqType:    this.keyword.liqType,
            liqSize:    this.keyword.liqSize,
            salesPerson:    this.keyword.salesPerson,
            price:    this.keyword.price,
            sellPrice:    this.keyword.sellPrice,
            quantity:    this.keyword.quantity,
            company:    this.keyword.company,
            dueDate:    this.keyword.dueDate,
            amount:    this.keyword.amount,
            paymentDate:    this.keyword.paymentDate,
            paidWith:    this.keyword.paidWith,
            key:    this.keyword.$key
        });
        console.log(this.myForm.value);
        window.scrollTo(0, 0);
    }
    ngOnInit(): void {
        this.liquorNamesCall();
    }
    liquorNamesCall=()=>{
        this.fb.localLiqNames().subscribe((data:any)=>{
            this.filteredLiquorName = this.myForm.controls['liqName'].valueChanges.pipe(startWith(''), map((value:any) => this._filter(value, data))); //Setting Observable
        });
    }
    //===========Sorting the liquor dropdown list -==================
    private _filter(value: string, data:any) {
        if(value !== undefined){
            const filterValue = value.toLowerCase();
            return data.filter((option:any) => option.toLowerCase().includes(filterValue)).sort();
        }else{ return null;  }
    }



    formSelection(value:any){
        //console.log(value)
        if(value ==='inventroy'){
            this.inventroyForm = false;
            this.invoiceRecordForm = true;
        }
        else if(value ==='invoiceRecord'){
            this.inventroyForm = true;
            this.invoiceRecordForm = false;
        }
        else if(value ==='everyThing'){
            this.inventroyForm = false;
            this.invoiceRecordForm = false;
            //this.everyThingForm = false;
        }
    }
    cancelForm(form:any){
    //    $('.toast').toast('show');
        //this.myForm.dueDate = null;
    }
    onSubmit=(form:any)=>{
        const __this = this;
        form.value.invoiceDate = isNotNull(form.value.invoiceDate)?new Date(form.value.invoiceDate).getTime()+43200000:'';
        form.value.paymentDate === isNotNull(form.value.paymentDate)?new Date(form.value.paymentDate).getTime()+43200000:'';
        form.value.paidWith ===    null   ? form.value.paidWith     ='' : form.value.paidWith =   form.value.paidWith;
        form.value.dueDate ===    isNotNull(form.value.dueDate)?new Date(form.value.dueDate).getTime()+43200000:'';
        if(form.value.key === '' || form.value.key === null ||form.value.key === undefined){
            let inventory={
                invoiceDate : form.value.invoiceDate,
                invoiceNum : form.value.invoiceNum,
                liqName : form.value.liqName,
                liqSize : form.value.liqSize,
                liqType : form.value.liqType,
                price : form.value.price,
                quantity : form.value.quantity,
                salesPerson : form.value.salesPerson,
                sellPrice : form.value.sellPrice
            }
            let invoiceRecord = {
                amount : form.value.amount,
                company : form.value.company,
                dueDate : form.value.dueDate,
                invoiceDate : form.value.invoiceDate,
                invoiceNum : form.value.invoiceNum,
                paidWith : form.value.paidWith,
                paymentDate : form.value.paymentDate
            }
            if(this.inventroyForm === false && this.invoiceRecordForm === true && this.myForm.valid){
                this.fb.addLiquorItem( inventory, INVENTORY_DB).then(function (docRef) {
                 console.log('Document written with ID: ', docRef);
                //    __this.router.navigateByUrl('/form');
                //__this.jsonCode = docRef;
                }).catch(function (error) {
                    console.error('Error adding document: ', error);
                });
            }
            if(this.inventroyForm === true && this.invoiceRecordForm === false && this.myForm.valid){
                this.fb.addLiquorItem( invoiceRecord, INVRECORD_DB).then(function (docRef) {
                        console.log('Document written with ID: ', docRef);
                       // __this.jsonCode = docRef;
                //        __this.router.navigateByUrl('/form');
                }).catch(function (error) {
                    console.error('Error adding document: ', error);
                });
            }
            if(this.inventroyForm === false && this.invoiceRecordForm === false){
                this.fb.addLiquorItem( inventory, INVENTORY_DB).then(function (docRef) {
                   // __this.jsonCode = docRef;
                }).catch(function (error) {
                    console.error('Error adding document: ', error);
                });
                this.fb.addLiquorItem( invoiceRecord, INVRECORD_DB).then(function (docRef) {
                }).catch(function (error) {
                    console.error('Error adding document: ', error);
                });
            }
        }else{
            let inventory={
                invoiceDate : form.value.invoiceDate,
                invoiceNum : form.value.invoiceNum,
                liqName : form.value.liqName,
                liqSize : form.value.liqSize,
                liqType : form.value.liqType,
                price : form.value.price,
                quantity : form.value.quantity,
                salesPerson : form.value.salesPerson,
                sellPrice : form.value.sellPrice,
                key:form.value.key
            }
            this.fb.editLiquorItem(form.value.key, inventory, INVENTORY_DB).then(function(docRef){
                console.log('Document written with ID: ', docRef);
                __this.jsonCode = docRef;
                __this.editKarna = true;
            })
        }
    }
}
function isNotNull(varName:any) {
    return varName === undefined || varName === "undefined" || varName === null || varName === "null" || varName === '' ? false : true;
}
