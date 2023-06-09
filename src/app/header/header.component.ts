import  { Component,OnInit,HostListener,OnDestroy } from '@angular/core';
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { Subscription } from "rxjs";
import { loginService } from "../Login/login.service";
import { Router } from '@angular/router';
@Component({
  selector: 'header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit,OnDestroy {
  Auth_status_subs : Subscription;
  searchCourse: string = '';
  Clicks = false;
  header = false;
  search = false;
  status = false;
  role: string
   form : FormGroup = new FormGroup({
    input : new FormControl(null,{validators:[Validators.required,Validators.maxLength(30)]})
   });

  constructor(private login_service:loginService,private route:Router){}
  @HostListener('window:scroll') onwindowScroll(){
    if (window.pageYOffset >= 20) {
       this.header = true;

    } else {
      this.header = false;
    }
  }

  functionClick(){
    this.search =true;
  }
  functionClick2(){
    this.search =false;
    this.form.reset();
  }

  ClickSearch($event : any|string){
    if($event.key === "Enter"){
    if (this.form.value.input == null) {
      return;
    }
    const input = this.form.value.input;
    this.functionClick2();
    this.route.navigate(['/search',input]);

  }
}
  ngOnInit(){
    window.scrollTo(0,0)
    this.status = this.login_service.AuthService();
    this.role = this.login_service.HasRole();
    //this.status = this.login_service.AuthService();
    this.Auth_status_subs = this.login_service.getAuthStatusListner().subscribe(Status=>{
      this.status = Status;
      this.role = this.login_service.HasRole();
    })
    console.log(this.role);

  }

  logout(){
    this.login_service.LOGOUT();
  }

  ngOnDestroy(): void {
    this.Auth_status_subs.unsubscribe();
  }

}
