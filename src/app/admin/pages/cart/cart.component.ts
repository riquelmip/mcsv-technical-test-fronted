import { Component, inject } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { environment } from '../../../../environments/environment';
import { CartService } from '../../services/cart.service';
import { SharedService } from '../../../shared/services/shared.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { Router } from '@angular/router';
import {
  GetAllProductsResponse,
  GetAllProductsResponseData,
} from '../../interfaces/products.interface';
import { initFlowbite } from 'flowbite';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css',
})
export class CartComponent {
  private readonly baseUrl: string = environment.baseUrl;
  private productoService = inject(ProductService);
  private cartService = inject(CartService);
  private sharedService = inject(SharedService);
  private loading = inject(NgxSpinnerService);
  private router = inject(Router);
  private readonly lastRouteKey: string = environment.last_route;
  selectedSortOption: string = '';
  products: GetAllProductsResponseData[] = [];
  cartItems: { product: GetAllProductsResponseData; quantity: number }[] = [];
  username: string = this.sharedService.getUsernameFromLocalStorage() || '';

  ngOnInit(): void {
    initFlowbite();
    this.getCart();
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
  getCart(): void {
    const username = this.sharedService.getUsernameFromLocalStorage();
    if (!username || username.trim() === '') {
      this.sharedService.errorAlert(
        'Por favor, inicia sesión para ver el carrito.'
      );
      return;
    }

    this.loading.show();
    const cart = this.cartService.getCart(username);

    if (!cart || cart.length === 0) {
      this.sharedService.errorAlert('El carrito está vacío.');
      this.loading.hide();
      return;
    }

    // Obtener todos los productos para hacer match por ID
    this.productoService.getAllProducts().subscribe({
      next: (response: GetAllProductsResponse) => {
        if (!response.isSuccess) {
          this.sharedService.errorAlert(response.message);
          this.loading.hide();
          return;
        }

        const allProducts = response.data;

        // Cruzar los productos con el carrito
        this.cartItems = cart
          .map((item) => {
            const product = allProducts.find((p) => p.id === item.id);
            if (product) {
              return {
                product,
                quantity: item.quantity,
              };
            }
            return null;
          })
          .filter((item) => item !== null) as {
          product: GetAllProductsResponseData;
          quantity: number;
        }[];

        this.loading.hide();
      },
      error: (err: any) => {
        this.sharedService.errorAlert(err);
        this.loading.hide();
      },
    });
  }

  increaseQuantity(item: {
    product: GetAllProductsResponseData;
    quantity: number;
  }) {
    item.quantity++;
    this.cartService.updateItem(this.username, item.product.id, item.quantity);
  }

  decreaseQuantity(item: {
    product: GetAllProductsResponseData;
    quantity: number;
  }) {
    if (item.quantity > 1) {
      item.quantity--;
      this.cartService.updateItem(
        this.username,
        item.product.id,
        item.quantity
      );
    }
  }

  getTotal(): number {
    return this.cartItems.reduce((total, item) => {
      return total + item.product.price * item.quantity;
    }, 0);
  }

  goToCheckout(): void {
    this.router.navigate(['/admin/pay']);
  }

  removeItem(item: {
    product: GetAllProductsResponseData;
    quantity: number;
  }): void {
    const username = this.sharedService.getUsernameFromLocalStorage();
    if (!username) {
      this.sharedService.errorAlert(
        'Por favor, inicia sesión para modificar el carrito.'
      );
      return;
    }

    this.cartService.removeFromCart(username, item.product.id);
    this.cartItems = this.cartItems.filter(
      (ci) => ci.product.id !== item.product.id
    );
    this.sharedService.updateCartCount(
      this.cartService.getCart(this.sharedService.getUsernameFromLocalStorage())
        .length
    );
  }
}
