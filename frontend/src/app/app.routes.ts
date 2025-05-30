import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { AboutComponent } from './about/about.component';
import { ProductsComponent } from './products/products.component';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
// import { SignupComponent } from './signup/signup.component';
import { ContactComponent } from './contact/contact.component';
import { DetailsprodComponent } from './detailsprod/detailsprod.component';
import { ProfileComponent } from './profile/profile.component';
import { RegisterComponent } from './register/register.component';
import { PaymentComponent } from './pasarela de pago/payment.component';
import { CartComponent } from './cart/cart.component';
import { AuthGuard } from './guards/auth.guard';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { EventComponent } from './event/event.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { TermsComponent } from './terms/terms.component';
import { NoAuthGuard } from './guards/no-auth.guard';
import { PasswordComponent } from './password/password.component';

export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'about', component: AboutComponent },
  { path: 'contact', component: ContactComponent },
  { path: 'event', component: EventComponent },
  { path: 'app-products', component: ProductsComponent },
  { path: 'detailsprod', component: DetailsprodComponent },
  { path: 'terms', component: TermsComponent },
  { path: '', redirectTo: '/app-products', pathMatch: 'full' },
  { path: 'app-products', component: ProductsComponent },
  { path: 'cart', component: CartComponent },
  { path: 'payment', component: PaymentComponent },
  { path: 'checkout', component: PaymentComponent },
  // auth
  { path: 'login', component: LoginComponent, canActivate: [NoAuthGuard] },
  {
    path: 'register',
    component: RegisterComponent,
    canActivate: [NoAuthGuard],
  },
  { path: 'reset-password', component: ResetPasswordComponent },
  { path: 'change-password/:token', component: ChangePasswordComponent },
  // protected
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'profile',
    component: ProfileComponent,
    canActivate: [AuthGuard],
  },
  { path: 'password', 
    component: PasswordComponent, 
    canActivate: [AuthGuard] 
  },
  // not found
  { path: '**', component: PageNotFoundComponent },
];
