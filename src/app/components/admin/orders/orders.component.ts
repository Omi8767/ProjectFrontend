import { Component, OnInit } from '@angular/core';
import { OrderService } from '../../../services/order.service';
import Swal from 'sweetalert2';
import { CommonModule, JsonPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CommonModule,JsonPipe,FormsModule],
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.css'
})
export class OrdersComponent implements OnInit{
isLoading=false;
orders:any[]=[];

constructor(private orderService:OrderService){}

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(){
    this.isLoading = true;
    this.orderService.getAll().subscribe({
      next:(res)=>{
        setTimeout(() => {
          this.orders = res;          
         // console.log(res);
           this.orders.forEach(o => o.newStatus = o.status);
          this.isLoading=false;
        }, 800);
      },
      error:(err)=>{
        console.error(err);
        this.isLoading=false;
        Swal.fire('Error',err.message,'error');
      }
    })
  }

  updateStatus(order:any){
      this.orderService.updateOrderStatus(order.id,order.newStatus).subscribe({
        next:(res)=>{
          console.log(res);
          this.loadOrders();
           Swal.fire({
              icon: 'success',
              title: 'Order Processed!',
              text: 'The order is updated successfully!',
              timer:1500,
              showConfirmButton:false
            });
        },
        error:(err)=>{
          Swal.fire({
            icon:'error',
            title:'Error',
            text:err.error?.error || "Something went wrong!"
          });
        }
      })
  }


   getStatusClass(status: string): string {
  switch (status) {
    case 'IN_PROCESS': return 'bg-warning';
    case 'DISPATCH': return 'bg-info';
    case 'DELIVERED': return 'bg-success';
    case 'REJECT':
    case 'CANCELLED': return 'bg-danger';
    default: return 'bg-secondary';
  }
}

getStatusLabel(status: string): string {
  switch (status) {
    case 'IN_PROCESS': return 'Processing';
    case 'DISPATCH': return 'Dispatched';
    case 'DELIVERED': return 'Delivered';
    case 'REJECT': return 'Rejected';
    case 'CANCELLED': return 'Cancelled';
    default: return status;
  }
}


}
