import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationService } from 'src/app/shared/services/authentication.service';
import { AuthResponseDto } from 'src/app/_interfaces/response/authResponse.model';
import { UserForAuthenticationDto } from 'src/app/_interfaces/user/userForAuthenticationDto.model';
import { ExternalAuthDto } from '../externalAuth/externalAuthDto.model';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  private returnUrl!: string;

  loginForm!: FormGroup;
  errorMessage: string = '';
  showError: boolean = false;

  constructor(
    private authService: AuthenticationService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.loginForm = new FormGroup({
      email: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required]),
    });

    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  public validateControl = (controlName: string) => {
    return (
      this.loginForm.get(controlName)!.invalid &&
      this.loginForm.get(controlName)?.touched
    );
  };

  public hasError = (controlName: string, errorName: string) => {
    return this.loginForm.get(controlName)!.hasError(errorName);
  };

  loginUser = (loginFormValue: any) => {
    this.authService.isExternalAuth = false;
    this.showError = false;
    const login = { ...loginFormValue };

    const userForAuth: UserForAuthenticationDto = {
      email: login.email,
      password: login.password,
      clientURI: 'http://localhost:4200/authentication/forgotpassword',
    };

    this.authService.loginUser('login', userForAuth).subscribe({
      next: (res: AuthResponseDto) => {
        if (res.is2StepVerificationRequired) {
          this.router.navigate(['/authentication/twostepverification'], {
            queryParams: {
              returnUrl: this.returnUrl,
              provider: res.provider,
              email: userForAuth.email,
            },
          });
        } else {
          localStorage.setItem('token', res.token);
          this.authService.sendAuthStateChangeNotification(
            res.isAuthSuccessful
          );
          this.router.navigate([this.returnUrl]);
        }
      },
      error: (err: HttpErrorResponse) => {
        this.errorMessage = err.message;
        this.showError = true;
      },
    });
  };

  externalLogin = () => {
    this.showError = false;
    this.authService.signInWithGoogle();

    this.authService.extAuthChanged.subscribe( user => {
      const externalAuth: ExternalAuthDto = {
        provider: user.provider,
        idToken: user.idToken
      }
      this.validateExternalAuth(externalAuth);
    })
  }

  private validateExternalAuth(externalAuth: ExternalAuthDto) {
    this.authService.externalLogin('externallogin', externalAuth)
      .subscribe({
        next: (res) => {
            localStorage.setItem("token", res.token);
            this.authService.sendAuthStateChangeNotification(res.isAuthSuccessful);
            this.router.navigate([this.returnUrl]);
      },
        error: (err: HttpErrorResponse) => {
          this.errorMessage = err.message;
          this.showError = true;
          this.authService.signOutExternal();
        }
      });
  }
}
