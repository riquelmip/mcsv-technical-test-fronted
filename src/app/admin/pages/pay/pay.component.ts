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
import {
  GetUserResponse,
  GetUserResponseData,
} from '../../../auth/interfaces/get-user.interface';
import {
  GetCustomerByUserIdResponse,
  GetCustomerByUserIdResponseData,
} from '../../interfaces/customer.interfaces';
import { UserService } from '../../services/user.service';
import { CustomerService } from '../../services/customer.service';
import { OrderPayload } from '../../interfaces/order.interface';
import { OrderService } from '../../services/order.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-pay',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './pay.component.html',
  styleUrl: './pay.component.css',
})
export class PayComponent {
  private readonly baseUrl: string = environment.baseUrl;
  private productoService = inject(ProductService);
  private userService = inject(UserService);
  private customerService = inject(CustomerService);
  private orderService = inject(OrderService);
  private cartService = inject(CartService);
  private sharedService = inject(SharedService);
  private loading = inject(NgxSpinnerService);
  private router = inject(Router);
  private readonly lastRouteKey: string = environment.last_route;
  selectedSortOption: string = '';
  products: GetAllProductsResponseData[] = [];
  cartItems: { product: GetAllProductsResponseData; quantity: number }[] = [];
  username: string = this.sharedService.getUsernameFromLocalStorage() || '';
  userInfo: GetUserResponseData | null = null;
  customerInfo: GetCustomerByUserIdResponseData | any = null;
  selectedAddressId: number | null = null;
  ngOnInit(): void {
    initFlowbite();
    this.getCart();
    this.getUser(this.username);
  }

  getUser(username: string): void {
    this.loading.show();
    this.userService.getUser(username).subscribe({
      next: (response: GetUserResponse) => {
        if (!response.isSuccess) {
          this.sharedService.errorAlert(response.message);
          return;
        }
        console.log('response user', response);
        this.userInfo = response.data;
        this.getCustomerByUserId(this.userInfo?.userId || 0);
        this.loading.hide();
      },
      error: (message: any) => {
        this.sharedService.errorAlert(message);
      },
    });
  }

  getCustomerByUserId(userId: number): void {
    console.log('userId', userId);
    this.loading.show();
    this.customerService.getCustomerByUserId(userId).subscribe({
      next: (response: GetCustomerByUserIdResponse) => {
        if (!response.isSuccess) {
          this.sharedService.errorAlert(response.message);
          return;
        }
        console.log('response customer', response);
        this.customerInfo = response.data;
        this.loading.hide();
      },
      error: (message: any) => {
        this.sharedService.errorAlert(message);
      },
    });
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

  getTotal(): number {
    return this.cartItems.reduce((total, item) => {
      return total + item.product.price * item.quantity;
    }, 0);
  }
  goToPay(): void {
    // Verificar si el carrito está vacío
    if (this.cartItems.length === 0) {
      this.sharedService.errorAlert(
        'El carrito está vacío. Por favor, agrega productos antes de pagar.'
      );
      return;
    }

    // Verificar si el usuario ha iniciado sesión
    if (!this.username || this.username.trim() === '') {
      this.sharedService.errorAlert(
        'Por favor, inicia sesión para proceder al pago.'
      );
      return;
    }

    // Verificar si se tiene customer y dirección
    const customerId = this.customerInfo?.id;
    if (!customerId) {
      this.sharedService.errorAlert(
        'Información del cliente no disponible. Por favor, completa tu perfil.'
      );
      return;
    }

    const deliveryAddressId = this.selectedAddressId;
    if (deliveryAddressId === null) {
      this.sharedService.errorAlert(
        'Por favor, selecciona una dirección de entrega.'
      );
      return;
    }

    // Construir detalles del pedido
    const orderDetails = this.cartItems.map((item) => {
      const unitPrice = item.product.price;
      const quantity = item.quantity;
      const subtotal = unitPrice * quantity;

      return {
        productId: item.product.id,
        productName: item.product.title,
        unitPrice: unitPrice,
        quantity: quantity,
        subtotal: subtotal,
      };
    });

    const payload: OrderPayload = {
      customerId,
      deliveryAddressId,
      orderDetails,
    };

    this.loading.show();

    this.orderService.createOrder(payload).subscribe({
      next: (response) => {
        if (response.isSuccess) {
          const orderId = response.data.id;
          this.sharedService.successAlert('Orden creada exitosamente.');

          // Limpiar carrito
          this.cartService.clearCart(this.username);
          this.sharedService.updateCartCount(0);
          console.log('Orden creada:', response.data);

          // Proceder con el pago
          this.orderService.payOrder(orderId).subscribe({
            next: (payResponse) => {
              this.loading.hide();

              if (payResponse.isSuccess) {
                this.sharedService.successAlert(
                  `Pago realizado exitosamente. Monto: $${payResponse.data.amount}`
                );
                this.router.navigate(['/admin/home']);
              } else {
                this.sharedService.errorAlert(
                  payResponse.message || 'No se pudo procesar el pago.'
                );
              }
            },
            error: (payError) => {
              this.loading.hide();
              this.sharedService.errorAlert(
                payError || 'Error al procesar el pago.'
              );
            },
          });
        } else {
          this.loading.hide();
          this.sharedService.errorAlert(
            response.message || 'No se pudo crear la orden.'
          );
        }
      },
      error: (error) => {
        this.loading.hide();
        this.sharedService.errorAlert(error || 'Error al crear la orden.');
      },
    });
  }
}
