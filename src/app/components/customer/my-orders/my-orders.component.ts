import { Component, OnInit } from '@angular/core';
import { OrderService } from '../../../services/order.service';
import { Customer } from '../../../services/customer-service.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-my-orders',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './my-orders.component.html',
  styleUrl: './my-orders.component.css'
})
export class MyOrdersComponent implements OnInit {

  customer!: Customer;
  orders: any[] = [];

  constructor(private orderService: OrderService) { }

  ngOnInit(): void {
    const store = localStorage.getItem('customer');
    this.customer = store ? JSON.parse(store) : null;

    if(!this.customer.id) return;

    this.loadOrders(this.customer.id);

  }

  loadOrders(customerId: number) {
    this.orderService.getOrderByCustomer(customerId).subscribe({
      next: (res) => {
        this.orders = res;
        console.log(res);
      },
      error: (err) => {
        console.log(err);
      }
    })
  }

}
