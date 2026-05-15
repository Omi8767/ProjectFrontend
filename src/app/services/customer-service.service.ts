import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { API_BASE_URL } from './api.config';
import { Observable } from 'rxjs';

export interface Customer {
  id?: number;
  name: string;
  email: string;
  contact: number;
  address:string;
  city:string;
  password:string;
}

export interface ILogin{
  email: string;
  password:string;
}

@Injectable({
  providedIn: 'root'
})
export class CustomerServiceService {
private apiUrl = `${API_BASE_URL}/customers`
  constructor(private http: HttpClient) { }

  register(customer: Customer):Observable<Customer> {
    return this.http.post<Customer>(`${this.apiUrl}/register`, customer);
  }

  login(request:ILogin):Observable<Customer>{
    return this.http.post<Customer>(`${this.apiUrl}/login`,request)
  }

  sendOtp(email:string){
    return this.http.post(`${this.apiUrl}/send-otp?email=${email}`,{});
  }

  verifyOtp(email:string,otp:string){
     return this.http.post(`${this.apiUrl}/verify-otp?email=${email}&otp=${otp}`,{});
  }

  resetPassword(email:string,password:string){
    return this.http.post(`${this.apiUrl}/reset-password?email=${email}&password=${password}`,{});
  }

}
