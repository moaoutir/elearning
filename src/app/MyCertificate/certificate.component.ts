import { Component ,OnInit} from '@angular/core';
import { CourseService } from "../Course.service";
import { Certificate } from "../Course.module";
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Router } from '@angular/router';

@Component({
  selector: 'certificate',
  templateUrl: './certificate.component.html',
  styleUrls: ['./certificate.component.css']

})
export class MyCertificateComponent implements OnInit{

  constructor(private course_service: CourseService,public sanitizer: DomSanitizer,private route:Router){}
  list_certificate: Certificate[]=[];


  ngOnInit(): void {
    this.course_service.getCertificates().subscribe(data => {
      this.list_certificate = data.certificates;
    },error =>{
      console.log(error);
      this.route.navigate(['/'])});


  }
  showCertificate(certificate:any){
    window.open(certificate);
  }

}
