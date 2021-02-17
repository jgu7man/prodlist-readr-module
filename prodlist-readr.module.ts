import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProdlistReadrComponent } from './prodlist-readr.component';
import { MaterialModule } from '../shared/material.module';
import { RxReactiveFormsModule } from "@rxweb/reactive-form-validators"
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { FirebaseModule } from '../shared/firebase.module';


@NgModule({
  declarations: [
    ProdlistReadrComponent
  ],
  imports: [
    CommonModule, 
    ReactiveFormsModule,
    FormsModule,
    MaterialModule,
    RxReactiveFormsModule,
    HttpClientModule,
    FirebaseModule
  ],
  exports: [
    ProdlistReadrComponent
  ]
})
export class ProdlistReadrModule { }
