import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Injectable()
export class AuthGuard implements CanActivate {
  redirectUrl;
  constructor(
    private auth: AuthService,
    private router: Router
  ) {}
  canActivate(
    router: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ) {
    if (this.auth.isLoggedin()) {
      return true;
    } else {
      this.redirectUrl = state.url;
      this.router.navigate(['/login']);
      return false;
    }
  }

  isAdminRoute(): boolean {
    return false;
  }
}
