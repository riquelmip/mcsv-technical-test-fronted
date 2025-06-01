// src/app/shared/services/cart.service.ts
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private getStorageKey(username: string): string {
    return `cart_${username}`;
  }

  getCart(username: string): { id: number; quantity: number }[] {
    const key = this.getStorageKey(username);
    const cartJson = localStorage.getItem(key);
    return cartJson ? JSON.parse(cartJson) : [];
  }

  addToCart(username: string, productId: number): void {
    const key = this.getStorageKey(username);
    const cart = this.getCart(username);
    const existing = cart.find((item) => item.id === productId);

    if (existing) {
      existing.quantity += 1;
    } else {
      cart.push({ id: productId, quantity: 1 });
    }

    localStorage.setItem(key, JSON.stringify(cart));
  }

  removeFromCart(username: string, productId: number): void {
    const key = this.getStorageKey(username);
    const cart = this.getCart(username).filter((item) => item.id !== productId);
    localStorage.setItem(key, JSON.stringify(cart));
  }

  clearCart(username: string): void {
    const key = this.getStorageKey(username);
    localStorage.removeItem(key);
  }

  updateItem(username: string, productId: number, quantity: number): void {
    const key = this.getStorageKey(username);
    const cart = this.getCart(username);
    const itemIndex = cart.findIndex((item) => item.id === productId);

    if (itemIndex !== -1) {
      cart[itemIndex].quantity = quantity;
      localStorage.setItem(key, JSON.stringify(cart));
    }
  }
}
