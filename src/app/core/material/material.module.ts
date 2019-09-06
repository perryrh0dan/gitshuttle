import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import * as Material from '@angular/material';

@NgModule({
  imports: [
    CommonModule,
    Material.MatSidenavModule,
    Material.MatDialogModule,
    Material.MatFormFieldModule,
    Material.MatInputModule,
    Material.MatSelectModule,
    Material.MatCardModule,
    Material.MatButtonModule
  ],
  exports: [
    Material.MatSidenavModule,
    Material.MatDialogModule,
    Material.MatFormFieldModule,
    Material.MatInputModule,
    Material.MatSelectModule,
    Material.MatCardModule,
    Material.MatButtonModule
  ],
  providers: [],
  declarations: []
})
export class MaterialModule { }
