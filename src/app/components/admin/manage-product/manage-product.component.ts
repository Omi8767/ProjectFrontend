import { Component, OnInit } from '@angular/core';
import { IProduct, IProductDTO, ProductService } from '../../../services/product.service';
import { CategoryServiceService, ICategory } from '../../../services/category-service.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-manage-product',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './manage-product.component.html',
  styleUrl: './manage-product.component.css'
})
export class ManageProductComponent implements OnInit {
  products: IProduct[] = [];
  categories: ICategory[] = [];

  newProduct: any = this.getEmpatyProduct();
  imagePreview: string | null = null;

  isEdit = false;

  getEmpatyProduct() {
    return {
      name: '',
      price: 0,
      stock: 0,
      available: true,
      categoryId: 0,
      imageurls: [],
      specifications: []
    }
  }

  constructor(private categoryService: CategoryServiceService,
    private productService: ProductService
  ) { }

  ngOnInit(): void {
    this.loadCategories();
    this.loadProducts();
  }

  loadCategories() {
    this.categoryService.getAllCategories().subscribe({
      next: (res) => {
        console.log("Categories from api", res);
        this.categories = res;
      },
      error: (err) => {
        console.error("error while fetching categories", err);
      }
    })
  }

  loadProducts() {
    this.productService.getAll().subscribe({
      next: (res) => {
        console.log("Products from api", res);
        this.products = res;
      },
      error: (err) => {
        console.error("error while fetching products", err);
      }
    })
  }

  onImageSelected(event: any) {
    const files = event.target.files;

    this.newProduct.imageurls = [];
    this.imagePreview = null;

    if (!files.length) return

    Array.from(files).forEach((file: any) => {
      const reader = new FileReader();
      reader.onload = () => {
        this.newProduct.imageurls.push(reader.result as string);

        if (!this.imagePreview) {
          this.imagePreview = reader.result as string
        }
      };
      reader.readAsDataURL(file);
    });
  }

  addSpecification(){
    this.newProduct.specifications.push({name:'',value:''});
  }

  removeSpecification(index:number){
    this.newProduct.specifications.splice(index,1);
  }

  addProduct(){
    this.productService.add(this.newProduct).subscribe({
      next:()=>{
        alert('Product Saved');
        this.resetForm();
        this.loadProducts();
      },
      error:err => alert('Error '+ (err.error || err.message || JSON.stringify(err)))
    })
  }

  editProduct(p:IProduct){
    this.isEdit = true;

    this.newProduct={
      name:p.name,
      price:p.price,
      stock:p.stock,
      available:p.available,
      categoryId:p.category?.categoryid||0,
      imageurls:p.images?.[0]?.imageUrl || '',
      specifications:p.specifications || [],
      id:p.id      
    }
  }

  updateProduct(){
    if(!this.newProduct.id) return;

    this.productService.update(this.newProduct.id,this.newProduct).subscribe({
     next:()=>{
        alert('Product Update');
        this.resetForm();
        this.loadProducts();
      },
      error:err => alert('Error '+ (err.error || err.message || JSON.stringify(err)))
    })
  }

  deleteProduct(id:number){
    if(!confirm('Are you sure you want to delete this product?')) return;

    this.productService.delete(id).subscribe({
      next:()=>{
        alert('Product Deleted..');
        this.resetForm();
        this.loadProducts();
      },
      error:err => alert('Error '+ (err.error || err.message || JSON.stringify(err)))
    })
  }

  resetForm(){
    this.isEdit=false;
    this.newProduct = this.getEmpatyProduct();
    this.imagePreview=null;
  }

}
