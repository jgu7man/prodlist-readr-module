import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSelectChange } from '@angular/material/select';
import { MatStepper } from '@angular/material/stepper';
import { RxwebValidators } from '@rxweb/reactive-form-validators';
import { ReadrApiService } from '../../readr-api.service';
import { FileUploadedResult, DefaultColumns, DefaultColumnsList, DefaultCol, ProductsResult } from '../../readr.model';

@Component({
  selector: 'gdev-prodlist-readr',
  templateUrl: './prodlist-readr.component.html',
  styleUrls: ['./prodlist-readr.component.scss']
})
export class ProdlistReadrComponent implements OnInit {

  @ViewChild( 'stepper' ) private stepper!: MatStepper
  @Input() public firebasePath: string = ''

  isLinear = false;
  fileToupload: any
  uploadedResult: FileUploadedResult = {}
  DefaultColumns = DefaultColumnsList

  fileFormGroup: FormGroup;
  synonimsCols: any = {}

  filename: string = ''
  fileControl: FormControl = new FormControl('',
    [
      Validators.required,
      RxwebValidators.extension( { extensions: [ 'csv' ] } )
    ]
  )

  productsResult: ProductsResult = {
    "columns": [],
    "firebase_status": "",
    "items": [],
    "items_details": [],
    "cols_details": []
}

  @Output() onError: EventEmitter<string> = new EventEmitter()

  constructor (
    private _formBuilder: FormBuilder,
    public readr_: ReadrApiService,
  ) {
    this.fileFormGroup = this._formBuilder.group({
      fileCtrl: this.fileControl
    });


  }

  ngOnInit() {
  }

  getFileErrorMessage(error:any) {
    if ( error.extension ) {
      let badExt = error.extension[ 'refValues' ][ 0 ]
      return `El archivo que has elegido es ${badExt}, debe ser csv`
    } else {return ''}
  }

  uploadFile(event: any) {
    if ( event.target.files && event.target.files[ 0 ] ) {
      this.fileToupload = event.target.files[ 0 ]
      this.filename = this.fileToupload.name
    }
  }

  getColumns() {
    this.readr_.uploadFile( this.fileToupload )
      .subscribe(
        response => {
          console.log(response)
          this.uploadedResult = response.result
          this.stepper.next()
        },
        error => {
          console.error( error );
          console.error(error.error.message);
          this.onError.emit(error.error.message)
        }
      )
  }

  selectColumn( key: string, selection: MatSelectChange ) {
    let value = selection.value

    if ( value ) {
      this.synonimsCols[ value ] = key
    } else {
      delete this.synonimsCols[ value ]
    }
    console.log( this.synonimsCols )
  }


  includeDefaultColumnSelected( option: string ) {
    return Object.keys( this.synonimsCols).includes(option) ? true : false
  }

  validateColumnsSelected() {
    return Object.keys( this.synonimsCols).includes('id') ? true : false
  }


  renameCols() {
      this.readr_.renameCols( this.synonimsCols, this.fileToupload)
        .subscribe( response => {
          console.log( response )
          this.productsResult = response
          this.stepper.next()
        })

  }

  validateEmptyCol( column: any ) {
     return this.productsResult.items[column] ? column : null
  }


  async loadToFirestore() {
    await this.readr_.loadOndatabase( this.productsResult )
      .then( () => { this.stepper.next() })

  }

}
