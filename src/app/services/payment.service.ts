import { Injectable } from '@angular/core';
import { API_BASE_URL } from './api.config';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


export interface IPaymentDTO {
  orderId: number;
  paymentDate: string;
  paymentMethod: string;
  gstPercent: number;
  discountPercent: number;
  totalAmount: number;
  netAmount: number;
  transactionRef: string;
}


@Injectable({
  providedIn: 'root'
})
export class PaymentService {

  private apiUrl = `${API_BASE_URL}/payments`
  constructor(private http:HttpClient) { }

  makePayment(payment:IPaymentDTO):Observable<any>{
    return  this.http.post(`${this.apiUrl}`,payment);
  }
}
