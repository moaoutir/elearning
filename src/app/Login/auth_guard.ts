import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { loginService } from "./login.service";

@Injectable({providedIn: 'root'})
export class AuthGuard implements CanActivate {

  constructor(private login_service: loginService, private router: Router) {}

  canActivate(): boolean {
    // on aura pas besoin d'utiliser statusService car la page va etre actualiser quand on change la route
    if (this.login_service.AuthService()) {
      return true;
    } else {
      this.router.navigate(['/Sign_in']);
      //return false;
    }
  }
}
