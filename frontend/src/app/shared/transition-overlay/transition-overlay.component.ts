import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'; 

@Component({
  selector: 'app-transition-overlay',
  standalone: true,
  imports: [CommonModule], 
  templateUrl: './transition-overlay.component.html',
  styleUrls: ['./transition-overlay.component.css']
})
export class TransitionOverlayComponent {
  isVisible = false;

  showTransition() {
    this.isVisible = true;
    setTimeout(() => {
      this.isVisible = false;
    }, 1000);
  }
}