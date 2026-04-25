import { Injectable } from '@angular/core';
import { Customer } from './customer-service.service';
import { IProduct } from './product.service';
import { API_BASE_URL } from './api.config';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';

export interface ICartDTO{
  customerId:number;
  productId:number;
  quantity:number;
}

export interface ICart{
  id?:number;
  customer:Customer;
  product:IProduct;
  quantity:number;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private apiUrl =`${API_BASE_URL}/cart`

  constructor(private http:HttpClient) { }

  addToCart(dto:ICartDTO):Observable<ICart>{
   return this.http.post<ICart>(`${this.apiUrl}`,dto);
  }

  getCart(id:number):Observable<ICart[]>{
    return this.http.get<ICart[]>(`${this.apiUrl}/${id}`);
  }

  getTotal(items?:ICart[]):number{
    if(!items) return 0;
    return items.reduce((sum,it)=>sum+(it.product?.price ??0)*(it.quantity ?? 0),0);
  }

  getCartWithTotal(id:number):Observable<{items:ICart[];total:number}>{
   return this.getCart(id).pipe(map(items=>({items,total:this.getTotal(items)})));
  }
}
