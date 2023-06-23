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
    this.course_service.getDomains();
    this.list_domain_sub = this.course_service.getUpdateDomain().subscribe((domains:Domain[])=>{
      this.list_domains = domains;
    })
  } // avec les observables on peut gerer les donnees en temps reel


  getDomainSelected(event){
    this.lists_filieres=[];
    this.form.value.filiere=null;
    const name_domain = event.value;
    if (name_domain !== undefined) {
      const domain = this.list_domains.filter(elm => elm.name_domain === name_domain);
      //car on aura besoin de id pour recevoir les filieres
      this.domaine_id = domain[0].id;

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
    let array_id_filiere:number[]=[]; // puisque on va souvgarder les id des filieres dans la table mydomain et my_filiere

    this.login_service.addNewLogin(this.form.value.login,this.form.value.email,this.form.value.password,
      this.form.value.prenom,this.form.value.nom,this.type);

      // this.form.value.filiere == ['filiere1' , 'filiere2' ... ]
      const filiere = this.lists_filieres.filter(elm => this.form.value.filiere.includes(elm.name_module))
      // la fontion set_Filiere_Au_Formateur a besoin de id du filiere mais pas son nom

      for (let j = 0; j< filiere.length; j++) {  // mettre les id dans la table array_id_filiere
        array_id_filiere.push(filiere[j]._id);
      }

      this.course_service.set_Filiere_Au_Formateur(this.form.value.login,this.domaine_id,array_id_filiere);

      this.route.navigate(['/get_trainers']);
  }

  ngOnDestroy(): void {
    this.list_domain_sub.unsubscribe();
  }
}
