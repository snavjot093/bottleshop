import {Injectable, OnInit} from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument, AngularFirestoreCollection } from '@angular/fire/firestore';
//import {AngularFirestore, AngularFirestoreCollection} from 'angularfire2/firestore';
import {Observable} from 'rxjs';
import { HttpClient, HttpParams, HttpHeaders  } from '@angular/common/http';
@Injectable()
export class FirebaseService  implements OnInit{
    private itemsCollection: AngularFirestoreCollection<any>|undefined;

    public onse:Observable<any[]>|undefined;
    public invResp: Observable<any[]>|undefined;
    public testResp: Observable<any[]>|undefined;
    configUrl = 'data/inventory.json';

    constructor(private db: AngularFirestore, private http :HttpClient) {
        this.itemsCollection = this.db.collection<any>('inventory');
        this.onse = this.itemsCollection.snapshotChanges();
        //console.log(this.onse);
    }
    ngOnInit() {}
    /*==============BELOW CALL TO  LOCAL JSON DATA==================*/
    localCompanies(){
        return this.http.get("/assets/data/liquorCompany.json");
    };
    localSalesMan(){
        return this.http.get("/assets/data/salesPerson.json");
    };
    localLiqSizes(){
        return this.http.get("/assets/data/liquorSizes.json");
    };
    localLiqNames(){
        return this.http.get("/assets/data/liquorNames.json");
    };
    localLiqTypes(){
        return this.http.get("/assets/data/liquorType.json");
    };
    localInventory(){
        return this.http.get("/assets/data/inventory.json");
    };
    //=========================FOR GET CALLS==================
  /*  getLiquorSnapShot(DBName:any) {
        this.itemsCollection = this.db.collection<any>(DBName);
        return this.itemsCollection.snapshotChanges();
    }*/

    getCallFor(DBName:any) {
        this.itemsCollection = this.db.collection<any>(DBName);
        return this.itemsCollection.snapshotChanges();

    }

/*===========ADD EDIT DELETE ENTRIES NEXT 3 FUNCTION =====================*/

    deleteLiquorItem(item:any, DBName:any) {
        return this.db.collection(DBName).doc(item).delete();
      }

      addLiquorItem(form:any, DBName:any) {
        return this.db.collection(DBName).add(form);
      }

      editLiquorItem(key:any, form:any, DBName:any) {
            return this.db.collection(DBName).doc(key).update(form);
      }
/*=============QUERY FOR CREATE ORDER ====================*/
    queryLiquorOrder(liqName:any, liqSize:any) {
        if ((liqName === null || liqName === '') && (liqSize === null || liqSize === '')) {
            this.itemsCollection = this.db.collection<any>('inventory');
        } else {
            this.itemsCollection = this.db.collection<any>('inventory', item => {
                let query:any;
                if (liqName != null && liqName !== '') {
                    if (query) {
                        query = query.where('liqName', '==', liqName);
                    } else {
                        query = item.where('liqName', '==', liqName);
                    }
                }
                if (liqSize != null && liqSize !== '') {
                    if (query) {
                        query = query.where('liqSize', '==', liqSize);
                    } else {
                        query = item.where('liqSize', '==', liqSize);
                    }
                }
                if (query) { return query; }
            });
        }
        return this.itemsCollection.snapshotChanges();
    }
/*=======================Query to get less entries from the inventory=============*/
/*=============QUERY FOR CREATE ORDER ====================*/




    queryInvoiceHistory(date:any){
        this.itemsCollection = this.db.collection<any>('invoiceRecord', item => {
            console.log(item);

            let query:any;
            if (query) {
                query = query.where('invoiceDate', '>=', date);
            } else {
                query = item.where('invoiceDate', '>=', date);
            }
            return query ? query: item;
        })
        return this.itemsCollection.snapshotChanges();
    }
    beerCall(name:any, invDate:any){
        this.itemsCollection = this.db.collection<any>('craftBeer');
        //return this.itemsCollection.snapshotChanges();
        this.itemsCollection = this.db.collection<any>('craftBeer', item => {
            console.log(item);
            if(invDate === null){
                let query:any;
                if (query) {
                    query = query.where('vendor', '==', name);
                } else {
                    query = item.where('vendor', '==', name);
                }
                return query ? query: item;
            }
            else{
                let query:any;
                if (query) {
                    query = query.where('vendor', '==', name).where('date', '>=', invDate);
                } else {
                    query = item.where('vendor', '==', name).where('date', '>=', invDate);
                }
                return query ? query: item;
            }

        })
        return this.itemsCollection.snapshotChanges();
    }











//=======QUERY TO SEARCH LIQUOR USING MULTIPLE VALUES TO SORTEN THEN LIST=======

      queryLiquor(date:any, invoiceNum:any, liqName:any, liqSize:any) {
        if ((liqName === null || liqName === '') && (invoiceNum === null || invoiceNum === '') && (date === null || date === '')&& (liqSize === null || liqSize === '')) {
          this.itemsCollection = this.db.collection<any>('inventory');
        } else {
          this.itemsCollection = this.db.collection<any>('inventory', item => {
            let query:any;
            if (liqName != null && liqName !== '') {
              if (query) {
                query = query.where('liqName', '==', liqName);
              } else {
                query = item.where('liqName', '==', liqName);
              }
            }
            if (liqSize != null && liqSize !== '') {
              if (query) {
                query = query.where('liqSize', '==', liqSize);
              } else {
                query = item.where('liqSize', '==', liqSize);
              }
            }

            if (invoiceNum != null && invoiceNum !== '') {
              if (query) {
                query = query.where('invoiceNum', '==', invoiceNum);
              } else {
                query = item.where('invoiceNum', '==', invoiceNum);
              }
            }

            if (date != null && date !== '') {
              if (query) {
                query = query.where('invoiceDate', '==', date);
              } else {
                query = item.where('invoiceDate', '==', date);
              }
            }
            if (query) {
                console.log(query);
              return query;
            }


          });
        }
        return this.itemsCollection.snapshotChanges();
    /*    this.testResp= this.itemsCollection.snapshotChanges();
        this.testResp.subscribe(actions => {
            this.onse = actions.map(action => ({$key: action.payload.doc.id, ...action.payload.doc.data()}));
                console.log(this.testResp);
                console.log(this.onse);
            });*/
    }
//============================LIQUOR REPORT PAGE ===============================
//==============================================================================
//==========SERACH LIQUOR USING DATE RANGE OR INVOICE NUMBER ============================
formSearchByDate(sDate:any, eDate:any) {
        this.itemsCollection = this.db.collection<any>('inventory', item => {
            let query:any;
            if (query) {
                query = query.where('invoiceDate', '>=', sDate).where('invoiceDate', '<=', eDate);
            } else {
                query = item.where('invoiceDate', '>=', sDate).where('invoiceDate', '<=', eDate);
            }
            return query ? query: item;
        })
        return this.itemsCollection.snapshotChanges();
        //return this.http.get("/assets/data/inventory.json");
    }

    commonQuery(name:any, value:any){
         //return this.http.get("/assets/data/inventory.json");
        this.itemsCollection = this.db.collection<any>('inventory', item=>{
            let query:any;
            if(query){
                query = query.where(name, '==', value);
            }else{
                query = item.where(name, '==', value);
            }
            return query ? query: item;
        });
        return this.itemsCollection.snapshotChanges();
    }
    //======================= END LIQUOR REPORT PAGE ===============================
//==============================================================================
//==============================================================================
//==============================================================================

}
function isNotNull(varName:any) {
    return varName === undefined || varName === "undefined" || varName === null || varName === "null" || varName === '' ? false : true;
}
