import { Component,OnInit } from '@angular/core';
import { CourseService } from "../Course.service";
import { loginService } from "../Login/login.service";
import { Course } from "../Course.module";
import { ActivatedRoute  } from "@angular/router";
import { PageEvent } from '@angular/material/paginator';
import {MatDialog} from '@angular/material/dialog';
import { PayControlComponent } from "../PayControl/PayControl.component";

@Component({
  selector: 'list-course',
  templateUrl: './ListCourse.component.html',
  styleUrls: ['./ListCourse.component.css'],
  host: {'window:beforeunload':'doSomething'},
})

export class ListCourseComponent implements OnInit {
  courses : Course[] ;
  my_course;
  tab_id_my_course:number[]=[];
  role:string;
  p : number = 1;
  path:string="";
  nbr_cours_trouve:number;
  nom_du_cour_cherche:string="";
  constructor(public course_service : CourseService,public route:ActivatedRoute,public login_service:loginService,
    public dialog: MatDialog) {}
  ngOnInit() {
  this.route.paramMap.subscribe(paramMap=>{
    if (paramMap.has('name')) {
      this.nom_du_cour_cherche = paramMap.get('name');
      this.course_service.get_courses_by_name(this.nom_du_cour_cherche).subscribe(data=>{
        this.courses = data.liste_cours;
        this.nbr_cours_trouve = this.courses.length;
      })
      this.path = "search";
    }else{
      this.course_service.getCourses().subscribe(data =>{
        this.courses = data.courses;
      })
      this.path = "list_courses";
    }
  })
  // on ajoute ce traitement pour ne pas afficher le boutton acheter 50% en cas ou l'utilisateur a deja achete ce cours
  this.course_service.getFromMyCoursesByUser().subscribe(data=>{
    this.my_course = data.my_learning;
    for (let i = 0; i < this.my_course.length; i++)
      this.tab_id_my_course[i] = this.my_course[i].id_course;
    console.log(!this.tab_id_my_course.includes(this.courses[0]?._id),"  ",this.courses[0],"  ",this.tab_id_my_course);

  })
  this.role = this.login_service.HasRole();
  }
  openDialog() {
    const dialogRef = this.dialog.open(PayControlComponent);
  }

  send_id_course(id){
    this.course_service.setIdCourse(parseInt(id));
  }
}
