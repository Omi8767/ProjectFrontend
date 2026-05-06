import { Component, OnInit } from '@angular/core';
import { OrderService } from '../../../services/order.service';
import { Customer } from '../../../services/customer-service.service';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';

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

  cancelOrder(orderId:number){
    Swal.fire({
    title: 'Cancel Order?',
    text: 'Are you sure you want to cancel this order?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText: 'Yes, cancel it',
    cancelButtonText: 'No'
  }).then((result) => {
    if (!result.isConfirmed) return;

    this.orderService.cancelOrder(orderId).subscribe({
      next: () => {

        Swal.fire({
          icon: 'success',
          title: 'Cancelled!',
          text: 'Your order has been cancelled.',
          timer: 2000,
          showConfirmButton: false
        });


        this.loadOrders(this.customer.id!);
      },

      error: err => {

        Swal.fire({
          icon: 'error',
          title: 'Failed!',
          text: err.error?.message || 'Error cancelling order'
        });
        console.error(err);

      }
    });

  });
  }

}
