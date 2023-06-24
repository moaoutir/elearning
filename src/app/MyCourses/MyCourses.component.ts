import { Component,OnInit,OnDestroy } from '@angular/core';
//import { loginService } from "./Login/login.service";
import { CourseService } from "../Course.service";
import { Course,Domain,filiere } from "../Course.module";
import { Subscription } from 'rxjs';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';



@Component({
  selector: 'List_Course_Create_By_Former',
  templateUrl: './MyCourses.component.html',
  styleUrls: ['./MyCourses.component.css']
})
export class MyCoursesComponent implements OnInit,OnDestroy{
  constructor(private course_service: CourseService){}
  list_course_sub:Subscription = new Subscription();
  list_cours: Course[]=[];
  liste_cours_filtrer: Course[]=[]
  lists_filieres: filiere[]=[];
  filiere_selected:string;

  ngOnInit(): void {
    window.scrollTo(0,0);
    // les filieres attribue au formateur
    this.course_service.get_filieres_attribue_au_formateur().subscribe(data =>{
      this.lists_filieres = data.my_modules;
    })
    // liste des cours cree par le formateur
    this.course_service.getMyCourseCreate();
     this.list_course_sub = this.course_service.getCourseUpdate().subscribe((courses: Course[])=>{
       this.liste_cours_filtrer = courses;
       this.list_cours = courses;
     });
    }

  get_filiere_Selected(event){ // le filiere selectionne par la liste select
    this.filiere_selected = event.value
  }

  // chercher les cours par filiere
  chercher(){
    if (this.filiere_selected == undefined) {
      this.liste_cours_filtrer = this.list_cours;
    }else
      this.liste_cours_filtrer = this.list_cours.filter(elm => (elm._module === this.filiere_selected));
  }

  supprimer_cours(id: number){
    this.course_service.deleteCourse(id);
  }



  ngOnDestroy(): void {
    this.list_course_sub.unsubscribe();
  }
}
