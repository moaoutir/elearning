import { Component,OnInit,OnDestroy } from '@angular/core';
import { CourseService } from "../Course.service";
import { Course,MyCourses,Domain,filiere,Certificate } from "../Course.module";
import {MatTableDataSource} from '@angular/material/table';
import {SelectionModel} from '@angular/cdk/collections';
import { ActivatedRoute ,Router } from "@angular/router";
import { loginService } from "../Login/login.service";
import { EmailComponent } from "../Email/email.component";
import {MatBottomSheet, MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { Subscription } from "rxjs";


@Component({
  selector: 'my_courses',
  templateUrl: './myLearners.component.html',
  styleUrls: ['./myLearners.component.css']
})
export class MyLearnersComponent implements OnInit,OnDestroy {
  displayedColumns: string[] = ['edit','_titleCours','_domain','_module', 'name','certificat'];
  dataSource = new MatTableDataSource();
  selection = new SelectionModel(true, []);
  courses : Course[];
  course: Course;
  myCourses;
  mycourse_filter;
  list_domains:Domain[]=[];
  domain_selected:string;
  list_domain_sub:Subscription = new Subscription();
  liste_my_courses_sub:Subscription = new Subscription();
  lists_filieres:filiere[]=[];
  filiere_selected:filiere;
  total_course:number;
  type_of_user:string;
  text_header:string;
  certificate:Certificate[]=[];

  constructor(public course_service : CourseService, public route : Router,private login_service:loginService, private _bottomSheet:MatBottomSheet) {}

  ngOnInit() {
    if (this.route.url === "/Mylearners") { // le formateur
      this.type_of_user="former";
      this.course_service.getFromMyCoursesByFormer(); // On cherche des cours que nos étudiants ont achetés et qui ont ete cree par ce formateur de la table my courses
      this.liste_my_courses_sub = this.course_service.getMesCoursUpdate().subscribe((data:MyCourses[])=>{
        this.myCourses = data;
        this.mycourse_filter = data;
        this.total_course = this.mycourse_filter.length;
      })

      this.course_service.get_filieres_attribue_au_formateur().subscribe(data=>{
        this.lists_filieres = data.my_modules;

      },error =>{
        this.route.navigate(['/'])
      })
      this.text_header = "Mes apprenants et leurs cours";

    }else if (this.route.url === "/get_students") { // administrateur
      this.type_of_user="administrator";
      this.course_service.getFromMyCoursesByAdmin(); // Nous recherchons des cours que nos étudiants ont achetés et qui sont cree par tous nos formateur de la table my courses
      this.liste_my_courses_sub = this.course_service.getMesCoursUpdate().subscribe((data:MyCourses[])=>{
        this.myCourses = data;
        this.mycourse_filter = data;
        this.total_course = this.mycourse_filter.length;
      })

      this.course_service.getDomains();
      this.list_domain_sub = this.course_service.getUpdateDomain().subscribe((data : Domain[])=>{
        this.list_domains = data;
      })
      this.text_header = "Liste des apprenants et leurs cours"
    }

    // pour affiche les etudinats certifie ou non
    this.course_service.get_all_Certificats().subscribe(data=>{
      this.certificate = data.certificates;
    })

  }

  // formateur, administrateur
  getFiliereSelected(event){
    this.filiere_selected = event.value;
  }

  // administrateur
  getDomainSelected(event){

    this.filiere_selected = undefined;
    this.domain_selected = event.value.name_domain;

    if (this.domain_selected === undefined) {
      this.lists_filieres=[];
    }else{
      // on aura besoin de l'id de domaine pour afficher les filieres
      const id_domaine = event.value.id;

      this.course_service.getfilieres(id_domaine).subscribe(data=>{
        this.lists_filieres = data.list_module;
    })
   }
  }

  // adminstrateur
  Delete_apprenant(row:any){
    const user = row.user;
    this.login_service.deleteUser(user);
    this.course_service.SupprimerDeMonApprentissage(user); // on doit faire un update de l'observable MesCours quand on supprime un utilisateur
  }


  chercher(){
    // myCourses{_title_cours,  _domain, _module, user, _price }

    if (this.domain_selected == undefined && this.filiere_selected == undefined) {
      this.mycourse_filter = this.myCourses;
    }else if (this.filiere_selected == undefined) { // on cherche par domaine puisque le filiere est null
      this.mycourse_filter = this.myCourses.filter(elm => (elm._domain === this.domain_selected));

    }else
      this.mycourse_filter = this.myCourses.filter(elm => (elm._module === this.filiere_selected));
    this.total_course = this.mycourse_filter.length;
  }


   // administrateur et le formateur
  // on gere le BottomSheet pour envoyer un email
  openBottomSheet(row:any): void {
    this.login_service.getEmailOfuser(row.user).subscribe(data=>{
      this.course_service.setEmail(data.email);
      this._bottomSheet.open(EmailComponent);
    })
  }

  ngOnDestroy(): void {
    this.list_domain_sub.unsubscribe();
    this.liste_my_courses_sub.unsubscribe();
  }

}
