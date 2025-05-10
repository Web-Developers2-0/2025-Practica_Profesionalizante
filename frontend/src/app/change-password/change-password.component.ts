import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { PasswordService } from '../services/password/password.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-change-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './change-password.component.html',
  styleUrl: './change-password.component.css'
})
export class ChangePasswordComponent implements OnInit, OnDestroy {
  form!: FormGroup;
  passwordFieldType = 'password';
  confirmPasswordFieldType = 'password';
  passwordValidations = {
    minLength: false,
    upperAndLowerCase: false,
    specialCharOrNumber: false
  };
  private subscriptions: Subscription[] = [];
  message = '';
  error = '';
  token = '';

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private passwordService: PasswordService
  ) {}

  ngOnInit(): void {
    this.token = this.route.snapshot.paramMap.get('token') || '';
    this.form = this.fb.group({
      password: ['', [
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(30),
        Validators.pattern(/^(?!.*\s).*$/)
      ]],
      confirmPassword: ['', Validators.required]
    });

    this.form.setValidators(this.passwordsMatchValidator);

    const passwordChangesSub = this.form.get('password')?.valueChanges.subscribe(() => {
      this.onPasswordInput();
      this.form.get('confirmPassword')?.updateValueAndValidity();
    });
    if (passwordChangesSub) this.subscriptions.push(passwordChangesSub);

    this.onPasswordInput();
    this.form.updateValueAndValidity();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  passwordsMatchValidator: ValidatorFn = (group: AbstractControl): ValidationErrors | null => {
    const passwordControl = group.get('password');
    const confirmPasswordControl = group.get('confirmPassword');
    if (!passwordControl || !confirmPasswordControl) return null;
    const password = passwordControl.value;
    const confirmPassword = confirmPasswordControl.value;
    const confirmErrors = confirmPasswordControl.errors;
    const mismatchError = { passwordsMismatch: true };
    if (confirmPassword && password !== confirmPassword) {
      if (!confirmErrors || !confirmErrors['passwordsMismatch']) {
        confirmPasswordControl.setErrors(confirmErrors ? { ...confirmErrors, ...mismatchError } : mismatchError);
      }
      return null;
    } else {
      if (confirmErrors && confirmErrors['passwordsMismatch']) {
        delete confirmErrors['passwordsMismatch'];
        if (Object.keys(confirmErrors).length > 0) {
          confirmPasswordControl.setErrors(confirmErrors);
        } else {
          confirmPasswordControl.setErrors(null);
        }
      }
      return null;
    }
  };

  onPasswordInput() {
    const password = this.form.get('password')?.value || '';
    this.passwordValidations.minLength = password.length >= 8;
    this.passwordValidations.upperAndLowerCase = /[a-z]/.test(password) && /[A-Z]/.test(password);
    this.passwordValidations.specialCharOrNumber = /[\d!@#$%^&*(),.?":{}|<>]/.test(password);
  }

  togglePasswordVisibility(): void {
    this.passwordFieldType = this.passwordFieldType === 'password' ? 'text' : 'password';
  }

  toggleConfirmPasswordVisibility(): void {
    this.confirmPasswordFieldType = this.confirmPasswordFieldType === 'password' ? 'text' : 'password';
  }

  onSubmit() {
    if (this.form.valid && this.token) {
      const password = this.form.value.password;
      this.passwordService.confirmPasswordReset(this.token, password).subscribe({
        next: (res: any) => {
          this.message = 'Contraseña restablecida correctamente. Ahora puedes iniciar sesión.';
          this.error = '';
          console.log('Contraseña restablecida correctamente:', res);
          setTimeout(() => this.router.navigate(['/login']), 2000);
        },
        error: (err) => {
          this.error = err.error?.error || 'El enlace es inválido o ha expirado.';
          this.message = '';
          console.error('Error al restablecer la contraseña:', err);
        }
      });
    } else {
      this.form.markAllAsTouched();
      this.error = 'Por favor, completa correctamente el formulario.';
      this.message = '';
      console.warn('Formulario inválido:', this.form.value);
    }
  }
}
