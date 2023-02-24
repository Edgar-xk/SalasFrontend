import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {servidor} from '../servidor';
@Injectable({
  providedIn: 'root'
})
export class ReservarService {
  
  

  constructor(private http:HttpClient) { }


  public  async getReservacionesSalonFecha(idSalon: number, fecha: string) {

    let respuesta= await this.http.get(servidor+"/GetReservacionesSalonFecha/"+idSalon+"/"+fecha);
    
    return respuesta;




  }

  public GetSalones(){
    
    return this.http.get<any>(servidor+"/ObtenerSalas");
  };

  public async Guardar(nombre:string,fecha:string,horaI:string,horaF:string,idSalon:number,contrasena:string){
    

    console.log(idSalon);
    
    return  await  this.http.post<any>(servidor+"/NuevaReservacion",{
      data:{
        "IdSalon":idSalon,
        "Nombre":nombre,
        "Fecha":fecha,
        "HoraI":horaI,
        "HoraF":horaF,
        
        "Contrasena":contrasena
      }
    });
  }

  public getReservacionesSalonMes(idSalon:number,mes:string){

    return this.http.get<any>(servidor+"/ReservacionesSalonMes/"+idSalon+"/"+mes);


  }


  public getReservacionesFechaHora(fecha:string,hora:string) {
    return this.http.get(servidor+"/ReservacionesFechaHora.php?fecha="+fecha+"&hora="+hora);

  }

  public EliminarReservacion(id:number){
    let formData=new FormData();
    formData.append("id",id.toString());
    return this.http.post<any>(servidor+"/EliminarReservacion.php",formData);
  }
}
