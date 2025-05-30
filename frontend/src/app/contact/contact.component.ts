import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ContactService } from '../services/contact/contact.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.css'
})
export class ContactComponent {
  contactForm: FormGroup;
  successMsg = '';
  errorMsg = '';
  fieldErrors: any = {};

  constructor(private fb: FormBuilder, private contactService: ContactService) {
    this.contactForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(4)]],
      email: ['', [Validators.required, Validators.email]],
      message: ['', [Validators.required, Validators.minLength(10)]]
    });
  }

  onSubmit() {
    this.successMsg = '';
    this.errorMsg = '';
    this.fieldErrors = {};

    if (this.contactForm.invalid) {
      this.errorMsg = 'Completa todos los campos correctamente.';
      this.contactForm.markAllAsTouched();
      return;
    }
    this.contactService.sendContact(this.contactForm.value).subscribe({
      next: (res: { detail?: string }) => {
        this.successMsg = res.detail || '¡Mensaje enviado!';
        this.errorMsg = '';
        this.fieldErrors = {};
        this.contactForm.reset();
        console.log('Mensaje enviado correctamente');
      },
      error: (err) => {
        if (err.error) {
          this.fieldErrors = err.error;
          this.errorMsg = err.error.detail || 'No se pudo enviar el mensaje. Intenta más tarde.';
        } else {
          this.errorMsg = 'No se pudo enviar el mensaje. Intenta más tarde.';
        }
        console.error('Error al enviar mensaje:', err);
      }
    });
  }
}