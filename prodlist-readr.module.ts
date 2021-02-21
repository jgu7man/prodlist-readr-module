import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProdlistReadrComponent } from './components/prodlist-readr/prodlist-readr.component';
import { MaterialModule } from '../shared/material.module';
import { RxReactiveFormsModule } from "@rxweb/reactive-form-validators"
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { FirebaseModule } from '../shared/firebase.module';
import { LoadingOverlayComponent } from './components/loading-overlay/loading-overlay.component';
import { InfoComponent } from './components/info/info.component';


@NgModule({
  declarations: [
    ProdlistReadrComponent,
    LoadingOverlayComponent,
    InfoComponent
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
