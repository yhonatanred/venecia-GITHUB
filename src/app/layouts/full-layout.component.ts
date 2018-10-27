import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './full-layout.component.html',
  styleUrls: ['./full-layout.component.css']
})
export class FullLayoutComponent implements OnInit {
  

  public rol: any={};
  public disabled = false;
  public status: {isopen: boolean} = {isopen: false};

  constructor(private router: Router){
        }
  
  public admin(){
    this.rol = JSON.parse(sessionStorage.getItem('currentUser'));
  }

  public toggled(open: boolean): void {
    console.log('Dropdown is now: ', open);
  }

  public toggleDropdown($event: MouseEvent): void {
    $event.preventDefault();
    $event.stopPropagation();
    this.status.isopen = !this.status.isopen;
  }

  ngOnInit(): void {
    this.admin();
  }

  toggleFullScreen() {
    var doc = window.document;
    var docEl = doc.documentElement;
  
    var requestFullScreen = docEl.requestFullscreen || docEl.webkitRequestFullScreen;
    var cancelFullScreen = doc.exitFullscreen  || doc.webkitExitFullscreen;
  
    if(!doc.fullscreenElement && !doc.webkitFullscreenElement) {
      requestFullScreen.call(docEl);
    }
    else {
      cancelFullScreen.call(doc);
    }
  }
}





