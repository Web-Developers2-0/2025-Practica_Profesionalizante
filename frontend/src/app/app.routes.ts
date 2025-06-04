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
  { path: 'home', component: HomeComponent, data: { animation: 'HomePage' }},
  { path: 'about', component: AboutComponent, data: { animation: 'AboutPage' }},
  { path: 'contact', component: ContactComponent, data: { animation: 'ContactPage' }},
  { path: 'event', component: EventComponent, data: { animation: 'EventPage' }},
  { path: 'app-products', component: ProductsComponent, data: { animation: 'ProductsPage' }},
  { path: 'detailsprod', component: DetailsprodComponent, data: { animation: 'DetailsPage' }},
  { path: 'terms', component: TermsComponent, data: { animation: 'TermsPage' }},
  { path: 'cart', component: CartComponent, data: { animation: 'CartPage' }},
  { path: 'payment', component: PaymentComponent, data: { animation: 'PaymentPage' }},
  { path: 'checkout', component: PaymentComponent, data: { animation: 'CheckoutPage' }},

  // auth
  { path: 'login', component: LoginComponent, canActivate: [NoAuthGuard], data: { animation: 'LoginPage' }},
  { path: 'register', component: RegisterComponent, canActivate: [NoAuthGuard], data: { animation: 'RegisterPage' }},
  { path: 'reset-password', component: ResetPasswordComponent, data: { animation: 'ResetPage' }},
  { path: 'change-password/:token', component: ChangePasswordComponent, data: { animation: 'ChangePasswordPage' }},

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
  { path: '**', component: PageNotFoundComponent, data: { animation: 'NotFoundPage' }},
];
