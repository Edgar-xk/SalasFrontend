import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { servidor } from '../servidor'
@Injectable({
  providedIn: 'root'
})
export class ModificacionesServiceService {

  constructor(private http: HttpClient) { }

  async AgregarSalon(nombre: string, contrasena: string,Descripcion:string) {



    //let response = this.http.post<any>("http://localhost:4000/NuevoEspacio", { data: info });

    return await this.http.post<any>(servidor + "/AgregarSalon", { data: { Nombre: nombre, Contrasena: contrasena,Descripcion:Descripcion } });

  }
  async ModificarSalon(Nombre: string, Descripcion: string,Id:number) {

    return  this.http.put<any>(servidor + "/ModificarSalon", {
      data: {
        "Id":Id,
        "Nombre": Nombre,
        "Descripcion": Descripcion

      }
    });
  }
  async EliminarSalon(Id:number){
    return  this.http.delete(servidor+"/EliminarSalon/"+Id);
  }
}
