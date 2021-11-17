import { Injectable, NgZone } from '@angular/core';
import {CanActivate, Router} from '@angular/router';
import { AngularFireAuth } from "@angular/fire/auth";
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
//import { auth } from 'firebase/app';



@Injectable()
export class AuthGuardService implements CanActivate {
  isAuthenticated: boolean;
  constructor(public router: Router) {
    this.isAuthenticated = true;
  }
  canActivate(): boolean {
    if (!this.isAuthenticated) {
        this.router.navigateByUrl('/login');
      return false;
    }
    return true;
  }
  ngOnInit(): void { }

  /*constructor(private afAuth: AngularFireAuth, public router: Router) {
    this.isAuthenticated = false;
    this.afAuth.auth.onAuthStateChanged((user:any) => {
      if (user) {
        this.isAuthenticated = true;
      }
    });
  }

  */

}
