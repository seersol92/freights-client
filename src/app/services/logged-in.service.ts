import { Injectable } from '@angular/core';
import { Headers, Http, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';
import { tokenNotExpired } from 'angular2-jwt';
import { AuthService } from './auth.service';

@Injectable()
export class LoggedInService {
  memberName;
  constructor(
      public auth: AuthService
      ) {
      }

}
