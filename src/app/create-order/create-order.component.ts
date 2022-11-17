
import { Component, OnInit } from '@angular/core';
import {MatSortModule, Sort} from '@angular/material/sort';
import {MatCheckboxModule} from '@angular/material/checkbox';
//import { ClipboardService } from 'ngx-clipboard';
import {FormGroup, FormBuilder, Validators} from '@angular/forms';
import { AngularFirestore, AngularFirestoreDocument, AngularFirestoreCollection } from '@angular/fire/firestore';
import { HttpClient, HttpParams } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import { FirebaseService } from '../service/firebase.service';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import {MatTooltipModule} from '@angular/material/tooltip';
const LIQUORNAMES_DB = 'LiquorNames';
const INVENTORY_DB = 'inventory';
@Component({
    selector: 'app-create-order',
    templateUrl: './create-order.component.html',
    styleUrls: ['./create-order.component.scss']
})
export class CreateOrderComponent implements OnInit {
    liqOptions: any;//string[]= null;
    masterPrice : any[]=[];
    totalResponse: any[]=[];
    responsePrice: any[]=[];
    responseDate: any[]=[];
    //sellPrice:any[];
    sPrice:any;
    respName: any[]=[];
    respSize: any[]=[];
    selected: any[]=[];
    totalEntries= null;
    responseName: string= '';
    responseSize: string= '';
    Math: any;
    max: number = 0;
    min: number = 0;
    showTable: boolean = false;
    searchTerm: any;
    isOpened: any;
    disabled:boolean=false;
    constructor(formbuilder: FormBuilder, private fb: FirebaseService){//, private _cp: ClipboardService) {
        this.Math = Math;
    }//============END OFF constructor ===========
    checkboxed(item:any, name:string, val:string){

        let sResult = {name: name, size: val, item:item };
        let count=0;
        let i:any =0;
        let index:any = 0;
        if(this.selected.length > 0){
            for(i in this.selected){
                if(this.selected[i].item == item){
                    count++;
                    this.selected.splice(i,1);
                    break;
                }
            }
            for (index in this.masterPrice) {
                if(this.masterPrice[index].name == name && this.masterPrice[index].size == val){
                    this.masterPrice.splice(index,1);
                    console.log(this.masterPrice);
                    break;

                }
            }
            if(count === 0){
                this.selected.push(sResult)
                this.searchLiquor(name, val);
            }
        }
        else{
            this.selected.push(sResult);
            this.searchLiquor(name, val); //regex needed = .match(/[0-9 a-zA-Z]+|[0-9 a-zA-Z]+/g)
        }
    }

    //==========SEARCH LIQUOR USING MULTIPLE VALUES TO SORTEN THEN LIST========
    searchLiquor(name:string, val:string) {
        if(name !== null && val !== null){
            this.fb.queryLiquorOrder(name, val).subscribe(actions => {               //ES6 syntex
                this.totalResponse = actions.map(action => (action.payload.doc.data()));
                this.responseDate = actions.map(action => (action.payload.doc.data().invoiceDate)).sort();
                this.responsePrice = actions.map(action => (action.payload.doc.data().price)).sort();
                this.respSize = actions.map(action => (action.payload.doc.data().liqSize)).sort();
                this.responseSize = this.respSize[0];
                this.respName = actions.map(action => (action.payload.doc.data().liqName)).sort();
                this.responseName = this.respName[0];
                if(this.responsePrice.length > 0){
                    this.max = this.responsePrice.reduce((a, b)=>Math.max(a, b));
                    this.min = this.responsePrice.reduce((a, b) => Math.min(a, b));
                    for (var val of this.totalResponse) {
                        if(val.invoiceDate == this.responseDate[this.responseDate.length-1]){
                            this.sPrice = val.sellPrice;
                        }
                    }
                    let result = {
                        name: this.responseName,
                        size: this.responseSize,
                        max: this.max,
                        min: this.min,
                        sPrice: this.sPrice
                    }
                    this.masterPrice.push(result);
                    console.log(this.masterPrice);
                }
            });
        }
    }

    onSubmit(name:string){
        if(this.selected.length>0){
            //this._cp.copyFromContent(this.selected);
        }
    };
    ngOnInit() {
        this.fb.localLiqNames().subscribe((resps)=>{
            this.liqOptions = resps;//.map(req =>(req));
            this.totalEntries = this.liqOptions.length;
        //    this.filteredOptions = this.myForm.controls['liqName'].valueChanges.pipe(startWith(''),map(value => this.nameFilter(value)));
        });
    };
    loadList(){
        /*this.fb.getLiquorSnapShot(LIQUORNAMES_DB).subscribe(actions => {
            this.liqOptions = actions.map(action => (action.payload.doc.data().name)).sort();
            this.totalEntries = this.liqOptions.length; // total entries just for display purpose
        });*/
    }  //============END OFF ngOnInit ===========
    private _filter(value: string): string[] {
        const filterValue = value.toLowerCase();
        const names = this.liqOptions.filter((option:any) => option.toLowerCase().includes(filterValue)).sort();
        return names;
    }
} //============END OFF class CreateOrderComponent ===========

