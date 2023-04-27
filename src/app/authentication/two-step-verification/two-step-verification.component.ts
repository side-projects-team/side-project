import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit} from '@angular/core';
import {
  FormGroup,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationService } from 'src/app/shared/services/authentication.service';
import { AuthResponseDto } from 'src/app/_interfaces/response/authResponse.model';
import { TwoFactorDto } from 'src/app/_interfaces/twofactor/twoFactor.model';
import { NgxOtpInputConfig } from 'ngx-otp-input';

@Component({
  selector: 'app-two-step-verification',
  templateUrl: './two-step-verification.component.html',
  styleUrls: ['./two-step-verification.component.css'],
})
export class TwoStepVerificationComponent implements OnInit {
  private provider: string = '';
  private email: string = '';
  private returnUrl: string = '';

  twoStepForm!: FormGroup;
  showError: boolean = false;
  errorMessage: string = '';

  twoStepCode!: string;

  otpInputConfig : NgxOtpInputConfig = {
      otpLength: 6,
      autofocus: true,
  }

  constructor(
    private authService: AuthenticationService,
    private route: ActivatedRoute,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.provider = this.route.snapshot.queryParams['provider'];
    this.email = this.route.snapshot.queryParams['email'];
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'];
  }

  handleOtpChange(value: string[]): void{
    
  }

  handleOtpFillEvent(value: string) : void{
    this.loginUser(value);
  }

  loginUser = (twoStepFormValue: string) => {
    this.showError = false;

    let twoFactorDto: TwoFactorDto = {
      email: this.email,
      provider: this.provider,
      token: twoStepFormValue,
    };

    this.authService
      .twoStepLogin('twostepverification', twoFactorDto)
      .subscribe({
        next: (res: AuthResponseDto) => {
          localStorage.setItem('token', res.token);
          this.authService.sendAuthStateChangeNotification(
            res.isAuthSuccessful
          );
          this.router.navigate([this.returnUrl]);
        },
        error: (err: HttpErrorResponse) => {
          this.errorMessage = err.message;
          this.showError = true;
        },
      });
  };
}
