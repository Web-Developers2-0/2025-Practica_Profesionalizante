import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-terms',
  standalone: true,
  imports: [],
  templateUrl: './terms.component.html',
  styleUrls: ['./terms.component.css']
})
export class TermsComponent {
  constructor(public dialogRef: MatDialogRef<TermsComponent>) {}

  closeDialog(): void {
    this.dialogRef.close(false); 
  }

  acceptTerms(): void {
    this.dialogRef.close(true); 
  }
}