import { Component, OnInit } from '@angular/core';
import { IProduct, ProductService } from '../../../services/product.service';
import { CommonModule, CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule,CurrencyPipe],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.css'
})
export class ProductListComponent implements OnInit {

  productList: IProduct[] = [];

  constructor(private productService:ProductService){}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(){
    
    this.productService.getAll().subscribe({
      next:(res)=>{
        debugger;
        this.productList = res;
        console.log(res);
      },
      error:(err)=>{
        console.error(err);
      }
    })
  }

}
