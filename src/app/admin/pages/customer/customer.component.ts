import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { initFlowbite } from 'flowbite';
import { environment } from '../../../../environments/environment';
import { UserService } from '../../../admin/services/user.service';
import { SharedService } from '../../../shared/services/shared.service';
import { CustomerService } from '../../../admin/services/customer.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { Router } from '@angular/router';
import {
  GetUserResponse,
  GetUserResponseData,
} from '../../../auth/interfaces/get-user.interface';
import {
  Customer,
  GetCustomerByIdResponse,
  GetCustomerByUserIdResponse,
  GetCustomerByUserIdResponseData,
} from '../../interfaces/customer.interfaces';
import { AddressPayload } from '../../interfaces/address.interface';
import { CommonModule } from '@angular/common';
import { OrderService } from '../../services/order.service';
import {
  GetOrdersByCustomerResponse,
  GetOrdersByCustomerResponseDaum,
  GetOrdersByCustomerResponseOrderDetail,
} from '../../interfaces/getOrders.interface';

@Component({
  selector: 'app-customer',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './customer.component.html',
  styleUrl: './customer.component.css',
})
export class CustomerComponent {
  private readonly baseUrl: string = environment.baseUrl;
  private userService = inject(UserService);
  private customerService = inject(CustomerService);
  private orderService = inject(OrderService);
  private sharedService = inject(SharedService);
  private loading = inject(NgxSpinnerService);
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private readonly lastRouteKey: string = environment.last_route;
  addressForm: FormGroup = this.fb.group({});
  userInfo: GetUserResponseData | null = null;
  customerInfo: GetCustomerByUserIdResponseData | any = null;
  ordersByCustomer: GetOrdersByCustomerResponseDaum[] = [];

  ngOnInit(): void {
    this.addressForm = this.fb.group({
      id: [0],
      street: ['', Validators.required],
      state: ['', Validators.required],
      city: ['', Validators.required],
      postalCode: ['', Validators.required],
      country: ['', Validators.required],
      status: ['', [Validators.required]],
    });

    initFlowbite();
    const username = localStorage.getItem('username') || '';
    console.log('username', username);
    this.getUser(username);
  }

  onCreateAddress(): void {
    if (this.addressForm.invalid || !this.customerInfo?.id) {
      this.sharedService.errorAlert(
        'Formulario inválido o cliente no encontrado'
      );
      return;
    }

    const form = this.addressForm.value;

    console.log('customerid', this.customerInfo.id);
    const payload: AddressPayload = {
      customerId: this.customerInfo.id,
      street: form.street,
      city: form.city,
      state: form.state,
      postalCode: form.postalCode,
      country: form.country,
      status: form.status,
    };
    console.log('payload', payload);
    this.loading.show();

    this.customerService.createAddress(payload).subscribe({
      next: (response) => {
        this.loading.hide();
        if (response.isSuccess) {
          this.sharedService.successAlert('Dirección creada correctamente');
          this.addressForm.reset();
          this.getCustomerByUserId(this.userInfo?.userId || 0);
          this.sharedService.closeModal('addAddressModal');
        } else {
          this.sharedService.errorAlert(response.message);
        }
      },
      error: (error) => {
        this.loading.hide();
        this.sharedService.errorAlert(error);
      },
    });
  }

  getOrderTotal(
    orderDetails: GetOrdersByCustomerResponseOrderDetail[]
  ): number {
    return orderDetails.reduce((total, item) => total + item.subtotal, 0);
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
        this.getOrdersByCustomerId(this.customerInfo.id);
        this.loading.hide();
      },
      error: (message: any) => {
        this.sharedService.errorAlert(message);
      },
    });
  }

  getOrdersByCustomerId(customerId: number): void {
    this.loading.show();
    this.orderService.getOrdersByCustomerId(customerId).subscribe({
      next: (response: GetOrdersByCustomerResponse) => {
        if (!response.isSuccess) {
          this.sharedService.errorAlert(response.message);
          return;
        }
        this.ordersByCustomer = response.data;
        console.log('ordersByCustomer', this.ordersByCustomer);
        this.loading.hide();
      },
      error: (message: any) => {
        this.sharedService.errorAlert(message);
      },
    });
  }
}
