import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class ReadrApiService {

  serverurl: string = 'http://127.0.0.1:5000'
  constructor (
    private _http: HttpClient
  ) { }
  

  uploadFile( file: any ): Observable<any> {
    const body = {
      'dataset': file
    }
    return this._http.post( `${ this.serverurl }/file`, body ).pipe(
      map( (response: any)=> {
        if ( response.status !== 201  ) {
          console.error(response.message)
        } else {
          return response
        }
      })
    )
  }

}
