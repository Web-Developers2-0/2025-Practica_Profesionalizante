import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { LoginService } from '../services/auth/login.service';
import { Subscription } from 'rxjs';
import {
  NotificationsService,
  Notificacion,
} from '../services/notifications/notifications.service';

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './notifications.component.html',
  styleUrl: './notifications.component.css',
})
export class NotificationsComponent implements OnInit, OnDestroy {
  notificaciones: Notificacion[] = [];
  mostrarLista = false;
  isLoggedIn = false;
  private loginSub: Subscription | undefined;

  constructor(
    private http: HttpClient,
    private loginService: LoginService,
    private notificationsService: NotificationsService
  ) {}

  ngOnInit(): void {
    this.loginSub = this.loginService.userLogin.subscribe((status) => {
      this.isLoggedIn = status;

      if (this.isLoggedIn) {
        this.cargarNotificaciones();
      }
    });
  }

  toggleLista() {
    this.mostrarLista = !this.mostrarLista;
  }
  cargarNotificaciones(): void {
    this.notificationsService.getNotificaciones().subscribe({
      next: (data: Notificacion[]) => (this.notificaciones = data),
      error: (err) =>
        console.error('Error al obtener notificaciones desde el servicio', err),
    });
  }

  get cantidadNoLeidas(): number {
    return this.notificaciones.filter((n) => !n.leida).length;
  }

  //  get cantidadNoLeidas(): number {
  //   return this.notificaciones.filter((n) => !n.leida).length;
  // }

  ngOnDestroy(): void {
    this.loginSub?.unsubscribe();
  }
}
