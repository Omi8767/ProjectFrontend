import { Component, OnInit } from '@angular/core';
import { OrderService } from '../../../services/order.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit{
  data:any={};
  
  constructor(private orderService:OrderService){}
  ngOnInit(): void {
    this.orderService.getDashboard().subscribe({
      next:res=>{
        setTimeout(() => {
          this.data=res;
          console.log(res);
        }, 800);
      },
      error:err=>{
        console.log(err);
      }
    })
  }


}
