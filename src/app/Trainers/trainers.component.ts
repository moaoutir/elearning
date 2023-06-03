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
  //display
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
    console.log(this.route.url);
    this.login_service.getFormer();
    this.list_users_sub = this.login_service.getUpdateUser().subscribe((login: Login[])=>{
      this.list_users = login;
      this.list_users_filter = login;

    })
    this.course_service.getDomains();
    this.list_domain_sub = this.course_service.getUpdateDomain().subscribe((domains: Domain[])=>{
      this.list_domains = domains;
    })
    this.course_service.getModuleAssignToAllFormer().subscribe(data=>{
      console.log(data);

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
    this.course_service.getFromMyCoursesByCourse(user)/*.subscribe(data=>{
      for (let i = 0; i < data.resultats.length; i++) {
        console.log(data.resultats[i]._id);
        this.course_service.deleteCourse(data.resultats[i]._id);
      }
    })*/
    this.liste_mes_cours_sub = this.course_service.getMesCoursUpdate().subscribe((data:MyCourses[])=>{
      console.log(data);

    })
  }

  getDomainSelected(event: any){
    this.domain_selected = event.value;
    if (this.domain_selected === undefined) {
      this.list_modules=[];
      this.module_selected = undefined;
    }else{
    let domain = this.list_domains.filter(elm => elm.name_domain === this.domain_selected);
    this.course_service.getModule(domain[0].id).subscribe(data=>{
      this.list_modules = data.list_module;
    })
    domain = [];
   }
  }

  getModuleSelected(event:any){
    this.module_selected = event.value;
  }

  Domain(domain_selected:string){
    const domain = this.list_my_domain.filter(elm => elm.name_domain === domain_selected)
    let users:string[]=[];
    for (let i = 0; i < domain.length; i++) {
      users[i] = domain[i].user
    }
    return this.list_users.filter(elm => users.includes(elm._login));
  }

  Module(module_selected:string){
    //let users_by_domain = this.Domain(domain_selected);
    // on selectionne les modules qui ont le nom qu'on cherche
    const modules = this.list_my_modules.filter(elm => elm.name_module === module_selected)
    let users:string[]=[];
    for (let i = 0; i < modules.length; i++) {
      users[i] = modules[i].user
    }
    return this.list_users.filter(elm => users.includes(elm._login));
  }

  search(){

    console.log(this.list_users_filter);

    if (this.domain_selected == undefined && this.module_selected==undefined) {
      this.list_users_filter = this.list_users;
    }else if(this.module_selected == undefined){
      this.list_users_filter = this.Domain(this.domain_selected)
    }else{
      this.list_users_filter = this.Module(this.module_selected)
    }
  }
  ngOnDestroy(): void {
    this.list_domain_sub.unsubscribe();
    this.liste_mes_cours_sub.unsubscribe();
  }

}
