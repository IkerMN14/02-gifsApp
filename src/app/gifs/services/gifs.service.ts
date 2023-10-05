import { Injectable } from '@angular/core';
import { HttpClient, HttpClientModule, HttpParams } from '@angular/common/http';
import { Gif, SearchGifsResponse } from '../interfaces/gifs.interface';

@Injectable({
  providedIn: 'root'
})
export class GifsService {

  private _historial: string[] = [];
  private apiKey: string = "5p6ggK2kT59m2UtwNUlNFCJn5bs0qUNC"
  private servicioUrl: string ='https://api.giphy.com/v1/gifs'
  public resultados : Gif []= []; // es PUBLICA
  get historial() {

    return [...this._historial];
  }
  //Sin espacios ni repetidos 
  //Maximo array de 10 busquedas

  constructor(private http: HttpClient) { 
    this._historial=JSON.parse(localStorage.getItem('historial')!) || [];
    this.resultados=JSON.parse(localStorage.getItem('resultados')!) || [];
  }

 
  
  buscarGifs(query: string) {
    query = query.trim().toLowerCase();
    if (!this._historial.includes(query)) {
      this._historial.unshift(query);//colocar al principio
      this._historial = this.historial.splice(0, 10);//coge los 10 primeros huecos
      //localStorage.setItem('historial',query)
      localStorage.setItem('historial', JSON.stringify(this._historial));//Convertir cualquier objeto a string
    }

    const params = new HttpParams()
    .set('api_key', this.apiKey)
    .set('q',query)
    .set('limit',10);

    //console.log(this._historial);
    this.http.get<SearchGifsResponse>(`${this.servicioUrl}/search`,{params})
      .subscribe((resp) =>{
        this.resultados = resp.data;
        localStorage.setItem('resultados', JSON.stringify(this.resultados));
       
        console.log(resp.data);
      });

  }
}
