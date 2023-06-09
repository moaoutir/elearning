import { Component,OnInit,OnDestroy } from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import {SelectionModel} from '@angular/cdk/collections';
import { ActivatedRoute,Router  } from "@angular/router";
import { Login } from "../Login/login.module";
import { Domain,Module,MyCourses } from "../Course.module";
import { loginService } from "../Login/login.service";
import { CourseService } from "../Course.service";
import { Subscription } from 'rxjs';
import {MatBottomSheet, MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { EmailComponent } from "../Email/email.component";

@Component({
  selector: 'get_user',
  templateUrl: './trainers.component.html',
  styleUrls: ['./trainers.component.css']
})
export class GetUserComponent implements OnInit,OnDestroy {
  displayedColumns: string[] = ['edit','_firstName','_lastName','_login','_email','Domain','filière'];
  dataSource = new MatTableDataSource();
  selection = new SelectionModel(true, []);
  list_users:Login[]=[];
  list_users_filter:Login[]=[];
  list_users_sub: Subscription = new Subscription();
  list_domain_sub:Subscription = new Subscription();
  liste_mes_cours_sub:Subscription = new Subscription();
  list_modules:Module[]=[];
  list_domains:Domain[]=[];
  list_my_modules
  list_my_domain
  domain_selected:string;
  module_selected:string;
  type_of_user:string=""; // on aura pas besoin de la fonction hasrole() car on a l'url
  constructor(public login_service : loginService,private course_service:CourseService,private _bottomSheet: MatBottomSheet , public router : ActivatedRoute, public route : Router) {}



  ngOnInit() {
    this.login_service.getFormer();
    this.list_users_sub = this.login_service.getUpdateFormer().subscribe((login: Login[])=>{
      this.list_users = login;
      this.list_users_filter = login;
    })

    this.course_service.getDomains();
    this.list_domain_sub = this.course_service.getUpdateDomain().subscribe((domains: Domain[])=>{
      this.list_domains = domains;
    })

    this.course_service.getModuleAssignToAllFormer().subscribe(data=>{
      this.list_my_domain = data.list_my_domain;
      this.list_my_modules = data.list_my_modules;
    });

  }

    // on gere le BottomSheet
    openBottomSheet(row:any): void {
      this.course_service.setEmail(row._email);
      this._bottomSheet.open(EmailComponent);
    }

  functionDelete(row:any){
    const user = row._login;
    this.login_service.deleteUser(user);
    this.course_service.getFromMyCoursesByFormer(user)/*.subscribe(data=>{
      for (let i = 0; i < data.resultats.length; i++) {
        console.log(data.resultats[i]._id);
        this.course_service.deleteCourse(data.resultats[i]._id);
      }
    })*/
  }

  getDomainSelected(event: any){
    this.domain_selected = event.value;
    if (this.domain_selected === undefined) {
      this.list_modules=[];
      this.module_selected = undefined;
    }else{
    let domain = this.list_domains.filter(elm => elm.name_domain === this.domain_selected);
    this.course_service.getfilieres(domain[0].id).subscribe(data=>{
      this.list_modules = data.list_module;
    })
  }
  }

  getModuleSelected(event:any){
    this.module_selected = event.value;
  }


  search(){

    if (this.domain_selected == undefined && this.module_selected==undefined) {
      this.list_users_filter = this.list_users;
    }else if(this.module_selected == undefined){
      // list_my_domain { id_domain name_domain  user _id}
      const domain = this.list_my_domain.filter(elm => elm.name_domain === this.domain_selected)
      let users:string[]=[];
      for (let i = 0; i < domain.length; i++) {
        users[i] = domain[i].user
    }
    this.list_users_filter = this.list_users.filter(elm => users.includes(elm._login));
    }else{
      // list_my_modules {id_domain  name_module  user}
      // on cherche de la table list_my_modules qui ont le nom module_selected qu'on cherche
      const modules = this.list_my_modules.filter(elm => elm.name_module === this.module_selected)
      let users:string[]=[];
      for (let i = 0; i < modules.length; i++) {
        users[i] = modules[i].user
      }
      this.list_users_filter = this.list_users.filter(elm => users.includes(elm._login));
    }
  }
  ngOnDestroy(): void {
    this.list_domain_sub.unsubscribe();
    this.liste_mes_cours_sub.unsubscribe();
  }

}
