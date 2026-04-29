import { Injectable } from '@angular/core';
import { API_BASE_URL } from './api.config';
import { HttpClient } from '@angular/common/http';
import { ICart } from './cart.service';
import { Observable } from 'rxjs';
import { Customer } from './customer-service.service';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private apiUrl = `${API_BASE_URL}/orders`;
  customer!: Customer;
  constructor(private http: HttpClient) { }

  placeOrder(
    cartItems: ICart[],
    shipping: {
      name: string,
      address: string,
      city: string,
      pinCode: string,
      contact: string
    },
    gstPercent = 0,
    discountPercent = 0
  ): Observable<any> {

    const items = cartItems.map(i => ({
      productId: i.product.id,
      quantity: i.quantity
    }));

    const store = localStorage.getItem('customer');
    this.customer = store ? JSON.parse(store) : null;

    const orderRequest={
      customerId:this.customer.id,
      shipping,
      items,
      gstPercent,
      discountPercent
    }

    return this.http.post(`${this.apiUrl}`,orderRequest);

  }
}
