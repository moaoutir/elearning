import { Component,OnInit } from '@angular/core';
import { ActivatedRoute, Router  } from "@angular/router";
import { CourseService } from "../Course.service";
import { Course } from "../Course.module";
import { DomSanitizer } from '@angular/platform-browser';
import { loginService } from "../Login/login.service";
import { Login } from "../Login/login.module";


@Component({
  selector: 'display_cours',
  templateUrl: './display.component.html',
  styleUrls: ['./display.component.css']
})
export class DisplayCourse implements OnInit {
  id: string;
  display_course : Course;
  path_course :string ;
  url1;
  url2;
  instructor:string ="";
  constructor(public route :ActivatedRoute,public course_service : CourseService,protected _sanitizer: DomSanitizer,private login_service:loginService,
    private router:Router){}

  ngOnInit(): void {
    console.log("kkdkd");

    this.route.paramMap.subscribe(paramap=>{
      this.id = paramap.get('id');
      console.log("jj",this.id);

      this.course_service.getCourse(parseInt(this.id)).subscribe(data =>{
        console.log("dd",data);
        this.display_course = data.course;
        this.instructor = data.instructor._firstName + " " +data.instructor._lastName;
        this.url1=this._sanitizer.bypassSecurityTrustResourceUrl(this.display_course._course as string);
        this.url2=this._sanitizer.bypassSecurityTrustResourceUrl(this.display_course._tp as string);

      },error=>{          // on navigue vers la page d'aceuil si le cours n'est pas autorise
        this.router.navigate(['/']);
      })
    })
  }

}
