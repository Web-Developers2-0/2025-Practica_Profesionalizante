import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PasswordService } from '../services/password/password.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { LoginService } from '../services/auth/login.service';

@Component({
  selector: 'app-password',
  standalone: true,
  templateUrl: './password.component.html',
  styleUrl: './password.component.css',
  imports: [RouterModule, CommonModule, ReactiveFormsModule]
})
export class PasswordComponent {
  form: FormGroup;
  message = '';
  error = '';
  currentPasswordFieldType: 'password' | 'text' = 'password';
  newPasswordFieldType: 'password' | 'text' = 'password';
  confirmPasswordFieldType: 'password' | 'text' = 'password';

  passwordValidations = {
    upperAndLowerCase: false,
    specialCharOrNumber: false
  };

  constructor(
    private fb: FormBuilder,
    private passwordService: PasswordService,
    private router: Router,
    private loginService: LoginService,
  ) {
    this.form = this.fb.group({
      currentPassword: ['', Validators.required],
      newPassword: ['', [
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(30),
        Validators.pattern(/^(?!.*\s).*$/)
      ]],
      confirmPassword: ['', Validators.required]
    }, { validators: this.passwordsMatchValidator });

    this.form.get('newPassword')?.valueChanges.subscribe(value => {
      this.passwordValidations.upperAndLowerCase =
        /[a-z]/.test(value) && /[A-Z]/.test(value);
      this.passwordValidations.specialCharOrNumber =
        /[\d!@#$%^&*(),.?":{}|<>]/.test(value);
    });
  }

  passwordsMatchValidator(group: FormGroup) {
    const newPassword = group.get('newPassword')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;
    return newPassword === confirmPassword ? null : { passwordsMismatch: true };
  }

  onSubmit() {
  if (this.form.valid) {
    const { currentPassword, newPassword } = this.form.value;
    this.passwordService.changePassword(currentPassword, newPassword).subscribe({
      next: () => {
        this.message = 'Contraseña cambiada correctamente.';
        this.error = '';
        console.log('Contraseña cambiada correctamente.');
        setTimeout(() => {
          this.loginService.methodlogout();
          this.router.navigate(['/login']);
        }, 5000);
      },
      error: (err) => {
        console.log('Error recibido:', err);

        if (err.status === 400) {
          if (err.error?.error) {
            this.error = err.error.error;
          } else if (typeof err.error === 'string') {
            this.error = err.error;
          } else if (err.error?.detail) {
            this.error = err.error.detail;
          } else {
            this.error = 'La solicitud no es válida. Verifica los datos ingresados.';
          }
        } else if (err.status === 401) {
          this.error = 'No tienes autorización para realizar esta acción. Inicia sesión nuevamente.';
        } else if (err.status === 0) {
          this.error = 'No se pudo conectar con el servidor. Intenta más tarde.';
        } else {
          this.error = 'Ocurrió un error inesperado. Intenta nuevamente.';
        }
        this.message = '';
      }
    });
  } else {
    this.form.markAllAsTouched();
    this.error = 'Completa correctamente el formulario.';
    this.message = '';
    }
  }

  toggleCurrentPasswordVisibility() {
    this.currentPasswordFieldType = this.currentPasswordFieldType === 'password' ? 'text' : 'password';
  }
  toggleNewPasswordVisibility() {
    this.newPasswordFieldType = this.newPasswordFieldType === 'password' ? 'text' : 'password';
  }
  toggleConfirmPasswordVisibility() {
    this.confirmPasswordFieldType = this.confirmPasswordFieldType === 'password' ? 'text' : 'password';
  }
}