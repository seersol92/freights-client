import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable()
export class NotAuthGuard implements CanActivate {

  constructor(
    private auth: AuthService,
    private router: Router
  ) {}
  canActivate() {
    if (this.auth.isLoggedin()) {
      this.router.navigate(['/dashboard']);
      return false;
    } else {
      return true;
    }
  }

}
