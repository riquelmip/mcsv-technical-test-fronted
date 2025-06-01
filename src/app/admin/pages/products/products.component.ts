import { Component, inject } from '@angular/core';
import {
  GetAllProductsResponse,
  GetAllProductsResponseData,
} from '../../interfaces/products.interface';
import { initFlowbite } from 'flowbite';
import { ProductService } from '../../services/product.service';
import { environment } from '../../../../environments/environment';
import { SharedService } from '../../../shared/services/shared.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { Router } from '@angular/router';
import { ProductCardComponent } from '../../components/product-card/product-card.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [ProductCardComponent, CommonModule, FormsModule],
  templateUrl: './products.component.html',
  styleUrl: './products.component.css',
})
export class ProductsComponent {
  private readonly baseUrl: string = environment.baseUrl;
  private productoService = inject(ProductService);
  private cartService = inject(CartService);
  private sharedService = inject(SharedService);
  private loading = inject(NgxSpinnerService);
  private router = inject(Router);
  private readonly lastRouteKey: string = environment.last_route;
  selectedSortOption: string = '';
  products: GetAllProductsResponseData[] = [];

  ngOnInit(): void {
    initFlowbite();
    this.getProducts();
    this.sharedService.updateCartCount(
      this.cartService.getCart(this.sharedService.getUsernameFromLocalStorage())
        .length
    );
  }

  sortProducts(): void {
    switch (this.selectedSortOption) {
      case 'price-asc':
        this.products.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        this.products.sort((a, b) => b.price - a.price);
        break;
      case 'title-asc':
        this.products.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'title-desc':
        this.products.sort((a, b) => b.title.localeCompare(a.title));
        break;
      default:
        this.getProducts(); // Reset to original order if no valid option is selected
        break;
    }
  }

  getProducts(): void {
    this.loading.show();
    this.productoService.getAllProducts().subscribe({
      next: (response: GetAllProductsResponse) => {
        if (!response.isSuccess) {
          this.sharedService.errorAlert(response.message);
          return;
        }
        console.log('products', response.data);
        this.products = response.data;
        this.loading.hide();
      },
      error: (message: any) => {
        this.sharedService.errorAlert(message);
      },
    });
  }
}
