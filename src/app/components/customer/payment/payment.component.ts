import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CartService } from '../../../services/cart.service';
import { Router } from '@angular/router';
import { IPaymentDTO, PaymentService } from '../../../services/payment.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-payment',
  standalone: true,
  imports: [CommonModule,FormsModule,ReactiveFormsModule],
  templateUrl: './payment.component.html',
  styleUrl: './payment.component.css'
})
export class PaymentComponent implements OnInit {
  paymentForm!: FormGroup;
  submitting = false;
  successMessage = '';
  totalAmount = 0;
  netAmount = 0;
  gstPercent = 18;
  discountPercent = 5;
  orderId!: number;

  constructor(
    private fb: FormBuilder,
    private cartService: CartService,
    private router: Router,
    private paymentService:PaymentService
  ) {}

  ngOnInit() {
    // Get last order from localStorage
    const lastOrder = JSON.parse(localStorage.getItem('lastOrder') || '{}');
    if (!lastOrder?.id) {
      alert('No order found. Please place an order first.');
      this.router.navigate(['/customer/cart']);
      return;
    }

    this.orderId = lastOrder.id;
    this.totalAmount = lastOrder.totalAmount || 0;
    this.updateNetAmount();

    this.paymentForm = this.fb.group({
      paymentMethod: ['Card', Validators.required],
    });
  }

  updateNetAmount(){
    const gst = (this.totalAmount * this.gstPercent)/100;
    const discount= (gst * this.discountPercent)/100;

    this.netAmount = this.totalAmount + gst - discount;
  }

  makePayment(){
    this.submitting=true;
    if(this.paymentForm.invalid) return;

    const method = this.paymentForm.value.paymentMethod;

    if(method ==='COD'){
      const paymentData:IPaymentDTO={
         orderId: this.orderId,
      paymentDate: new Date().toISOString().split('T')[0],
      paymentMethod: 'COD',
      gstPercent: this.gstPercent,
      discountPercent: this.discountPercent,
      totalAmount: this.totalAmount,
      netAmount: this.netAmount,
      transactionRef: 'COD-' + Date.now()
      }

      this.paymentService.makePayment(paymentData).subscribe({
        next:()=>{
          this.successMessage = 'Order placed with Cash on delivery';
          localStorage.removeItem('lastOrder');
          this.submitting=false;
        },
        error:(err)=>{
          console.error(err);
          localStorage.removeItem('lastOrder');
          this.submitting=false;
        }
      });

    }
  }

}
