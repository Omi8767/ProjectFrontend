import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CustomerServiceService, ILogin } from '../../../services/customer-service.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterLink, FormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  loginRequest: ILogin = {
    email: '',
    password: ''
  }
  error = '';



  constructor(private service: CustomerServiceService, private router: Router) { }

  login() {
    this.service.login(this.loginRequest).subscribe({
      next: (res: any) => {
        alert('login successful');
        localStorage.setItem('customer', JSON.stringify(res));
        this.router.navigate(['/customer/home']);

      },
      error: (err) => {
        alert('login failed: ' + err.message || err.error);
      }
    })
  }
}
