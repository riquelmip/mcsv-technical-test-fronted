import { Component, OnInit } from '@angular/core';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { FooterComponent } from '../footer/footer.component';
import { Router, NavigationEnd, RouterOutlet } from '@angular/router';
import { SharedModule } from '../../shared.module';
import { initFlowbite } from 'flowbite';
import { HeaderComponent } from '../header/header.component';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [
    SidebarComponent,
    FooterComponent,
    RouterOutlet,
    SharedModule,
    HeaderComponent,
  ],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.css',
})
export default class LayoutComponent implements OnInit {
  // Inyección del Router para detectar cambios de ruta
  constructor(private router: Router) {}

  ngOnInit(): void {
    // Inicializa Flowbite en cada cambio de navegación
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        // Inicializa Flowbite después de que el DOM haya cambiado
        setTimeout(() => initFlowbite(), 0);
      }
    });
  }
}
