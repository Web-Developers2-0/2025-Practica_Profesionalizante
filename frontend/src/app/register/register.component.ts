import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { RegisterService } from '../services/register/register.service';
import { RouterModule } from '@angular/router'; // Agrega RouterModule
import { TermsComponent } from '../terms/terms.component';
import { MatDialog } from '@angular/material/dialog'; // Import MatDialog

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [RouterModule, CommonModule, ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent {
  form!: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private registerService: RegisterService,
    public dialog: MatDialog
  ) {
    this.form = this.formBuilder.group({
      first_name: [
        '',
        [
          Validators.required,
          Validators.minLength(4),
          Validators.maxLength(16),
        ],
      ],
      last_name: [
        '',
        [
          Validators.required,
          Validators.minLength(4),
          Validators.maxLength(16),
        ],
      ],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      address: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]],
      terms: ['', [Validators.requiredTrue]],
    });
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
        this.form.get('terms')?.setValue(true); // Accept terms if user confirms
      }
    });
  }

  onSubmit(event: Event) {
    {
      event.preventDefault();

      if (this.form.valid) {
        this.registerService
          .registerUser({
            first_name: this.form.get('first_name')?.value,
            last_name: this.form.get('last_name')?.value,
            email: this.form.get('email')?.value,
            phone: this.form.get('phone')?.value,
            address: this.form.get('address')?.value,
            password: this.form.get('password')?.value,
            confirmPassword: this.form.get('confirmPassword')?.value,
            terms: this.form.get('terms')?.value,
          })
          .subscribe({
            next: (response) => {
              console.log(response);
              // this.router.navigate(['/']);
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
  }
}
