import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { User } from '../services/user/user';
import { UserService } from '../services/user/user.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    FormsModule,
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})

export class ProfileComponent implements OnInit {
  user: User = {
    id: 0,
    email: '',
    first_name: '',
    last_name: '',
    address: '',
    phone: 0,
    password: '',
    confirmPassword: '',
  };

  constructor(private userService: UserService) { }

  ngOnInit(): void {
    this.userService.getUser(1).subscribe(
      (userData: User ) => {
      this.user = userData;
    },
  );
  }

  onSubmit() {
    this.userService.updateUser(this.user).subscribe(response => {
      console.log(response);
    });
  }
}
