import { Component } from '@angular/core';
import { CustomerServiceService } from '../../../services/customer-service.service';
import Swal from 'sweetalert2';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-forget-password',
  standalone: true,
  imports: [FormsModule,CommonModule],
  templateUrl: './forget-password.component.html',
  styleUrl: './forget-password.component.css'
})
export class ForgetPasswordComponent {

  step=1;
  email='';
  otp=['','','','','',''];
  password='';
  confirmPassword='';

  isSending=false;
  isVerifyingOtp=false;
  isResetting=false;
  timer = 60;
  interval:any;


  constructor(private customerService:CustomerServiceService){

  }

  // STEP 1 → SEND OTP
  sendOtp() {
    this.isSending = true;

    this.customerService.sendOtp(this.email).subscribe({
      next: (res: any) => {
        setTimeout(() => {
          this.isSending = false;

        Swal.fire({
          icon: 'success',
          title: 'OTP Sent',
          text: res?.message || 'Check your email',
          timer: 1500,
          showConfirmButton: false
        });

        this.step = 2;
        this.startTimer();
        }, 800);
      },
      error: (err) => {
        this.isSending = false;

        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: err?.error?.message || 'Email not found'
        });
      }
    });
  }

    // STEP 2 → VERIFY OTP
  verifyOtp() {
    this.isVerifyingOtp = true;

    const otpValue = this.otp.join('');

    this.customerService.verifyOtp(this.email, otpValue).subscribe({
      next: (res: any) => {
        this.isVerifyingOtp = false;

        Swal.fire({
          icon: 'success',
          title: 'Verified',
          text: res?.message || 'OTP verified',
          timer: 1200,
          showConfirmButton: false
        });

        this.step = 3;
      },
      error: (err) => {
        this.isVerifyingOtp = false;

        Swal.fire({
          icon: 'error',
          title: 'Invalid OTP',
          text: err?.error?.message || 'Try again'
        });
      }
    });
  }

   // STEP 3 → RESET PASSWORD
  resetPassword() {
    this.isResetting = true;

    if (this.password !== this.confirmPassword) {
      this.isResetting = false;

      Swal.fire({
        icon: 'warning',
        title: 'Oops!',
        text: 'Passwords do not match'
      });
      return;
    }

    this.customerService.resetPassword(this.email, this.password).subscribe({
      next: (res: any) => {
        this.isResetting = false;

        Swal.fire({
          icon: 'success',
          title: 'Done ',
          text: res?.message || 'Password updated',
          confirmButtonText: 'Go to Login'
        }).then(() => {
          window.location.href = '/login';
        });

        this.step = 4;
      },
      error: (err) => {
        this.isResetting = false;

        Swal.fire({
          icon: 'error',
          title: 'Failed',
          text: err?.error?.message || 'Try again'
        });
      }
    });
  }
 // TIMER
  startTimer() {
    this.timer = 60;
    this.interval = setInterval(() => {
      this.timer--;
      if (this.timer === 0) clearInterval(this.interval);
    }, 1000);
  }

  resendOtp() {
    if (this.timer === 0) {
      this.sendOtp();
    }
  }

  // OTP INPUT AUTO MOVE
  moveNext(event: any, index: number) {

    const input = event.target as HTMLInputElement;

    input.value = input.value.replace(/[^0-9]/g, ''); // Allow only digits

    //save in particular index/textbox
    this.otp[index] = input.value;

    if(input.value && index < 5) {
      const next = document.getElementById('otp' + (index + 1));
      next?.focus();
    }

    if(input.value === '' && index > 0) {
      const prev = document.getElementById('otp' + (index - 1));
      prev?.focus();
    }

  }
}
