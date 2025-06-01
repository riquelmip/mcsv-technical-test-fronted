import { Component, inject, Input } from '@angular/core';
import { GetAllProductsResponseData } from '../../interfaces/products.interface';
import { CommonModule } from '@angular/common';
import { CartService } from '../../services/cart.service';
import { SharedService } from '../../../shared/services/shared.service';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.css',
})
export class ProductCardComponent {
  private cartService = inject(CartService);
  private sharedService = inject(SharedService);
  public Math = Math;
  username: string = this.sharedService.getUsernameFromLocalStorage() || '';
  @Input() product!: GetAllProductsResponseData;

  ngOnInit(): void {}

  getCategoryColor(category: string): string {
    switch (category.toLowerCase()) {
      case "men's clothing":
        return 'bg-blue-100 text-blue-800';
      case "women's clothing":
        return 'bg-pink-100 text-pink-800';
      case 'jewelery':
        return 'bg-yellow-100 text-yellow-800';
      case 'electronics':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }

  addToCart(): void {
    if (!this.username || this.username.trim() === '') {
      alert('Por favor, inicia sesión para agregar productos al carrito.');
      return;
    }
    this.cartService.addToCart(this.username, this.product.id);
    this.sharedService.updateCartCount(
      this.cartService.getCart(this.username).length
    );

    console.log(
      `Producto con ID ${this.product.id} agregado al carrito de ${this.username}`
    );
    console.log(`Carrito actual:`, this.cartService.getCart(this.username));
    // Mostrar un mensaje de éxito al usuario
    this.sharedService.successAlert('Producto agregado al carrito');
  }
}
