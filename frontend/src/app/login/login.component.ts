import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { LoginService } from '../services/auth/login.service';
import { LoginRequest } from '../services/auth/login.request';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
  standalone: true,
  imports: [
    RouterModule,
    CommonModule,
    ReactiveFormsModule
  ]
})
export class LoginComponent {
  form: FormGroup;
  errorMessage: string | null = null;

  constructor(private formBuilder: FormBuilder, private router: Router, private loginService: LoginService) {
    this.form = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  onSubmit(event: Event) {
    event.preventDefault();
    this.errorMessage = null;
    
    if (this.form.valid) {
      const loginRequest: LoginRequest = {
        email: this.form.get('email')?.value,
        password: this.form.get('password')?.value
      };
      this.loginService.methodlogin(loginRequest).subscribe({
        next: (response) => {
          console.log(response);
          this.router.navigate(['/dashboard']);
        },
        error: (error) => {
          console.error(error);
          if (error.status === 401) {
            this.errorMessage = 'Correo o contraseña incorrectos';
          } else if (error.status === 500) {
            this.errorMessage = 'Error del servidor, intenta de nuevo más tarde';
          } else {
            this.errorMessage = 'Error en la autenticación, intente nuevamente';
          }
        }
      });
    } else {
      this.errorMessage = 'Completa el formulario correctamente';
      this.form.markAllAsTouched();
    }
  }
}