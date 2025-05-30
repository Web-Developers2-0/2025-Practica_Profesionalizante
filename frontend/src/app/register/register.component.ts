import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms'; // CUSTOM: Se agregan tipos para validadores personalizados
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { RegisterService } from '../services/register/register.service';
import { RouterModule } from '@angular/router';
import { TermsComponent } from '../terms/terms.component';
import { MatDialog } from '@angular/material/dialog';

function onlyLettersValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value?.trim();
    if (value && !/^[A-Za-zÁÉÍÓÚáéíóúÑñ]+$/.test(value)) {
      return { onlyLetters: true };
    }
    return null;
  };
}

function noSpacesValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;
    if (value && value.includes(' ')) {
      return { noSpaces: true };
    }
    return null;
  };
}

function strongPasswordValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;
    if (
      value &&
      !/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}/.test(value)
    ) {
      return { strongPassword: true };
    }
    return null;
  };
}

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [RouterModule, CommonModule, ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent {
  form!: FormGroup;
  passwordFieldType = 'password';
  confirmPasswordFieldType = 'password';

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private registerService: RegisterService,
    public dialog: MatDialog,
  ) {
    this.form = this.formBuilder.group(
      {
        first_name: [
          '',
          [
            Validators.required,
            Validators.minLength(4),
            Validators.maxLength(16),
            onlyLettersValidator(),
            noSpacesValidator(),
          ],
        ],
        last_name: [
          '',
          [
            Validators.required,
            Validators.minLength(4),
            Validators.maxLength(16),
            onlyLettersValidator(),
            noSpacesValidator(),
          ],
        ],
        email: [
          '',
          [
            Validators.required,
            Validators.email,
            noSpacesValidator(),
          ],
        ],
        phone: [
          '',
          [
            Validators.required,
            Validators.pattern('^[0-9]{10}$'),
            noSpacesValidator(),
          ],
        ],
        address: [
          '',
          [
            Validators.required,
            Validators.maxLength(50),
          ],
        ],
        password: [
          '',
          [
            Validators.required,
            Validators.minLength(8),
            Validators.maxLength(30),
            noSpacesValidator(),
            strongPasswordValidator(),
          ],
        ],
        confirmPassword: ['', [Validators.required]],
        terms: ['', [Validators.requiredTrue]],
      },
      { validators: this.passwordsMatchValidator }
    );

    this.form.get('password')?.valueChanges.subscribe(() => {
      this.form.get('confirmPassword')?.updateValueAndValidity();
    });
  }

  passwordsMatchValidator: ValidatorFn = (group: AbstractControl): ValidationErrors | null => {
    const password = group.get('password')?.value;
    const confirm = group.get('confirmPassword')?.value;
    if (password && confirm && password !== confirm) {
      group.get('confirmPassword')?.setErrors({ passwordsMismatch: true });
    } else {
      const errors = group.get('confirmPassword')?.errors;
      if (errors) {
        delete errors['passwordsMismatch'];
        if (Object.keys(errors).length === 0) {
          group.get('confirmPassword')?.setErrors(null);
        } else {
          group.get('confirmPassword')?.setErrors(errors);
        }
      }
    }
    return null;
  };

  togglePasswordVisibility(): void {
    this.passwordFieldType = this.passwordFieldType === 'password' ? 'text' : 'password';
  }

  toggleConfirmPasswordVisibility(): void {
    this.confirmPasswordFieldType = this.confirmPasswordFieldType === 'password' ? 'text' : 'password';
  }

  getFirstName() {
    return this.form.get('first_name');
  }

  getLastName() {
    return this.form.get('last_name');
  }

  getEmail() {
    return this.form.get('email');
  }

  getPhone() {
    return this.form.get('phone');
  }

  getAddress() {
    return this.form.get('address');
  }

  getPassword() {
    return this.form.get('password');
  }

  getConfirmPassword() {
    return this.form.get('confirmPassword');
  }

  getTerms() {
    return this.form.get('terms');
  }

  openTermsDialog(): void {
    const dialogRef = this.dialog.open(TermsComponent, {
      width: '500px',
      height: '400px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result === true) {
        this.form.get('terms')?.setValue(true);
      }
    });
  }

  onSubmit(event: Event) {
    event.preventDefault();

    // Sanitización básica antes de enviar
    const sanitized = {
      ...this.form.value,
      first_name: this.form.value.first_name?.trim(),
      last_name: this.form.value.last_name?.trim(),
      email: this.form.value.email?.trim().toLowerCase(),
      phone: this.form.value.phone?.trim(),
      address: this.form.value.address?.trim(),
    };

    if (this.form.valid) {
      this.registerService
        .registerUser(sanitized)
        .subscribe({
          next: (response) => {
            console.log(response);
            alert('¡Usuario registrado exitosamente!');
            this.router.navigate(['/login']);
          },
          error: (error) => {
            console.error(error);
            alert('Error al registrarse, intente nuevamente');
          },
        });
    } else {
      alert('Completa el formulario correctamente');
      this.form.markAllAsTouched();
    }
  }

  // Permitir solo números 
  allowOnlyNumbers(event: KeyboardEvent) {
    const charCode = event.key.charCodeAt(0);
    if (charCode < 48 || charCode > 57) {
      event.preventDefault();
    }
  }
}