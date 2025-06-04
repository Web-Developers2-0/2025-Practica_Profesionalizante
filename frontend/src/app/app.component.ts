import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { Router, NavigationStart, RouterOutlet } from '@angular/router';
import { HeaderComponent } from './shared/header/header.component';
import { FooterComponent } from './shared/footer/footer.component';
import { TransitionOverlayComponent } from './shared/transition-overlay/transition-overlay.component';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,HeaderComponent,FooterComponent,TransitionOverlayComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  
})
export class AppComponent implements AfterViewInit {
  title = 'planetSuperheroes';
  isLoading: boolean = false;

  @ViewChild('overlay') overlay!: TransitionOverlayComponent;

  constructor(private router: Router) {}

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.router.events.subscribe((event: any) => {
        if (event instanceof NavigationStart) {
          const url = event.url;
          console.log('NavigationStart to:', url);

          if (url === '/event') {
            this.overlay?.showTransition();
          }
        }
      });
    });
  }

  onActivate(event: any) {
    console.log('Activated:', event);
  }
}