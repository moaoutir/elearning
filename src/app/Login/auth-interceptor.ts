import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpEvent, HttpHandler, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { loginService } from "./login.service";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private login_service:loginService){}
  intercept(req: HttpRequest<any>, next: HttpHandler){
    //console.log(req.headers);
    const token = this.login_service.getToken();
    if (token != null) {
      const Requet_clone = req.clone({headers : req.headers.set('Authorization',token)})

      return next.handle(Requet_clone);
    }
    return next.handle(req);
  }
}
