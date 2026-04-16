import { Injectable } from '@angular/core';
import { API_BASE_URL } from './api.config';
import { HttpClient } from '@angular/common/http';
import { ICategory } from './category-service.service';
import { Observable } from 'rxjs';

export interface ISpecificationDTO{
  name:string;
  value:string;
}

export interface IProductDTO{
  name:string;
  price:number;
  stock:number;
  available?:boolean;
  categoryId:number;
  imageurls:string[];
  specifications:ISpecificationDTO[];
}

export interface IProductImage{
  imageUrl:string;
  isPrimary:boolean;
}

export interface IProduct{
  id?:number;
  name:string;
  price:number;
  stock:number;
  available?:boolean;
  category:ICategory;
  images:IProductImage[];
  specifications:ISpecificationDTO[];
}

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private apiUrl=`${API_BASE_URL}/products`
  constructor(private http:HttpClient) { }

  add(product:IProductDTO):Observable<IProduct>{
    return this.http.post<IProduct>(this.apiUrl,product);
  }

  getAll():Observable<IProduct[]>{
    return this.http.get<IProduct[]>(this.apiUrl);
  }

  getById(id:number):Observable<IProduct>{
    return this.http.get<IProduct>(`${this.apiUrl}/${id}`);
  }

  update(id:number,product:IProductDTO):Observable<IProduct>{
   return this.http.put<IProduct>(`${this.apiUrl}/${id}`,product);
  }

  delete(id:number):Observable<any>{
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }
}
