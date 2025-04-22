import { Component, OnDestroy, OnInit } from '@angular/core';
import { ContactComponent } from '../contact/contact.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [ ContactComponent ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
// export class HomeComponent {
//   counter: number = 0;
//   operacion: number = 0;

//   constructor() { }

//   ngOnInit(): void {
//     const btnLeft = document.querySelector(".btn-left") as HTMLElement;
//     const btnRight = document.querySelector(".btn-right") as HTMLElement;
//     const slider = document.querySelector("#slider") as HTMLElement;
//     const sliderSections = document.querySelectorAll(".slider-section");

//     btnLeft.addEventListener("click", () => this.moveToLeft());
//     btnRight.addEventListener("click", () => this.moveToRight());

//     setInterval(() => {
//         this.moveToRight();
//     }, 3000);
//   }

//   private moveToLeft(): void {
//     const slider = document.querySelector("#slider") as HTMLElement;
//     const sliderSections = document.querySelectorAll(".slider-section");
//     const widthImg = 100 / sliderSections.length;

//     this.counter--;
//     if (this.counter < 0) {
//         this.counter = sliderSections.length - 1;
//         this.operacion = widthImg * (sliderSections.length - 1);
//         slider.style.transform = `translate(-${this.operacion}%)`;
//         slider.style.transition = "none";
//         return;
//     }
//     this.operacion = this.operacion - widthImg;
//     slider.style.transform = `translate(-${this.operacion}%)`;
//     slider.style.transition = "all ease .6s";
//   }

//   private moveToRight(): void {
//     const slider = document.querySelector("#slider") as HTMLElement;
//     const sliderSections = document.querySelectorAll(".slider-section");
//     const widthImg = 100 / sliderSections.length;

//     if (this.counter >= sliderSections.length - 1) {
//         this.counter = 0;
//         this.operacion = 0;
//         slider.style.transform = `translate(-${this.operacion}%)`;
//         slider.style.transition = "none";
//         return;
//     }
//     this.counter++;
//     this.operacion = this.operacion + widthImg;
//     slider.style.transform = `translate(-${this.operacion}%)`;
//     slider.style.transition = "all ease .6s";
//   }
// }

export class HomeComponent implements OnInit, OnDestroy {
  counter: number = 0;
  operacion: number = 0;
  interval: any;
  sliderSections: HTMLElement[] = [];

  constructor() { }

  ngOnInit(): void {
    this.interval = setInterval(() => {
      this.moveToRight();
    }, 3000);
  }

  ngOnDestroy(): void {
    clearInterval(this.interval);
  }

  moveToLeft(): void {
    this.counter--;
    if (this.counter < 0) {
      this.counter = this.sliderSections.length - 1;
      this.operacion = this.getSectionWidth() * (this.sliderSections.length - 1);
    } else {
      this.operacion -= this.getSectionWidth();
    }
    this.updateSlider();
  } 

  moveToRight(): void {
    if (this.counter >= this.sliderSections.length - 1) {
      this.counter = 0;
      this.operacion = 0;
    } else {
      this.counter++;
      this.operacion += this.getSectionWidth();
    }
    this.updateSlider();
  }

  updateSlider(): void {
    const slider = document.querySelector('#slider') as HTMLElement;
    slider.style.transform = `translate(-${this.operacion}%)`;
    slider.style.transition = 'all ease .6s';
  }

  getTotalSections(): number {
    return this.sliderSections.length;
  }

  getSectionWidth(): number {
    return 100 / this.getTotalSections();
  }
}
