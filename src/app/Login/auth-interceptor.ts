import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpEvent, HttpHandler, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { loginService } from "./login.service";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private authservice:loginService){}
  intercept(req: HttpRequest<any>, next: HttpHandler){
    //console.log(req.headers);
    const authtoken = this.authservice.getToken();
    if (authtoken != null) {
      const CloneRequest = req.clone({headers : req.headers.set('Authorization','bearer '+authtoken)})
      //console.log("CloneRequest ",CloneRequest);
      return next.handle(CloneRequest);
    }
    //console.log("request ",req);
    return next.handle(req);
  }
}
