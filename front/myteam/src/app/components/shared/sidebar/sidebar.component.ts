import { Component, OnInit } from '@angular/core';

//Services
import { LoginService } from '../../../services/login.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {

  constructor(private loginService:LoginService) { }

  ngOnInit(): void {
  }

  logout(){
    this.loginService.logout();
  }

  getClubLogo(){

  }



}
