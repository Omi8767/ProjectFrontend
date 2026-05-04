import { Component } from '@angular/core';
import { Enquiry, EnquiryserviceService } from '../../../services/enquiryservice.service';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-enquiry',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, FormsModule],
  templateUrl: './enquiry.component.html',
  styleUrl: './enquiry.component.css'
})
export class EnquiryComponent {

  enquiries: FormGroup = new FormGroup({
    name: new FormControl(''),
    email: new FormControl(''),
    contact: new FormControl(''),
    subject: new FormControl(''),
    message: new FormControl('')
  });

  constructor(private enquiryService: EnquiryserviceService) {

  }

  save() {
    if (this.enquiries.invalid) {
      Swal.fire({
        icon: 'warning',
        title: 'Invalid Form',
        text: 'Please fill all required fileds',
      });
      return;
    }

     Swal.fire({
        title: 'Submitting....',
        text: 'Please wait',
        allowOutsideClick:false,
        didOpen:()=>{
          Swal.isLoading();
        }
      });

    this.enquiryService.submitEnquiry(this.enquiries.value).subscribe({
      next: () => {
        console.log("Enquiry Submitted...");
        Swal.fire({
          icon: 'success',
          title: 'Enquiry Send!',
          text: 'We will get back to you soon..!',
          confirmButtonColor:'#3085d6'
        });
      },
      error: (err) => {
        console.log(err);
        Swal.fire({
          toast:true,
          position:'top-end',
        // icon: 'error',
        title: 'Oops..',
        showCancelButton:false,
        showCloseButton:false,
        text: 'Something went wrong please try again later',
        timer:2000
      });
      }
    })
  }

}
