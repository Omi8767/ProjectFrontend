import { Routes } from '@angular/router';
import { UserLayoutComponent } from './layouts/user-layout/user-layout.component';
import { CustomerLayoutComponent } from './layouts/customer-layout/customer-layout.component';
import { customerAuthGuard } from './guards/customer-auth.guard';
import { AdminLoginComponent } from './components/admin/admin-login/admin-login.component';
import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';
import { adminAuthGuard } from './guards/admin-auth.guard';
import { ManageProductComponent } from './components/admin/manage-product/manage-product.component';

export const routes: Routes = [
  {
    path: '',
    component: UserLayoutComponent,
    children: [
      { path: '', loadComponent: () => import('./components/user/home/home.component').then(m => m.HomeComponent) },
      { path: 'enquiry', loadComponent: () => import('./components/user/enquiry/enquiry.component').then(n => n.EnquiryComponent) },
      { path: 'signUp', loadComponent: () => import('./components/user/customer/customer.component').then(m => m.CustomerComponent) },
      { path: 'login', loadComponent: () => import('./components/user/login/login.component').then(m => m.LoginComponent) },
      { path: 'products', loadComponent: () => import('./components/user/product-list/product-list.component').then(m => m.ProductListComponent) },
      { path: 'product/:id', loadComponent: () => import('./components/user/product-details/product-details.component').then(m => m.ProductDetailsComponent) },

    ]
  },
  {
    path: 'customer',
    component: CustomerLayoutComponent,
    canActivate: [customerAuthGuard],
    children: [
      { path: 'home', loadComponent: () => import('./components/customer/home/home.component').then(m => m.HomeComponent) },
      { path: 'feedback', loadComponent: () => import('./components/customer/feedback/feedback.component').then(m => m.FeedbackComponent) },
      { path: 'products', loadComponent: () => import('./components/customer/product-list/product-list.component').then(m => m.ProductListComponent) },
      { path: 'product/:id', loadComponent: () => import('./components/customer/product-details/product-details.component').then(m => m.ProductDetailsComponent) },
      { path: 'cart', loadComponent: () => import('./components/customer/cart/cart.component').then(m => m.CartComponent) },

    ]
  },
  {
    path: 'admin/login',
    component: AdminLoginComponent
  },
  {
    path: 'admin',
    component: AdminLayoutComponent,
    canActivate: [adminAuthGuard],
    children: [
      { path: 'dashboard', loadComponent: () => import('./components/admin/dashboard/dashboard.component').then(m => m.DashboardComponent) },
      { path: 'categories', loadComponent: () => import('./components/admin/category/category.component').then(m => m.CategoryComponent) },
      { path: 'products', loadComponent: () => import('./components/admin/manage-product/manage-product.component').then(m => m.ManageProductComponent) },
    ]
  }
];
