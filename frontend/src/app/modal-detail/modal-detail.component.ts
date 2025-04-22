import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { NgFor, NgIf, CommonModule } from '@angular/common';
import { ProductServiceService } from '../services/product-service.service';
import { Product } from '../services/product.interface';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-product-modal',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule, NgFor, NgIf, CommonModule,],
  templateUrl: './modal-detail.component.html',
  styleUrls: ['./modal-detail.component.css']
})

export class ProductModalComponent implements OnInit {
  product: Product | null = null;
  images: string[] = [];
  selectedImage: string | null = null;

  constructor(
    public dialogRef: MatDialogRef<ProductModalComponent>,
    private productService: ProductServiceService,
    @Inject(MAT_DIALOG_DATA) private data: { productId: number }
  ) {}

  ngOnInit(): void {
    this.getProductDetail(this.data.productId);
  }

  onClose(): void {
    this.dialogRef.close();
  }

  getProductDetail(productId: number): void {
    this.productService.obtenerProductoPorId(productId).subscribe((product: Product) => {
      this.product = product;
    });
  }
}
