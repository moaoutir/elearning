import { Component,OnInit,OnDestroy } from '@angular/core';
import { loginService } from "../Login/login.service";
import { Router } from '@angular/router';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { CourseService } from "../Course.service";
import { Domain,filiere } from "../Course.module";
import { Subscription } from 'rxjs';

@Component({
  selector: 'add_former',
  templateUrl: './addformateur.component.html',
  styleUrls: ['./addformateur.component.css']
})
export class AddFormateurComponent implements OnInit,OnDestroy {

  constructor(public login_service:loginService,private course_service:CourseService ,private route: Router) {}
  type:string = "former";
  list_domains:Domain[];
  list_domain_sub: Subscription = new Subscription();
  lists_filieres:filiere[];
  domaine_id:number;
  form: FormGroup = new FormGroup({
    prenom : new FormControl(null,{validators:[Validators.maxLength(30),Validators.required]}),
    nom : new FormControl(null,{validators:[Validators.maxLength(30),Validators.required]}),
    email : new FormControl(null,{validators:[Validators.maxLength(30),Validators.required,Validators.email]}),
    password : new FormControl(null,{validators:[Validators.maxLength(30),Validators.required]}),
    login : new FormControl(null,{validators:[Validators.maxLength(30),Validators.required]}),
    domain : new FormControl(null,{validators:[Validators.maxLength(30),Validators.required]}),
    filiere : new FormControl(null,{validators:[Validators.maxLength(30),Validators.required]}),
  });

  ngOnInit(): void {
    // recuperer les domaines
    this.course_service.getDomains();
    this.list_domain_sub = this.course_service.getUpdateDomain().subscribe((domains:Domain[])=>{
      this.list_domains = domains;
    })
  }

  // avec les observables on peut gerer les donnees en temps reel


  getDomainSelected(event){
    this.lists_filieres=[];
    this.form.value.filiere=null;
    this.domaine_id = event.value;
    if (this.domaine_id !== undefined) {

      this.course_service.getfilieres(this.domaine_id).subscribe(data=>{
        this.lists_filieres = data.list_module;
      })
    }
  }

  AddNewFormer(){
    if (this.form.invalid){
      alert("formulaire invalide");
      return;
    }

    this.login_service.addNewLogin(this.form.value.login,this.form.value.email,this.form.value.password,
      this.form.value.prenom,this.form.value.nom,this.type);

      this.course_service.set_Filiere_Au_Formateur(this.form.value.login,this.domaine_id,this.form.value.filiere);

      this.route.navigate(['/get_trainers']);
  }

  ngOnDestroy(): void {
    this.list_domain_sub.unsubscribe();
  }
}
