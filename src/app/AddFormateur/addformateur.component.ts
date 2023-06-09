import { Component,OnInit,OnDestroy } from '@angular/core';
import { loginService } from "../Login/login.service";
import { Router } from '@angular/router';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { CourseService } from "../Course.service";
import { Domain,Module } from "../Course.module";
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
  list_module:Module[];
  ngOnInit(): void {
    this.course_service.getDomains();
    this.list_domain_sub = this.course_service.getUpdateDomain().subscribe((domains:Domain[])=>{
      this.list_domains = domains;
    })
  } // avec les observables on peut gerer les donnees en temps reel

  form: FormGroup = new FormGroup({
    prenom : new FormControl(null,{validators:[Validators.maxLength(30),Validators.required]}),
    nom : new FormControl(null,{validators:[Validators.maxLength(30),Validators.required]}),
    email : new FormControl(null,{validators:[Validators.maxLength(30),Validators.required,Validators.email]}),
    password : new FormControl(null,{validators:[Validators.maxLength(30),Validators.required]}),
    login : new FormControl(null,{validators:[Validators.maxLength(30),Validators.required]}),
    domain : new FormControl(null,{validators:[Validators.maxLength(30),Validators.required]}),
    module : new FormControl(null,{validators:[Validators.maxLength(30),Validators.required]}),
  });



  getDomain(name_domain:string){
    return this.list_domains.filter(elm => elm.name_domain === name_domain);
  }

  getDomainSelected(event){
    this.list_module=[];
    this.form.value.module=null;
    const name_domain = event.value;
    if (name_domain !== undefined) {
      const domain = this.getDomain(name_domain); // appelle a la fonction en haut
      // on aura besoin de id pour ...
      this.course_service.getfilieres(domain[0].id).subscribe(data=>{
        this.list_module = data.list_module;
      })
    }
  }

  AddNewFormer(){
    console.log(this.form.value.module);

    if (this.form.invalid){
      alert("formulaire invalide");
      return;
    }
    let array_id_module:number[]=[]; // puisque on va souvgarder led id des modules dans la table mydomain et mymodule
    this.login_service.addNewLogin(this.form.value.login,this.form.value.email,this.form.value.password,
      this.form.value.prenom,this.form.value.nom,this.type);
      const domain = this.getDomain(this.form.value.domain); // pour recevoie id de domaine
      const module = this.list_module.filter(elm => this.form.value.module.includes(elm.name_module)) // pour recevoir le module complet avec son id parceque on aura besoin des id

      for (let j = 0; j< module.length; j++) {  // mettre les id dans la table array_id_module
        array_id_module.push(module[j]._id);
      }
      this.course_service.setModuleToFormer(this.form.value.login,domain[0].id,array_id_module);
      this.route.navigate(['/get_trainers']);
  }

  ngOnDestroy(): void {
    this.list_domain_sub.unsubscribe();
  }
}
