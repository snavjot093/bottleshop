import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }
  toggleFunction(){
    /*  let x = document.getElementById("navDemo");
      if (x.className.indexOf("nbar-show") == -1) {
          x.className += " nbar-show";
      } else {
          x.className = x.className.replace(" nbar-show", "");
      }*/
  }

}
