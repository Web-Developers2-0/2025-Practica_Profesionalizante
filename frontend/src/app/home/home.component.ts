import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { ContactComponent } from '../contact/contact.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [ContactComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})

export class HomeComponent implements OnInit, OnDestroy {
  @ViewChild('slider') sliderRef!: ElementRef<HTMLElement>;
  sliderSections: HTMLElement[] = [];
  counter: number = 0;
  operacion: number = 0;
  interval: any;

  ngOnInit(): void {
    setTimeout(() => {
      this.sliderSections = Array.from(document.querySelectorAll('.slider-section')) as HTMLElement[];
      const btnLeft = document.querySelector('.btn-left') as HTMLElement | null;
      const btnRight = document.querySelector('.btn-right') as HTMLElement | null;
      if (btnLeft) btnLeft.addEventListener('click', () => this.moveToLeft());
      if (btnRight) btnRight.addEventListener('click', () => this.moveToRight());
      if (this.sliderSections.length > 0) {
        this.interval = setInterval(() => this.moveToRight(), 3000);
      }
    }, 0);
  }

  ngOnDestroy(): void {
    if (this.interval) {
      clearInterval(this.interval);
    }
  }

  moveToLeft(): void {
    if (this.sliderSections.length === 0) return;
    this.counter--;
    if (this.counter < 0) {
      this.counter = this.sliderSections.length - 1;
      this.operacion = this.getSectionWidth() * (this.sliderSections.length - 1);
      this.updateSlider(true); // No transition for loop
    } else {
      this.operacion -= this.getSectionWidth();
      this.updateSlider();
    }
  }

  moveToRight(): void {
    if (this.sliderSections.length === 0) return;
    if (this.counter >= this.sliderSections.length - 1) {
      this.counter = 0;
      this.operacion = 0;
      this.updateSlider(true); // No transition for loop
    } else {
      this.counter++;
      this.operacion += this.getSectionWidth();
      this.updateSlider();
    }
  }

  updateSlider(noTransition: boolean = false): void {
    if (this.sliderRef && this.sliderRef.nativeElement) {
      const slider = this.sliderRef.nativeElement;
      slider.style.transform = `translateX(-${this.operacion}%)`;
      slider.style.transition = noTransition ? 'none' : 'transform 0.6s ease';
    } else {
      console.error('Slider element not found');
    }
  }

  getTotalSections(): number {
    return this.sliderSections.length || 1; // Prevent division by zero
  }

  getSectionWidth(): number {
    return 100 / this.getTotalSections();
  }
}



