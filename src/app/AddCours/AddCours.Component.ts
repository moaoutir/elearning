import { Component, OnInit,OnDestroy } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { CourseService } from '../Course.service';
import { Router } from '@angular/router';
import { Course,Question,Domain,filiere } from "../Course.module";
import { Subscription } from "rxjs";


@Component({
  selector: 'Add-Course',
  templateUrl: './AddCours.component.html',
  styleUrls: ['./AddCours.component.css'],
})
export class AddCoursComponent implements OnInit,OnDestroy {
  constructor(public course_service: CourseService, private route: Router) {}
  list_domians:Domain[]=[];
  domaine:Domain;
  domain_selected:string;
  list_filieres:filiere[]=[];
  tab_question : Question[] = [];
  question : Question;
  imagepreview: string | ArrayBuffer | null;
  tab_options:string[]=[];
  displayChapter = '';
  numberChap = [];
  cmp = 0;
  // FormGroup offre des fonctionnalités pour la validation et la manipulation des données du formulaire.
  form: FormGroup = new FormGroup({
    titre: new FormControl(null, {validators: [Validators.required, Validators.maxLength(30)],}),
    description: new FormControl(null, {validators: [Validators.required, Validators.maxLength(120)],}),
    prix: new FormControl(null, {validators: [Validators.required, Validators.maxLength(200)],}),
    filiere: new FormControl(null, { validators: [Validators.required] }),
    cours: new FormControl(null, { validators: [Validators.required] }),
    tp: new FormControl(null, { validators: [Validators.required] }),
    image : new FormControl(null,{validators:[Validators.required]}),
    question : new FormControl(null,{validators:[Validators.maxLength(180)]}),
    reponse : new FormControl(null,{validators:[Validators.maxLength(180)]}),
    option1: new FormControl(null,{validators:[Validators.maxLength(180)]}),
    option2: new FormControl(null,{validators:[Validators.maxLength(180)]}),
    option3: new FormControl(null,{validators:[Validators.maxLength(180)]}),
    option4: new FormControl(null,{validators:[Validators.maxLength(180)]})
  });

  ngOnInit(): void {
  this.course_service.get_filieres_attribue_au_formateur().subscribe(data=>{
    // domaine {name_domain, _id, id_domain, user}
    this.domaine = data.my_domain; //
    // modules {name_module, _id, id_domain}
    this.list_filieres = data.my_modules;
  })
  }

  // on récupére le premier fichier sélectionné par l'utilisateur
  onCourseChange(event: Event) {
    const file = (event.target as HTMLInputElement).files[0];
    this.form.patchValue({ cours: file});
  }

  onTpChange(event: Event) {
    const file = (event.target as HTMLInputElement).files[0];
    this.form.patchValue({ tp: file});
  }

  onImageChange(event: Event) {
    const file = (event.target as HTMLInputElement).files[0];
    this.form.patchValue({image:file});
  }


  clickfunction(){

    if (this.form.value.question  === null || this.form.invalid ||  this.form.value.option1  === null ||  this.form.value.option2  === null ||
      this.form.value.option3  === null ||  this.form.value.option4  === null ||  this.form.value.reponse  === null  ) {
      return;
    }

    this.cmp += 1;

    if (this.cmp <= 10) {
      // on va remplir l'ensemble des questions, options et reponses dans tab_question
      this.tab_options.push(this.form.value.option1);
      this.tab_options.push(this.form.value.option2);
      this.tab_options.push(this.form.value.option3);
      this.tab_options.push(this.form.value.option4);

      this.question = {id_question:null,_question:this.form.value.question,_options:this.tab_options,
        _response:this.form.value.reponse,_score:null,id_course:null}

        this.tab_question.push(this.question);

        this.tab_options = [];

        this.form.patchValue({question:null});
        this.form.patchValue({option1:null});
        this.form.patchValue({option2:null});
        this.form.patchValue({option3:null});
        this.form.patchValue({option4:null});
        this.form.patchValue({reponse:null});

    }
    if(this.cmp == 10){
      this.course_service.AddCourse(this.form.value.titre,this.form.value.description,this.form.value.prix,
        this.domaine.name_domain,this.form.value.filiere,this.form.value.cours,this.form.value.tp,this.form.value.image).subscribe(data =>{
          for (let i = 0; i < this.tab_question.length; i++) {
            this.course_service.addQuetionQCM(this.tab_question[i]._question,this.tab_question[i]._options,
              this.tab_question[i]._response, data.id);
          }
        });
      this.route.navigate(['/Course_create']);
    }

  }
  ngOnDestroy(): void {

  }
}
