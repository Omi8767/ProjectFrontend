import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PaymentService } from '../../../services/payment.service';
import { CommonModule, JsonPipe } from '@angular/common';

@Component({
  selector: 'app-payment-success',
  standalone: true,
  imports: [CommonModule,JsonPipe],
  templateUrl: './payment-success.component.html',
  styleUrl: './payment-success.component.css'
})
export class PaymentSuccessComponent implements OnInit {

  order:any;
  loading=true;

  constructor(private route : ActivatedRoute,
    private router: Router,
    private paymentService:PaymentService
  ){}

  ngOnInit(): void {
   const sessionId = this.route.snapshot.queryParamMap.get('session_id');

   if(!sessionId){
      this.router.navigate(['/customer/cart']);
      return
   }

   this.paymentService.confirmPayment(sessionId).subscribe({
        next:(res)=>{
          this.order = res;
          this.loading = false;
        },
        error:(err)=>{
          console.error(err);
          this.router.navigate(['/customer/cart']);
        }
   })

  }
  

}
