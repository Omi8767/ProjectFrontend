import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { API_BASE_URL } from '../../../services/api.config';
import Swal from 'sweetalert2';
import { CommonModule, UpperCasePipe } from '@angular/common';

import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

// Excel
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { Xliff } from '@angular/compiler';

@Component({
  selector: 'app-report',
  standalone: true,
  imports: [UpperCasePipe, CommonModule],
  templateUrl: './report.component.html',
  styleUrl: './report.component.css'
})
export class ReportComponent implements OnInit {

  type: string = '';
  data: any[] = [];
  columns: any[] = [];
  loading = false;

  constructor(private route: ActivatedRoute, private http: HttpClient) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(param => {
      this.type = param.get('type')!;
      this.loadData();
    })
  }

  loadData() {
    this.loading = true;

    let url = `${API_BASE_URL}/${this.type}`;

    this.http.get<any[]>(url).subscribe({
      next: res => {
        setTimeout(() => {
          this.data = res.map(item => {
            delete item.imageURL;
            delete item.createdAt;
            delete item.password;
            delete item.items;
            delete item.images;
            delete item.specifications;
            return item;
          });

          console.log(this.data);

          this.columns = this.data.length ? Object.keys(this.data[0]) : [];
          console.log(this.columns);
          this.loading = false;
          if (this.data.length === 0) {
            Swal.fire({
              icon: 'info',
              title: 'No Data Found',
              text: 'Try Differnt filters or report',
              timer: 1500,
              showConfirmButton: false
            });
          }

        }, 800);

      },
      error: err => {
        this.loading = false;
        console.error(err);
      }
    })
  }

  getValue(row: any, col: string): any {
    const value = row[col];

    if (value === null || value === undefined) return;

    if (col.toLocaleLowerCase().includes('date')) {
      return new Date(value).toLocaleDateString();
    }

    if (typeof value === 'object') {
      //prodcut nested obj
      if (value.categoryname) {
        return value.categoryname;
      }

      // customer object
      if (value.name && value.email) {
        return value.name;
      }

      // payment object
      if (value.paymentMethod) {
        return `${value.paymentMethod} (Rs.${value.netAmount})`;
      }

      // shipping object
      if (value.city && value.pinCode) {
        return `${value.name}, ${value.city}-${value.pinCode}`;
      }

      return JSON.stringify(value);
    }


    return value;

  }

  downloadPdf() {

    const doc = new jsPDF();

    doc.text(this.type.toUpperCase() + 'REPORT', 14, 10);

    autoTable(doc, {
      head: [this.columns],
      body: this.data.map(row =>
            this.columns.map(col =>this.getValue(row, col))
      ),
    });

    doc.save(this.type+'_report.pdf');

    Swal.fire({
              icon: 'success',
              title: 'PDF Downloaded',
              timer: 1500,
              showConfirmButton: false
            });

  }

  downloadExcel(){
    const formattedData = this.data.map(row=>{
      const obj : any={};
      this.columns.forEach(col=>{
        obj[col] = this.getValue(row,col);
      });
      return obj;
    });

    const workbook = XLSX.utils.book_new();
    const worksheet= XLSX.utils.json_to_sheet(formattedData);

    XLSX.utils.book_append_sheet(workbook,worksheet,'REPORT');

    const excelBuffer = XLSX.write(workbook,{
      bookType:'xlsx',
      type:'array'
    });

    const blob = new Blob([excelBuffer],{
      type:'applicatiom/octet-stream'
    });

    saveAs(blob,this.type+'_report.xlsx');
    Swal.fire({
              icon: 'success',
              title: 'Excel Downloaded',
              timer: 1500,
              showConfirmButton: false
            });

  }


}

