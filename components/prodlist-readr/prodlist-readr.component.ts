import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { RxwebValidators } from '@rxweb/reactive-form-validators';
import { ReadrApiService } from '../../readr-api.service';
import { FileUploadedResult } from '../../readr.model';

@Component({
  selector: 'gdev-prodlist-readr',
  templateUrl: './prodlist-readr.component.html',
  styleUrls: ['./prodlist-readr.component.scss']
})
export class ProdlistReadrComponent implements OnInit {

  isLinear = false;
  fileToupload: any
  uploadedResult: FileUploadedResult = {}

  fileFormGroup: FormGroup;
  columnsFormGroup: FormGroup;
  
  filename: string = ''
  fileControl: FormControl = new FormControl('',
    [
      Validators.required,
      RxwebValidators.extension( { extensions: [ 'csv' ] } )
    ]
  )

  @Output() onError: EventEmitter<string> = new EventEmitter()

  constructor (
    private _formBuilder: FormBuilder,
    private _readr: ReadrApiService,
  ) {
    this.fileFormGroup = this._formBuilder.group({
      fileCtrl: this.fileControl
    });
    this.columnsFormGroup = this._formBuilder.group( {
      'id': ['', Validators.required],
      'precio':  ['', Validators.required],
      'categorias': [''],
      'subcategorias': [''],
      'descripcion': [''],
      'onStock': [''],
      'referencia': [''],
      'stockCant': [''],
      'imagenUrl': [''],
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
    this._readr.uploadFile( this.fileToupload )
      .subscribe(
        response => {
          console.log(response)
          this.uploadedResult = response.result
        },
        error => {
          console.error( error );
          console.error(error.error.message);
          this.onError.emit(error.error.message)
        }
      )
  }

}
