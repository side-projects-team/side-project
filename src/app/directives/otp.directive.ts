import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[appOtp]'
})
export class OtpDirective {
  @Input('appOtp') appOtp!: string;

  constructor() { }

  @HostListener('input', ['$event'])
  onInputChange = (event: any) => {
    const otpInput = event.target as HTMLInputElement;
    const otp = otpInput.value.replace(/\D/g, '')
    const length = otp.length;

    if(length > 0 && length < this.appOtp.length) {
      otpInput.value = otp.split('').map((digit, index) => {
        if(index === length - 1) return digit;
        
        return this.appOtp[index]
      }).join('');
    }
  }

}
