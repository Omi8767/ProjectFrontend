import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [RouterLink,RouterOutlet,CommonModule],
  templateUrl: './admin-layout.component.html',
  styleUrl: './admin-layout.component.css'
})
export class AdminLayoutComponent {

  isReportOpen=false;

  constructor(private router:Router){}

  toggle()
  {
    this.isReportOpen = ! this.isReportOpen;
  }
logout(){
  localStorage.removeItem('admin');
  this.router.navigate(['/']);
}
}
