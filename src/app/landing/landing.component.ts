
import {Component,OnInit} from '@angular/core';
import { HostListener} from "@angular/core";
import { FirebaseService } from '../service/firebase.service';
import {Observable} from 'rxjs';

//import * as content from '../content';
// For MDB Angular Pro;



@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss']
})
export class LandingComponent {
    focusSet: boolean = false;
    scroll:   boolean = false;
    label : object | undefined;
    liqOptions:     string[] | undefined;
    filteredOptions: Observable<string[]> | undefined;
  //label: Object;

  constructor() {
 
  }
  @HostListener('window:scroll', ['$event']) onScrollEvent(){

  }

  ngOnInit() {
  }
 //============apply dynamicMargin
dynamicMargin(){
    let styles = {
        'left': '0px',
        'top':  this.scroll ? '0px': '89px'

    }
        return styles;
}
  rumCollection() {

  }

  /*=================START OF LEARNING ANGULAR=============================*/
  /*=================START OF LEARNING ANGULAR=============================*/
  /*=================START OF LEARNING ANGULAR=============================*/
  //declaring the variables inside LandingComponent to use inside the template.
  bevmoImage: string = 'http://cdnbevmo.nrostores.com/skin/frontend/ncr/bevmo/images/logo.png';
  bmwLogo: string = './assets/raindrops.gif';
  firstName: string = 'Navjot';
  lastName: string = 'Singh';
  getFullName(): string {
    return this.firstName + ' ' + this.lastName;
  }

  /*=================END OF LEARNING ANGULAR=============================*/
  /*=================END OF LEARNING ANGULAR=============================*/
  /*=================END OF LEARNING ANGULAR=============================*/
  name: string = 'Navjot';
  setMyStyles() {
    let styles = {
      'width': '200px',
      'height': '200px',
      'background-color': 'green' ? 'red' : 'transparent',
      //'font-weight': this.isImportant ? 'bold' : 'normal',
      'display': 'inline-flex'
    };
    return styles;
  }
  activeSlideChange(event: any) {
    console.log(event);
  }

}

//}
window.onload = function() {
  //    console.log('hi');

}