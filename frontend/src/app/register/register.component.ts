import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { RegistroService } from '../services/registro/registro.service';

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './registro.component.html',
  styleUrl: './registro.component.css'
})
export class RegistroComponent {
  form!: FormGroup;


  constructor(private formBuilder: FormBuilder, private router: Router, private registroService: RegistroService){
    this.form = this.formBuilder.group({
      first_name: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(16)]],
      last_name: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(16)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      address: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]],
    });
  }

  getFirstName(){
    return this.form.get('first_name');
  }

  getLastName(){
    return this.form.get('last_name');
  }

  getEmail(){
    return this.form.get('email');
  }

  getPhone(){
    return this.form.get('phone');
  }

  getAddress(){
    return this.form.get('address');
  }

  getPassword(){
    return this.form.get('password');
  }

  getConfirmPassword(){
    return this.form.get('confirmPassword');
  }

  onSubmit(event: Event) {
    {
      event.preventDefault();

      if(this.form.valid) {
        this.registroService.registerUser({
          first_name: this.form.get('first_name')?.value,
          last_name: this.form.get('last_name')?.value,
          email: this.form.get('email')?.value,
          phone: this.form.get('phone')?.value,
          address: this.form.get('address')?.value,
          password: this.form.get('password')?.value,
          confirmPassword: this.form.get('confirmPassword')?.value,
        }). subscribe ({
          next:(response) => {
            console.log(response);
            this.router.navigate(['/']);
          },
          error:(error) => {
            console.error(error);
            alert('Error al registrarse, intente nuevamente');
          }
        });
        } else {
          alert('Completa el formulario correctamente');
          this.form.markAllAsTouched();
        }
    }
  }
}
