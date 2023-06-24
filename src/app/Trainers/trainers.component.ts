import { Component,OnInit,OnDestroy } from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import {SelectionModel} from '@angular/cdk/collections';
import { ActivatedRoute,Router  } from "@angular/router";
import { Login } from "../Login/login.module";
import { Domain,filiere,MyCourses } from "../Course.module";
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
  listes_formateur:Login[]=[];
  listes_formateur_filter:Login[]=[];
  list_users_sub: Subscription = new Subscription();
  list_domain_sub:Subscription = new Subscription();
  lists_filieres:filiere[]=[];
  list_domains:Domain[]=[];
  lists_mes_filieres
  lists_mes_domaines
  id_domaine:number;
  filiere_selected:string;
  type_of_user:string=""; // on aura pas besoin de la fonction hasrole() car on a l'url
  constructor(public login_service : loginService,private course_service:CourseService,private _bottomSheet: MatBottomSheet , public router : ActivatedRoute, public route : Router) {}



  ngOnInit() { // on recupere les formateurs, les domaines, et les filieres attribue au formateur
    this.login_service.getFormer();
    this.list_users_sub = this.login_service.getUpdateFormer().subscribe((login: Login[])=>{
      this.listes_formateur = login;
      this.listes_formateur_filter = login;
    })

    this.course_service.getDomains();
    this.list_domain_sub = this.course_service.getUpdateDomain().subscribe((domains: Domain[])=>{
      this.list_domains = domains;
    })

    this.course_service.getModuleAssignToAllFormer().subscribe(data=>{
      // data.list_my_domain { id_domain, name_domain,  user, _id}
      // data.list_my_modules {id_domain  name_module  user}
      this.lists_mes_domaines = data.list_my_domain;
      this.lists_mes_filieres = data.list_my_modules;
    });

  }


  delete_formateur(row:any){
    const user = row._login;
    this.login_service.deleteUser(user);
  }


  getFiliereSelected(event:any){
    this.filiere_selected = event.value;
  }


  getDomainSelected(event: any){
    this.id_domaine = event.value;
    this.filiere_selected = undefined;
    if (this.id_domaine === undefined) {
      this.lists_filieres=[];
    }else{
    this.course_service.getfilieres(this.id_domaine).subscribe(data=>{
      this.lists_filieres = data.list_module;
    })
  }
  }

  chercher(){

    if (this.id_domaine == undefined && this.filiere_selected==undefined) {
      this.listes_formateur_filter = this.listes_formateur;
    }else if(this.filiere_selected == undefined){// il doit retourner les formateur qui ont un domaine qui ressemble au domaine selectionne
      // lists_mes_domaines { id_domain, name_domain,  user, _id}
      const mes_domaines = this.lists_mes_domaines.filter(elm => elm.id_domain === this.id_domaine)

      let users:string[]=[];
      for (let i = 0; i < mes_domaines.length; i++) {
        users[i] = mes_domaines[i].user
    }

    this.listes_formateur_filter = this.listes_formateur.filter(elm => users.includes(elm._login));
    }else{
      // lists_mes_filieres {id_domain  name_module  user}
      // on cherche de la table lists_mes_filieres qui ont le nom filiere_selected qu'on cherche
      const modules = this.lists_mes_filieres.filter(elm => elm.name_module === this.filiere_selected)

      let users:string[]=[];
      for (let i = 0; i < modules.length; i++) {
        users[i] = modules[i].user
      }

      this.listes_formateur_filter = this.listes_formateur.filter(elm => users.includes(elm._login));
    }
  }



    // on gere le BottomSheet pour envoyer un email
  openBottomSheet(row:any): void {
    this.course_service.setEmail(row._email);
    this._bottomSheet.open(EmailComponent);
  }

  ngOnDestroy(): void {
    this.list_domain_sub.unsubscribe();
  }

}
