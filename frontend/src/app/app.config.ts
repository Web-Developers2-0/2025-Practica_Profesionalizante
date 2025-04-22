import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { RouterModule, provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { LoginService } from './services/auth/login.service';
import { JwtService } from './services/auth/jwt.service';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';


export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    importProvidersFrom(BrowserModule, FormsModule, HttpClientModule, ReactiveFormsModule,), BrowserModule,
    
    ReactiveFormsModule,
    FormsModule,
    RouterModule,
    LoginService,
    JwtService, provideAnimationsAsync('noop'), provideAnimationsAsync('noop'), 
  ]
};
