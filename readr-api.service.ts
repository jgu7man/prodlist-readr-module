import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { map } from "rxjs/operators";
import { LoadingOverlayComponent } from './components/loading-overlay/loading-overlay.component';

@Injectable({
  providedIn: 'root'
})
export class ReadrApiService {

  serverurl: string = 'http://127.0.0.1:5000'
  constructor (
    private _http: HttpClient,
    private _dialog: MatDialog
  ) { }
  

  uploadFile( file: any ): Observable<any> {
    
    this.toggleLoading()
    var formData = new FormData()
        formData.set('dataset', file)
    
  //   var headers: HttpHeaders = new HttpHeaders( {
  //     'ContentType': 'multipart/form-data',
  //     'Access-Control-Allow-Origin': '*',
  //     'Accept': 'application/json'
  // } );
    
    const headers = new HttpHeaders( {
      'ContentType': 'multipart/form-data',
      'Access-Control-Allow-Origin': '*',
      'Accept': 'application/json'
    } )
    
    // console.log( formData.get('dataset') )
    return this._http.post( `${ this.serverurl }/file`, formData ).pipe(
      map( ( response: any ) => {
        this.toggleLoading()
        if ( response.status !== 201  ) {
          console.error(response.message)
        } else {
          return response
        }
      })
    )
  }


  public loadingSpinnerState: boolean = false;
  toggleLoading() {
    var dialog = this._dialog
    
    if ( !this.loadingSpinnerState ) {
      dialog.open( LoadingOverlayComponent, {
        panelClass: 'loading-spinner',
      })
    } else {
      dialog.closeAll()
    }
    
    this.loadingSpinnerState = !this.loadingSpinnerState
  }

}
