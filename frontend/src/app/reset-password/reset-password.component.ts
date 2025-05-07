import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';

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

  constructor(private fb: FormBuilder, private router: Router) {
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

      // Lógica para enviar el enlace
      console.log(`Enviando enlace a ${email}...`);

      this.submitted = true;
    } else {
      this.resetForm.markAllAsTouched();
    }
  }

  goToLogin() {
    this.router.navigate(['/']);
  }
}