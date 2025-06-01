import { Injectable } from '@angular/core';
import axios from 'axios';
import { Observable, from, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { GetAllUsersGeneralResponse } from '../interfaces/get-all-users.interface';
import { CreateUserGeneralResponse } from '../interfaces/create-user.interface';
import { GetUserResponse } from '../../auth/interfaces/get-user.interface';
import {
  AddressPayload,
  CreateAddressResponse,
} from '../interfaces/address.interface';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly baseUrl: string = environment.baseUrl;

  constructor() {}

  getUsers(): Observable<GetAllUsersGeneralResponse> {
    const url = `${this.baseUrl}/mcsv-auth/users/get-all`;
    const token = localStorage.getItem('token') || '';

    const headers = {
      Authorization: `Bearer ${token}`,
    };

    return from(
      axios.post<GetAllUsersGeneralResponse>(url, {}, { headers })
    ).pipe(
      map((response) => response.data),
      catchError((error) => {
        return throwError(
          () => error.response?.data.message || 'Error desconocido'
        );
      })
    );
  }

  createUserAuth(
    username: string,
    password: string,
    name: string,
    email: string
  ): Observable<CreateUserGeneralResponse> {
    const url = `${this.baseUrl}/mcsv-auth/auth/create-user`;
    const token = localStorage.getItem('token') || '';

    return from(
      axios.post(
        url,
        {
          username,
          password,
          name,
          email,
          roles: {
            list: ['USER'],
          },
        },
        {}
      )
    ).pipe(
      map((response) => response.data),
      catchError((error) => {
        return throwError(
          () => error.response?.data.message || 'Error desconocido'
        );
      })
    );
  }

  getUser(username: string): Observable<GetUserResponse> {
    const url = `${this.baseUrl}/mcsv-auth/users/get-by-username`;
    const token = localStorage.getItem('token') || '';
    // mandar el usuario por form data
    const body = new FormData();
    body.append('username', username);

    const headers = {
      Authorization: `Bearer ${token}`,
    };

    return from(axios.post<GetUserResponse>(url, body, { headers })).pipe(
      map((response) => response.data),
      catchError((error) => {
        return throwError(
          () => error.response?.data.message || 'Error desconocido'
        );
      })
    );
  }
}
