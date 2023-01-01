import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from '../../services/authentication.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent {
  public isAuthenticated: boolean = false;

  constructor(
    private authService: AuthenticationService,
    private router: Router
  ) {
    this.authService.authChanged.subscribe((res) => {
      this.isAuthenticated = res;
    });
  }

  public logout = () => {
    this.authService.logout();

    if(this.authService.isExternalAuth)
    this.authService.signOutExternal();

    this.router.navigate(['/']);
  };
}
