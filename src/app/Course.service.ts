import { Course,MyCourses,Question,Domain,Module,Certificate,MyModule,Email } from "./Course.module";
import { Login } from "./Login/login.module";
import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Subject } from "rxjs";
import { Router } from "@angular/router";



@Injectable({providedIn: "root"})
export class CourseService{
  private lecon :Course;
  private lecons: Course[]=[];
  private question: Question;
  private mon_cours: MyCourses;
  private mes_cours: any[]=[];
  private domain : Domain;
  private domains: Domain[]=[];
  private module: Module;
  private courseUpdate = new Subject<Course[]>();
  private MescoursUpdate = new Subject<MyCourses[]>();
  private trainingUpdate = new Subject<Domain[]>();
  my_module:MyModule;
  id_course_to_buy: number=0;
  id_course_quiz:number= 0;
  email:string=null;

  constructor(private http : HttpClient,private route:Router){}

  AddCourse(title: string, description: string, price: string,domain:string, module:string ,file : File,tp : File,image : string|File){
    let filedata : FormData;
    filedata = new FormData();
    filedata.append("titleCours",title),
    filedata.append("description",description),
    filedata.append("price",price),
    filedata.append("domain",domain),
    filedata.append("module",module),
    filedata.append("course",file),
    filedata.append("tp",tp),
    filedata.append("image",image)

    return this.http.post<{id : number}>("http://localhost:3000/course/",filedata);
  }

  getCourses(){
    return this.http.get<{courses : Course[]}>("http://localhost:3000/course/");
  }

  getCourse(id : number){

    return this.http.get<{course : Course,instructor:Login}>("http://localhost:3000/course/"+id);
  }
  search_courses_by_name(name: string){
    return this.http.get<{liste_cours:Course[]}>("http://localhost:3000/course/search/"+name)
  }

  getMyCourseCreate(){
    this.http.get<{courses : Course[]}>("http://localhost:3000/course/MycourseCreate").subscribe(data=>{
      this.lecons = data.courses;
      this.courseUpdate.next([...this.lecons]);
    },error =>{
      console.log(error);
      this.route.navigate(['/'])});
  }

  getCourseUpdate(){
    return this.courseUpdate.asObservable();
  }

  deleteCourse(id : number){
    this.http.delete("http://localhost:3000/course/"+id).subscribe(()=>{
      console.log("delete");

      const UpdateCourse = this.lecons.filter(elm => elm._id != id);
      this.lecons = UpdateCourse;
      this.courseUpdate.next([...this.lecons]);
    });
  }

  addToMyCourses(id_course:number){
    this.mon_cours = {id:null,id_courses:id_course,user:null};
    this.mes_cours.push(this.mon_cours);
    this.MescoursUpdate.next([...this.mes_cours]);
    this.http.post("http://localhost:3000/course/MyCourses",this.mon_cours).subscribe();
  }

  getFromMyCoursesByFormer(user: string){
    this.http.get<{mes_cours:any}>("http://localhost:3000/course/MyCourses/"+user).subscribe(data=>{
      this.mes_cours = data.mes_cours;
      this.MescoursUpdate.next([...this.mes_cours]);
    });
  }

  getFromMyCoursesByAdmin(){
    this.http.get<{mes_cours:any}>("http://localhost:3000/course/all_courses_and_their_students").subscribe(data =>{
      this.mes_cours = data.mes_cours;
      this.MescoursUpdate.next([...this.mes_cours])
    },error =>{
      console.log(error);
      this.route.navigate(['/'])});
  }

  getFromMyCoursesByLearner(){
    return this.http.get<{my_learning:any}>("http://localhost:3000/course/Mylearning");
  }

  getMesCoursUpdate(){
    return this.MescoursUpdate.asObservable();
  }

  SupprimerDeMesCours(login:string){ // on doit faire un update de MesCours quand on supprime un utilisateur
    const UpdateMesCours = this.mes_cours.filter (elm => elm._login !== login);
    this.mes_cours = UpdateMesCours;
    this.MescoursUpdate.next([...this.mes_cours]);
  }

  // on gere les domaines
  addDomain(name_domain: string){
    this.domain = {id:null,name_domain:name_domain}
    this.domains.push(this.domain);
    console.log(this.domains);

    this.trainingUpdate.next([...this.domains]);
    this.http.post("http://localhost:3000/training/domain",this.domain).subscribe();
  }

  getDomains(){
    this.http.get<{list_domain: Domain[]}>("http://localhost:3000/training/domain").subscribe(data =>{
      this.domains=data.list_domain;
      this.trainingUpdate.next([...this.domains]);
    },error =>{
      console.log(error);
      this.route.navigate(['/'])});
  }

  deleteDomain(name:string){
    this.http.delete<{list_domain: Domain[],list_module:Module[]}>("http://localhost:3000/training/domain/"+name).subscribe(()=>{
      const updateTraining = this.domains.filter(elm => elm.name_domain !== name);
      console.log(updateTraining);
      this.domains = updateTraining;
      this.trainingUpdate.next([...this.domains]);
    });
  }

  getUpdateDomain(){
    return this.trainingUpdate.asObservable();
  }

  setModuleToFormer(user:string,id_domain:number,list_id_module:number[]){
    this.my_module = {id:null,user:user,id_domain:id_domain,list_id_module}
    this.http.post("http://localhost:3000/training/my_module",this.my_module).subscribe();
   }

  getModuleAssignToFormer(){
    return this.http.get<{my_domain:Domain,my_modules:Module[]}>("http://localhost:3000/training/my_module");
  }

  getModuleAssignToAllFormer(){
    return this.http.get<{list_my_domain:Domain[],list_my_modules:Module[]}>("http://localhost:3000/training/listMy_module");
  }

  addModule(list_module:Module[]){
    //this.module = {id:null,name_module:name_module,id_domain:id_domain};
    //console.log(this.module);
    //this.http.delete("http://localhost:3000/training/module/"+id_domain).subscribe();
    this.http.post("http://localhost:3000/training/module",list_module).subscribe();
  }

  getfilieres(id_module: number){
    return this.http.get<{list_module: Module[]}>("http://localhost:3000/training/module/"+id_module);
  }

  getQuiz(id: string){
    return this.http.get<{list_question:Question[] ,list_options: string[]}>("http://localhost:3000/quiz/"+id);
  }

  addQuetionQCM(question:string,options:string[],correctChoice:string,idCourse:number){
    this.question={id_question:null,_question:question,_options:options,_response:correctChoice,_score:null,id_course:idCourse}
    this.http.post("http://localhost:3000/quiz/add_question",this.question).subscribe();
  }

  CreateCertificate(name_course: string,creator: string, score: number,id_course:number){
    console.log(name_course,creator,score);

    const certificate ={name_course:name_course,creator:creator,score:score,id_course:id_course};
    return this.http.post<{certificate: string}>("http://localhost:3000/certificate",certificate);
  }

   getCertificates(){
     return this.http.get<{certificates: Certificate[]}>("http://localhost:3000/certificate");
   }

   get_all_Certificats(){
    return this.http.get<{certificates: Certificate[]}>("http://localhost:3000/certificate/tous_les_certificats");
  }

   /* id cours on va l'utiliser dans le composant dialogue et le email dans le composant Bottom Sheet */
   getIdCourse(){
    return this.id_course_to_buy;
   }
   getIdCourse_quiz(){
    return this.id_course_quiz;
   }
   getEmail(){
    return this.email;
   }
   setIdCourse(id:number){
    this.id_course_to_buy =id;
   }
   setIdCourse_quiz(id:number){
    this.id_course_quiz =id;
   }
   setEmail(email:string){
    this.email = email;
   }
   /*   */

   sendEmail(sujet:string,text:string,email_destinataire:string){
    const email:Email = {sujet:sujet,text:text,email_destinataire:email_destinataire};
    console.log(email);
    this.http.post("http://localhost:3000/email",email).subscribe();
   }


   getCount(){
    console.log("kjj");

    return this.http.get<{cours:number,formers:number,students:number}>("http://localhost:3000/course/count");
   }
}
