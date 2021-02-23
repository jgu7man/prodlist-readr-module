import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { MatDialog } from '@angular/material/dialog';
import { Observable, Subject } from 'rxjs';
import { map } from "rxjs/operators";
import { LoadingOverlayComponent } from './components/loading-overlay/loading-overlay.component';
import { DefaultColumns, ProductsResult } from './readr.model';

@Injectable({
  providedIn: 'root'
})
export class ReadrApiService {

  serverurl: string = 'http://127.0.0.1:5000'
  constructor (
    private _http: HttpClient,
    private _dialog: MatDialog,
    private firestore: AngularFirestore
  ) { }


  uploadFile( file: any ): Observable<any> {

    this.toggleLoading()
    var formData = new FormData()
        formData.set('file', file)


    const headers = new HttpHeaders( {
      'ContentType': 'multipart/form-data',
      'Access-Control-Allow-Origin': '*',
      'Accept': 'application/json'
    } )

    // console.log( formData.get('dataset') )
    return this._http.post( `${ this.serverurl }/file`, formData, { headers }).pipe(
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


  renameCols( columns: DefaultColumns, file: any ) {

    this.toggleLoading()
    let cols = JSON.stringify(columns)
    var body = new FormData()
    body.set( 'file', file )
    body.set( 'columns',cols)


    const headers = new HttpHeaders( {
      'ContentType': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Accept': 'application/json'
    } )

    return this._http.post( `${ this.serverurl }/set-columns`, body, { headers } )
    .pipe(
      map( ( response: any ) => {
        this.toggleLoading()
        if ( response.status !== 200  ) {
          console.error(response.message)
        } else {
          return response.result
        }
      } )
    )
  }


  public itemLoaded$: Subject<number> = new Subject();
  public categorias: any[] = [];
  async loadOndatabase( result: ProductsResult ) {
    this.toggleLoading()
    const productosRef = this.firestore.doc( 'tienda/productos' ).ref
    const categoriasRef = productosRef.collection( 'categorias' )
    const referenciasRef = productosRef.collection( 'referencias')

    const productosDoc = await productosRef.get()
    if ( !productosDoc.exists ) {
      productosRef.set({categorias: []})
    }
    this.categorias = productosDoc.get('categorias')
    this.itemLoaded$.subscribe(console.log)

    // Load productos
    try {
      await this.asyncForEach( result.items, async ( item: DefaultColumns, index: number ) => {

        // Structure categorias
        if ( typeof item.categorias === 'string' ) {

          item.categorias = item.categorias.split( ',' )
          await this.asyncForEach( item.categorias, async ( catego: string ) => {
            if (!this.categorias.includes(catego)) {this.categorias.push({name: catego})}
          })
        }

        // Structure subcategorias
        if ( typeof item.subcategorias == 'string' )
          item.subcategorias = item.subcategorias.split( ',' )


        referenciasRef.doc( item.id ).set( item, { merge: true } )
        console.log( item.id, 'agregado' )
        this.itemLoaded$.next( index + 1 )
        return
      } )
    } catch (error) {
      console.error(error)
    }



    // Load products details
    try {
      await this.asyncForEach( result.items_details, async ( item: any ) => {
      let doc_id = item[ 'id' ]
      delete item[ 'id' ]
      referenciasRef.doc(doc_id).update({detalles: item})
    })
    } catch (error) {
      console.error(error)
    }

    console.log('Items cargados!')
    productosRef.update({categorias: this.categorias})
    this.toggleLoading()
    return
  }

  async asyncForEach( array: any[], callback: any ) {
    for ( let index = 0; index < array.length; index++ ) {
      await callback( array[ index ], index, array );
    }
  }

  async structureCategorias( item: DefaultColumns ): Promise<any[]> {
    var categorias: any[] = []

    if ( item.categorias ) {
      if ( typeof item.categorias == 'string' ) item.categorias = item.categorias.split( ',' )

      // Store categorias
      await this.asyncForEach( item.categorias, (cat:string) => {
        if (!categorias.includes(cat)) categorias.push({name:cat})
      } )


      // Store sub-categorias
      if ( item.subcategorias ) {

        if ( typeof item.subcategorias == 'string' ) {
          var cat_sub = item.subcategorias.split( ':' )
          var catego = cat_sub[0]
          item.subcategorias = item.subcategorias[1].split( ',' )
        }

        var catFinded = categorias.findIndex( c => c.name == catego )
        var catInCategos = catFinded >= 0 ?  categorias[ catFinded ] : null
        var subcategos: string[] = []
        await this.asyncForEach( item.subcategorias, ( sub: string ) => {
          if ( catInCategos ) {
            if ( catInCategos[ 'subcategorias' ] ) subcategos = catInCategos[ 'subcategorias' ]
            if ( !catInCategos[ 'subcategorias' ].includes( sub ) ) subcategos.push( sub )
          }
          return

        } )

        categorias[catFinded]['subcategorias'] = subcategos

      }

    }
    return categorias

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
