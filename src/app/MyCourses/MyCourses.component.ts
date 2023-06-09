import { Component,OnInit,OnDestroy } from '@angular/core';
//import { loginService } from "./Login/login.service";
import { CourseService } from "../Course.service";
import { Course,Domain,Module } from "../Course.module";
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
  list_course: Course[]=[];
  liste_course_filter: Course[]=[]
  list_modules: Module[]=[];
  module_selected:string;

  ngOnInit(): void {
    this.course_service.getModuleAssignToFormer().subscribe(data =>{
      this.list_modules = data.my_modules;
    })
    // liste des cours cree
    this.course_service.getMyCourseCreate();
     this.list_course_sub = this.course_service.getCourseUpdate().subscribe((courses: Course[])=>{
       this.liste_course_filter = courses;
       this.list_course = courses;
     });
    }

  getModuleSelected(event){ // le module selectionne par la liste select
    this.module_selected = event.value
  }

  search(){
    if (this.module_selected == undefined) {
      this.liste_course_filter = this.list_course;
    }else
      this.liste_course_filter = this.list_course.filter(elm => (elm._module === this.module_selected));
  }

  Functiondelete(id: number){
    this.course_service.deleteCourse(id);
  }

  ngOnDestroy(): void {
    this.list_course_sub.unsubscribe();
  }
}
