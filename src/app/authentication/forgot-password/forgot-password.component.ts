import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthenticationService } from 'src/app/shared/services/authentication.service';
import { ForgotPasswordDto } from 'src/app/_interfaces/resetPassword/forgotPasswordDto.model';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css'],
})
export class ForgotPasswordComponent implements OnInit {
  forgotPasswordForm!: FormGroup;
  successMessage: string = '';
  errorMessage: string = '';
  showSuccess: boolean = false;
  showError: boolean = false;

  constructor(private _authService: AuthenticationService) {}

  ngOnInit(): void {
    this.forgotPasswordForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
    });
  }

  public validateControl = (controlName: string) => {
    return (
      this.forgotPasswordForm.get(controlName)!.invalid &&
      this.forgotPasswordForm.get(controlName)!.touched
    );
  };

  public hasError = (controlName: string, errorName: string) => {
    return this.forgotPasswordForm.get(controlName)!.hasError(errorName);
  };

  public forgotPassword = (forgotPasswordFormValue: any) => {
    this.showError = this.showSuccess = false;
    const forgotPass = { ...forgotPasswordFormValue };
    const forgotPassDto: ForgotPasswordDto = {
      email: forgotPass.email,
      clientURI: 'http://localhost:4200/authentication/resetpassword',
    };
    this._authService
      .forgotPassword('forgotpassword', forgotPassDto)
      .subscribe({
        next: (_) => {
          this.showSuccess = true;
          this.successMessage =
            'The link has been sent, please check your email to reset your password.';
        },
        error: (err: HttpErrorResponse) => {
          this.showError = true;
          this.errorMessage = err.message;
        },
      });
  };
}
