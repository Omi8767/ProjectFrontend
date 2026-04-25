import { Component, OnInit } from '@angular/core';
import { CartService, ICart } from '../../../services/cart.service';
import { Customer } from '../../../services/customer-service.service';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule,CurrencyPipe,FormsModule],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css'
})
export class CartComponent implements OnInit {

  cartItems:ICart[] =[];
  total:number =0;
  loading=true;
  customer!:Customer;

  constructor(private cartService:CartService){}

  ngOnInit(): void {
     const store = localStorage.getItem('customer');
    this.customer = store ? JSON.parse(store) : null;
    
    if(!this.customer.id) return;

    this.loadCart(this.customer.id);
  }

  loadCart(customeraId:number){
    this.cartService.getCartWithTotal(customeraId).subscribe({
      next:({items,total})=>{
        this.loading=false;
        this.cartItems=items
        console.log(items);
        this.total = total;
        console.log(total)
      },
      error:(err)=>{
        console.error(err);
      }
    })
  }

  getImage(item:ICart): string{
    const img = item.product?.images?.[0].imageUrl;
    return img;
  }


}
