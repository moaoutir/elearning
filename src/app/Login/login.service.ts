import { Login } from "./login.module";
import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Subject } from "rxjs";
import { Router } from "@angular/router";
import { MyCourses } from "../Course.module";

@Injectable({providedIn: "root"})
export class loginService{
  private newLogin:Login;
  private login:Login;
  private list_user:Login[]=[];
  private mes_cours:MyCourses[]=[];
  private statusService: boolean;
  private token: string;
  private role: string;
  private status = new Subject<boolean>();
  private UserUpdate = new Subject<Login[]>();
  private Mes_cours_Update = new Subject<MyCourses[]>();
  constructor(private http:HttpClient,private route: Router){}

  addNewLogin(login :string,email:string, password:string, firstName:string, lastName:string, type:string){
    this.newLogin = {id: null,_firstName:firstName,_lastName:lastName,_login:login,_email:email,_password:password,_type:type};
    this.list_user.push(this.newLogin);
    console.log(this.newLogin);
    this.UserUpdate.next([...this.list_user]);
    this.http.post("http://localhost:3000/login/sign_up",this.newLogin).subscribe();
    if(type === "student")
      this.LOGIN(login,password);
  }

  getFormer(){
    this.http.get<{users: Login[]}>("http://localhost:3000/login/listes_formateurs").subscribe(data=>{
      this.list_user = data.users;
      this.UserUpdate.next([...this.list_user]);
    },error =>{
      console.log(error);
      this.route.navigate(['/'])});
  }
  getEmailOfuser(user:string){
    return this.http.get<{email: string}>("http://localhost:3000/login/get_email/"+user);
  }

  getUpdateFormer(){
    return this.UserUpdate.asObservable();
  }

  deleteUser(login:string){
    this.http.delete("http://localhost:3000/login/"+login).subscribe(()=>{
      const updateUser = this.list_user.filter(user=>user._login !== login);
      this.list_user = updateUser;
      this.UserUpdate.next([...this.list_user]);
    });
  }

  LOGIN(_login: string,password: string){
    this.login={id:null,_firstName:null,_lastName:null,_login:_login,_email:null,_password:password,_type:null}
    this.http.post<{token: string,ExpiresIn: number,role:string}>("http://localhost:3000/login/sign_in",this.login).subscribe(data=>{
      this.statusService = true;
      this.token = data.token;
      this.role = data.role;
      this.status.next(true);
      this.SaveAuthData(this.token,this.role);
      this.route.navigate(['/']);
    },error=>{ console.log(error);
    ;alert(error.statusText);
    });
  }

  LOGOUT(){
    this.role = null;
    this.token=null;
    this.statusService=false;
    this.status.next(false);
    this.ClearAuthData();
    this.route.navigate(['/']);
  }
  AuthService(){
    return this.statusService;
  }
  getToken(){
    return this.token;
  }
  // on retourne le status de l'authentification s'il est connecte ou non. cette tache nécessité un observable
  // qui reste a l'ecoute a chaque fois quand change le status
  getAuthStatusListner(){
    return this.status.asObservable();
  }

  private SaveAuthData(token: string,role: string){
    localStorage.setItem("token",token);
    localStorage.setItem("role",role);
  }

  private ClearAuthData(){
    localStorage.removeItem("token");
    localStorage.removeItem("role");
  }

  private getauthData(){
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    if (!token) {
      return;
    }
    return {
      token : token,
      role: role
    }
  }

  AutoAuthUser(){
    const AuthInformation = this.getauthData();
    if (!AuthInformation) {
      return;
    }
    const now = new Date();
    if (AuthInformation) {
      this.token = AuthInformation.token;
      this.role = AuthInformation.role;
      this.status.next(true);
      this.statusService = true;
    }
  }

  HasRole(){
    return this.role;
  }


}
