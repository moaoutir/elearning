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
    if (window.scrollY >= 20) {
       this.header = true;

    } else {
      this.header = false;
    }
  }

  ngOnInit(){
    window.scrollTo(0,0);
    this.status = this.login_service.AuthService();
    this.role = this.login_service.HasRole();

    // on retourne le status de l'authentification s'il est connecte ou non. cette tache nécessité un observable
    // qui reste a l'ecoute a chaque fois quand change le status

    this.Auth_status_subs = this.login_service.getAuthStatusListner().subscribe(Status=>{
      this.status = Status;
      this.role = this.login_service.HasRole();
    })

  }

  ouvrir_barre_recherche(){
    this.search =true;
  }
  fermer_barre_recherche(){
    this.search =false;
    this.form.reset();
  }

  ClickSearch($event : any|string){
    if($event.key === "Enter"){
    if (this.form.value.input == null) {
      return;
    }
    const input = this.form.value.input;
    this.fermer_barre_recherche();
    this.route.navigate(['/search',input]);

  }
}

  logout(){
    this.login_service.LOGOUT();
  }

  ngOnDestroy(): void {
    this.Auth_status_subs.unsubscribe();
  }

}
