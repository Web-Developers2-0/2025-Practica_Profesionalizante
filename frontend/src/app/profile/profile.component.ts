import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { User } from '../services/user/user';
import { UserService } from '../services/user/user.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router'; 

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
  ],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  user: User = {
    id: 0,
    email: '',
    first_name: '',
    last_name: '',
    address: '',
    phone: '',
    password: '',
    confirmPassword: '',
    image: ''
  };

  previewImage: string | ArrayBuffer | null = null;
  selectedFile: File | null = null;

  constructor(
    private userService: UserService,
    private router: Router 
  ) {}

  ngOnInit(): void {
    this.userService.getUser(this.user.id).subscribe(
      (userData: User) => {
        this.user = userData;
        this.previewImage = this.user.image || null;
      },
      (error) => {
        console.error('Error al obtener usuario:', error);
      }
    );
  }

  onImageSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      this.selectedFile = file;

      const reader = new FileReader();
      reader.onload = () => {
        this.previewImage = reader.result;
      };
      reader.readAsDataURL(file);
    }
  }

  onSubmit(): void {
    const formData = new FormData();
    
    formData.append('first_name', this.user.first_name || '');
    formData.append('last_name', this.user.last_name || '');
    formData.append('email', this.user.email || '');
    formData.append('address', this.user.address || '');
    formData.append('phone', this.user.phone || '');

    if (this.selectedFile) {
      formData.append('image', this.selectedFile, this.selectedFile.name);
    }

    this.userService.updateUser(formData).subscribe(
      (response) => {
        alert('Datos actualizados correctamente');
        this.router.navigate(['/dashboard']); 
      },
      (error) => {
        console.error('Error al actualizar usuario:', error);
      }
    );
  }
  
  closeWithoutSaving(): void {
    this.router.navigate(['/dashboard']);
  }
}
