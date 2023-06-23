import { Component,OnInit } from '@angular/core';
import { CourseService } from "../Course.service";
import { loginService } from "../Login/login.service";
import { Course,MyCourses,Certificate } from "../Course.module";
import {MatTableDataSource} from '@angular/material/table';
import {SelectionModel} from '@angular/cdk/collections';
import { Router  } from "@angular/router";
import {MatDialog} from '@angular/material/dialog';
import { QuizComponent } from "../Quiz/quiz.component";
import {MatBottomSheet, MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { EmailComponent } from "../Email/email.component";
import { PayControlComponent } from "../PayControl/PayControl.component";

@Component({
  selector: 'my_learning',
  templateUrl: './myLearning.component.html',
  styleUrls: ['./myLearning.component.css']
})
export class MyLearningComponent implements OnInit {
  displayedColumns: string[] = ['edit','_titleCours','_domain','_module'];
  dataSource = new MatTableDataSource();
  selection = new SelectionModel(true, []);
  courses : Course[];
  course: Course;
  myCourses;
  my_certificate:Certificate[]=[];
  tab_id_course:number[]=[];
  name : string;
  path : string = '';
  constructor(public course_service : CourseService,public route:Router,public dialog: MatDialog, private _bottomSheet:MatBottomSheet,
    private login_service: loginService) {}

  ngOnInit() {
  this.course_service.get_mon_apprentissage().subscribe(data =>{
    this.myCourses = data.my_learning;
  },error =>{
    this.route.navigate(['/'])
  })

  this.course_service.getCertificates().subscribe(data=>{
    this.my_certificate  = data.certificates;

    for (let i = 0; i < this.my_certificate.length; i++) {
      this.tab_id_course[i] = this.my_certificate[i].id_course;
    }

  })
  }

  afficher_cours(event: any){
    this.route.navigate(['/display',event._id]);
    }

  // boite dialog pour informer qu'il faut acheter la deuxieme moitie du cours
  openDialog(event: any) {
    this.course_service.setIdCourse_quiz(event._id);
    const dialogRef = this.dialog.open(PayControlComponent);
  }

  openBottomSheet(row:any): void {
    // cette fonction cherche l'email de l'utilisateur avec getEmailOfuser puis envoie l'email
    this.login_service.getEmailOfuser(row._creator).subscribe(data=>{
      this.course_service.setEmail(data.email);
      this._bottomSheet.open(EmailComponent);
    })

  }

}
