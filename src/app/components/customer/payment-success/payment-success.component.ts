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

     if (sessionId) {
    this.paymentService.confirmPayment(sessionId).subscribe({
      next: (res) => {
        this.order = res;
        this.loading = false;
      },
      error: () => {
        alert('Payment Failed');
        this.router.navigate(['/customer/cart']);
      }
    });
  }

  //  COD flow (from localStorage)
  else {
    const data = localStorage.getItem('paymentData');

    if (!data) {
      alert('No payment data found');
      this.router.navigate(['/customer/cart']);
      return;
    }

    const paymentRes = JSON.parse(data);

    // IMPORTANT: extract order from response
    this.order = paymentRes.order;

    this.loading = false;

    // optional: clear after use
    localStorage.removeItem('paymentData');
  }

  }

  getTotal(): number {
    return this.order?.items?.reduce((sum: number, i: any) => sum + i.total, 0) || 0;
  }

  getGST(): number {
    return this.getTotal() * 0.18;
  }

  getDiscount(): number {
    return this.getTotal() * 0.05;
  }

  getNet(): number {
    return this.getTotal() + this.getGST() - this.getDiscount();
  }

  printInvoice() {
    window.print();
  }
  

}
