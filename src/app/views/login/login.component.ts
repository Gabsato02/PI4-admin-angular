import { Component, OnInit } from '@angular/core';
import { Auth } from 'src/app/models/auth';
import { AuthService } from 'src/app/services/auth/auth.service';
import { HttpErrorResponse } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  user: Auth = {
    email: '',
    password: ''
  };
  error = '';
  loading = false;

  constructor(private authService: AuthService, private router: Router, private snackBar: MatSnackBar) {}

  ngOnInit(): void {}

  showSnackbar(message: string): void {
    this.snackBar.open(message, '', {
      duration: 3000
    });
  }

  isEmailValid(): boolean {
    if (this.user.email !== '') {
      return true;
    }
    return false;
  }

  isPasswordValid(): boolean {
    if (this.user.password !== '') {
      return true;
    }
    return false;
  }

  onSubmit(): void {
    if (this.isEmailValid() && this.isPasswordValid()) {
      this.error = '';
      try {
        this.loading = true;
        this.authService.login(this.user).subscribe(
          response => {
            const userId: any = response;
            this.authService.getUser(userId.message).subscribe(
              resp => {
                const user: any = resp;
                if (user.role === 'admin') {
                  localStorage.setItem('id_token', Math.random().toString(36).substr(2));
                  this.router.navigate(['/item']);
                } else {
                  this.error = 'Usuário sem permissão';
                }
              }
            );
          },
          () => {
            this.error = 'Credenciais inválidas';
          }
        );

      } catch (error) {
        this.handleError(error);
      } finally {
        this.loading = false;
      }
    } else {
      this.error = 'Preencha os campos corretamente';
    }
  }

  private handleError(error: unknown): void {
    const e = error as HttpErrorResponse;
    this.showSnackbar(e.statusText);
  }
}
