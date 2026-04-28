import { Component, OnInit } from '@angular/core';
import { CartService, ICart, ICartDTO } from '../../../services/cart.service';
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

  updateCartDTO:ICartDTO={customerId:0,productId:0,quantity:0};

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

  removeItem(item:ICart){
    if(!item.id) return;    

    this.cartService.removeFromCart(item.id).subscribe({
      next:()=>{
        if(!this.customer.id) return;
        this.cartItems = this.cartItems.filter(i=>i.id !== item.id);
        this.total = this.cartService.getTotal(this.cartItems);
      },
      error:(err)=>{
       console.error(err);
      }
    })
  }

  updateQuantity(item:ICart,change:number){
    const newQty = item.quantity + change;
    if(newQty <=0){
      this.removeItem(item);
      return;
    }

    item.quantity = newQty;

    if(!this.customer.id || !item.product.id || !item.id) return;

    this.updateCartDTO.customerId = this.customer.id;
    this.updateCartDTO.productId = item.product.id;
    this.updateCartDTO.quantity = item.quantity;

    this.cartService.updateCartItem(this.updateCartDTO,item.id).subscribe({
      next:(res)=>{
        item.quantity = res.quantity;
        this.total = this.cartService.getTotal(this.cartItems);
      },
      error:(err)=>{
        console.error(err);
      }
    })
  }

  clearCart(){
    if(!this.customer.id) return;

    this.cartService.clearCart(this.customer.id).subscribe({
      next:(res)=>{
        this.cartItems = [];
        this.total = 0;
      },
      error:(err)=>{
        console.error(err);
      }
    })
  }


}
