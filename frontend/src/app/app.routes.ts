import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { AboutComponent } from './about/about.component';
import { ProductsComponent } from './products/products.component';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
// import { SignupComponent } from './signup/signup.component';
import { ContactComponent } from './contact/contact.component';
import { DetailsprodComponent} from './detailsprod/detailsprod.component';
import { ProfileComponent } from './profile/profile.component';
import { RegistroComponent } from './registro/registro.component';
import { PaymentComponent } from './pasarela de pago/payment.component';
import { CartComponent } from './cart/cart.component';
import { AuthGuard } from './guards/auth.guard';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';

export const routes: Routes = [

    { path: "", redirectTo:"/home", pathMatch:"full" },
    { path: 'home', component:HomeComponent },
    { path: 'about', component:AboutComponent },
    { path: 'contact', component:ContactComponent },
    { path: 'app-products', component:ProductsComponent },
    { path: 'detailsprod', component:DetailsprodComponent },
    { path: 'login', component:LoginComponent },
    { 
        path: 'dashboard', 
        component: DashboardComponent,
        canActivate: [AuthGuard]
    },
    // {
    //     path: '**',
    //     component: PageNotFoundComponent
    // },
    { path: "", redirectTo:"/app-products", pathMatch:"full" },
    { path: 'app-products', component:ProductsComponent },
    { path: 'cart', component: CartComponent },
    { path: 'payment', component: PaymentComponent },
    { 
        path: 'profile', 
        component: ProfileComponent,
        canActivate: [AuthGuard]
    },
    { path: 'register', component: RegistroComponent }, 
    { path: 'checkout', component: PaymentComponent }, 
];
