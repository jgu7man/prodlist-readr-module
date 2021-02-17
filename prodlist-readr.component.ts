import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { RxwebValidators } from '@rxweb/reactive-form-validators';
import { ReadrApiService } from './readr-api.service';
import { FileUploadedResult } from './readr.model';

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
  secondFormGroup: FormGroup;
  filename: string = ''
  fileControl: FormControl = new FormControl('',
    [
      Validators.required,
      RxwebValidators.extension( { extensions: [ 'csv' ] } )
    ]
  )

  constructor (
    private _formBuilder: FormBuilder,
    private _readr: ReadrApiService
  ) {
    this.fileFormGroup = this._formBuilder.group({
      fileCtrl: this.fileControl
    });
    this.secondFormGroup = this._formBuilder.group({
      secondCtrl: ['', Validators.required]
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
      .subscribe( response => {
          this.uploadedResult = response.result
      })
  }

}
