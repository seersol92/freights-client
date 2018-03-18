import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { LoggedInService } from '../services/logged-in.service';
import { Router } from '@angular/router';
import { FlashMessagesService } from 'angular2-flash-messages';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  constructor(
    public auth: AuthService,
    public loggedSer: LoggedInService,
    private router: Router,
    private _flashMessagesService: FlashMessagesService
  ) {
     this.auth.getProfile().subscribe(profile => {
     if (profile.user) {
      this.auth.loggedinName = profile.user.username ;
      this.auth.isAdmin = profile.user.is_admin;
     }
    });
  }
  ngOnInit() {
  }

  logMeOut() {
    this.auth.logout();
    // flash message will be visible for 2 second
    this._flashMessagesService.show('You are logged out', { cssClass: 'alert-success', timeout: 2000 });
    this.router.navigate(['/login']);
  }
}
