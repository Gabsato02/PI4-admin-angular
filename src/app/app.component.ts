import { Component } from '@angular/core';
import { AuthService } from './services/auth/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'PI4-admin-angular';

  constructor(private authService: AuthService) {}

  logout(): void {
    this.authService.logout();
  }

  isLoggedIn(): boolean {
    const token = this.authService.isLoggedIn();
    if (token) {
      return true;
    } else {
      return false;
    }
  }
}
