import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from './shared/services/authentication.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title = 'side-project';

  constructor(private authService: AuthenticationService) {}

  ngOnInit(): void {
    if (this.isAuthenticated()) {
      this.authService.sendAuthStateChangeNotification(true);
    }
  }

  isAuthenticated(){
    return this.authService.isUserAuthenticated();
  }
}
