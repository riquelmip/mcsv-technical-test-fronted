import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SharedModule } from '../../shared.module';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { AuthService } from '../../../auth/services/auth.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, SharedModule, CommonModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css',
})
export class SidebarComponent implements OnInit {
  public role: string = '';
  private roleSubscription: Subscription = new Subscription();

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    // Suscribirse a los cambios en el rol
    this.roleSubscription = this.authService.role$.subscribe((role) => {
      this.role = role;
    });
  }

  ngOnDestroy(): void {
    // Limpiar la suscripción
    if (this.roleSubscription) {
      this.roleSubscription.unsubscribe();
    }
  }
}
