import { Component } from '@angular/core';
import { IProduct, ProductService } from '../../../services/product.service';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CartService, ICartDTO } from '../../../services/cart.service';
import { Customer } from '../../../services/customer-service.service';

@Component({
  selector: 'app-product-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.css'
})
export class ProductDetailsComponent {

  
    product!:IProduct;
    selectedImage:string | null = null;
    customer!:Customer;
    customerId:any;
    cartDTO:ICartDTO={customerId:0,productId:0,quantity:0};
  
    constructor(
      private route:ActivatedRoute,
      private productService:ProductService,
      private cartService:CartService
    ) { }
  
    ngOnInit(): void {
      const id = this.route.snapshot.paramMap.get('id');
      if(id) this.loadProduct(+id);  
      
       const store = localStorage.getItem('customer');
    this.customer = store ? JSON.parse(store) : null;
    this.customerId = this.customer.id;
   
    console.log(this.customerId);
    }
  
    loadProduct(id:number){
      this.productService.getById(id).subscribe({
        next:(res)=>{
          this.product = res;
          console.log(res);
        },
        error:(err)=>{
          console.error(err);
        }
      })
    }
  
    getProductImage():string{
      return this.product?.images?.[0].imageUrl;
    }
  
    selectImage(img:string){
        this.selectedImage = img;
    }

    addToCart(){
      if(!this.customer.id) return;
      if(!this.product.id) return;

      this.cartDTO.customerId = this.customerId;
      this.cartDTO.productId = this.product.id;
      this.cartDTO.quantity = 1;

      this.cartService.addToCart(this.cartDTO).subscribe({
        next:(res)=>{
          alert('product added cart');
          console.log(res);
        },
        error:(err)=>{
          console.error(err);
        }
      })

    }
  

}
