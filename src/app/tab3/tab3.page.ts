import { Component, ViewChild } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { ModificacionesServiceService } from '../services/Modificaciones/modificaciones-service.service';
import { IonModal } from '@ionic/angular';
import { OverlayEventDetail } from '@ionic/core/components';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page {
  @ViewChild(IonModal) modal!: IonModal;
  contrasena!: string;
  ubicacion!: string;
  nombre!:string;
  Descripcion:string;
  constructor(
    private modificaciones: ModificacionesServiceService, 
    private alertController: AlertController ) { 
      this.Descripcion="";
    }

  async AgregarSalon() {
    if (this.nombre == "" || this.nombre == undefined || this.contrasena==undefined || this.contrasena=="") {

      const alert = await this.alertController.create({
        header: 'Datos incompletos',
        message: "Verifique que todos los campos esten cubiertos",
        buttons: [

          {
            text: 'OK',
            role: 'confirm'

          },
        ],
      });

      await alert.present();

      const { role } = await alert.onDidDismiss();
    } else {

     let respuesta = await this.modificaciones.AgregarSalon(this.nombre,this.contrasena,this.Descripcion);

      respuesta.subscribe(async data => {
        console.log(data)
        if (data.correcto == 1){
          const alert = await this.alertController.create({
            header: 'Registro correcto',
           
            buttons: [
    
              {
                text: 'OK',
                role: 'confirm'
    
              },
            ],
          });
    
          await alert.present();
    
          const { role } = await alert.onDidDismiss();

          this.nombre="";
          this.contrasena="";
        }else{
          const alert = await this.alertController.create({
            header: 'Error',
            
            buttons: [
    
              {
                text: 'OK',
                role: 'confirm'
    
              },
            ],
          });
    
          await alert.present();
    
          const { role } = await alert.onDidDismiss();
        }
      });





    }
  }



  

}
