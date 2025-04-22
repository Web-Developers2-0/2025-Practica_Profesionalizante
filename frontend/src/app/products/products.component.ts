import { Component, OnInit } from '@angular/core';
import { ProductServiceService } from '../services/product-service.service';
import { Product } from '../services/product.interface';
import { RouterLink } from '@angular/router';
import { CartService } from '../services/cart/cart.service';
import { MatDialog } from '@angular/material/dialog';
import { ProductModalComponent } from '../modal-detail/modal-detail.component';
import { NgFor, NgIf } from '@angular/common';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [NgFor, NgIf, RouterLink],
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {
  productList: Product[] = [];
  selectedCategory: string = 'marvel';

  constructor(
    private productServiceService: ProductServiceService, 
    public cartService: CartService, 
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.updateCategory(this.selectedCategory);
  }

  updateCategory(category: string): void {
    this.selectedCategory = category;
    this.productServiceService.obtenerProductos().subscribe(
      (products: Product[]) => {
        this.productList = products.filter(product => product.category === this.getCategoryId(this.selectedCategory));
      },
      (error) => {
        console.error('Error fetching products', error);
      }
    );
  }

  getCategoryId(category: string): number {
    switch (category) {
      case 'marvel':
        return 1;
      case 'dc':
        return 2;
      default:
        return 0;
    }
  }

  onQuantityChange(product: Product, event: any): void {
    const quantity = parseInt(event.target.value, 10); // Convertir a número
    const currentQuantity = this.cartService.getItems().find(item => item.product.id_product === product.id_product)?.quantity || 0; // Obtener la cantidad actual del producto en el carrito
  
    // Calcular la diferencia entre la nueva cantidad y la cantidad actual
    const quantityDiff = quantity - currentQuantity;
  
    // Actualizar la cantidad del producto en el carrito
    if (quantityDiff > 0) {
      this.cartService.addToCart(product, quantityDiff);
    } else if (quantityDiff < 0) {
      // Si la diferencia es negativa, eliminar la cantidad excedente del carrito
      this.cartService.removeFromCart(product, Math.abs(quantityDiff));
    }
  }
  
  get selectedItems() {
    return this.cartService.getItems();
  }

  openModalDetail(productId: number): void {
    let dialogRef;
    console.log("screen.width", screen.width);

    if (screen.width < 500) {
      dialogRef = this.dialog.open(ProductModalComponent, {
        maxWidth: '100vw',
        width: "90%",
        data: { productId }
      });
    } else {
      dialogRef = this.dialog.open(ProductModalComponent, {
        width: "70%",
        data: { productId }
      });
    }
  }
}
