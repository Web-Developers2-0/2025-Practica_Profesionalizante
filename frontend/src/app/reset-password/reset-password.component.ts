import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { PasswordService } from '../services/password/password.service';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.css'
})
export class ResetPasswordComponent {
  resetForm: FormGroup;
  submitted = false;
  message = '';
  error = '';

  constructor(private fb: FormBuilder, private router: Router, private passwordService: PasswordService) {
    this.resetForm = this.fb.group({
      email: [
        '',
        [
          Validators.required,
          Validators.maxLength(30),
          Validators.pattern(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)
        ]
      ]
    });
  }

  onSubmit() {
    const emailRaw = this.resetForm.value.email || '';
    this.resetForm.patchValue({ email: emailRaw.trim() });

    if (this.resetForm.valid) {
      const email = this.resetForm.value.email;
      this.passwordService.requestPasswordReset(email).subscribe({
        next: (res: any) => {
          this.message = 'Si el correo existe, se enviará un enlace para restablecer la contraseña.';
          this.error = '';
          this.submitted = true;
          console.log('Correo de recuperación enviado correctamente:', res);
        },
        error: (err) => {
          this.error = err.error?.error || 'Ocurrió un error al enviar el correo. Intenta de nuevo.';
          this.message = '';
          console.error('Error al enviar el correo de recuperación:', err);
        }
      });
    } else {
      this.resetForm.markAllAsTouched();
      this.error = 'Por favor, ingresa un correo válido.';
      this.message = '';
      console.warn('Formulario inválido:', this.resetForm.value);
    }
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }
}