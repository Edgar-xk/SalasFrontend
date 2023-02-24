import { Component, OnInit, ViewChild } from '@angular/core';
import { IonModal, ToastController } from '@ionic/angular'
import { OverlayEventDetail } from '@ionic/core/components';
import { ReservarService } from '../services/reservar/reservar.service';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {
  @ViewChild(IonModal) modal!: IonModal;

  mes: number;
  anio: number;
  dias: string[];
  diaString: string;
  reservaciones: Array<any>;
  fechaCalendarioMin: string;
  fechaCalendarioMax: string;
  dia: number;
  ReservacionesOrdenadas: Array<any>;

  salones: Array<any>;
  contador: number;

  constructor(private toastController: ToastController, private reservarService: ReservarService) {

    this.contador = 0;
    this.mes = ((new Date()).getMonth()) + 1;
    this.anio = ((new Date()).getFullYear());
    this.fechaCalendarioMin = "2022-" + this.mes + "-01T00:00:00";
    this.fechaCalendarioMax = "2022-" + this.mes + "-31T23:59:59";
    this.salones = [];
    
    this.diaString = "";
    this.reservaciones = [];
    this.dia = 0;
    this.ReservacionesOrdenadas = [];
    this.dias = new Array<string>();
    this.dias.push(this.fechaCalendarioMax);
    this.ColocarFechas();
  }
  async GetSalones() {


    let respons = this.reservarService.GetSalones();

    return new Promise<void>((resolve, reject) => {
      respons.subscribe(async (data) => {
        let salonesL = <Array<any>>data;
        if (salonesL.length > 0) {
          this.salones = await salonesL;
          resolve();
          
        }


      })
    });
  }
  CambiarSalonF() {
    if ((this.contador + 1) == this.salones.length) {
      this.contador = 0;
    } else {
      this.contador++;
    }
    this.ColocarFechas();
  }
  CambiarSalonR() {
    if ((this.contador - 1) == -1) {
      this.contador = this.salones.length - 1;
    } else {
      this.contador--;
    }
    this.ColocarFechas();
  }

  async ColocarFechas() {
    this.GetSalones().then(() => {
      console.log(this.salones);
      this.mes = ((new Date()).getMonth()) + 1;
      this.anio = ((new Date()).getFullYear());
      this.fechaCalendarioMin = "2022-" + this.mes + "-01T00:00:00";
      this.fechaCalendarioMax = "2022-" + this.mes + "-01T00:00:00";
      let mesR: number;
      let diaR: number;
      let diasN = new Array();
  
      let response = this.reservarService.getReservacionesSalonMes(this.salones[this.contador].Id, this.mes.toString());
  
      response.subscribe(data => {
        console.log(data);
        
        this.reservaciones = <Array<any>>data;
        
        if (this.reservaciones.length > 0) {
          for (let i = 0; i < this.reservaciones.length; i++) {
  
            mesR = Number.parseInt((this.reservaciones[i].fecha).substring(5, 7));
            if (mesR == this.mes) {
  
              
              diasN.push(this.reservaciones[i].fecha);
            }
          }
        }
        this.dias = diasN;
  
      });
  


    });
    



  }

  OrdenarReservaciones() {
    this.ReservacionesOrdenadas = new Array();
    let fecha: number;
    let fecha1: number;
    let bandera = false;
    //console.log(this.reservaciones.length);
    for (let i = 0; i < this.reservaciones.length; i++) {
      bandera = false;
      if (i == 0) {
        //  console.log("ReservacionesOrdenadas.lenght=="+this.ReservacionesOrdenadas.length);
        this.ReservacionesOrdenadas.push(this.reservaciones[i]);
      }
      else {

        fecha1 = Number.parseInt(this.reservaciones[i].fecha.substring(8, 10));
        // console.log(this.ReservacionesOrdenadas.length);

        for (let q = 0; q < this.ReservacionesOrdenadas.length; q++) {

          fecha = Number.parseInt(this.ReservacionesOrdenadas[q].fecha.substring(8, 10));




          if (fecha1 <= fecha) {

            this.ReservacionesOrdenadas.splice(q, 0, this.reservaciones[i]);
            bandera = true;

            break;
            // if(q==6)break;
          }






        }
        if (!bandera) {
          this.ReservacionesOrdenadas.push(this.reservaciones[i]);
        }



      }

    }
    //  console.log(this.ReservacionesOrdenadas);

  }
  async presentToast(message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 1500,
      position: 'bottom'
    });

    await toast.present();
  }
  doRefresh(event: any) {
    setTimeout(() => {
      this.GetSalones();
      location.reload();
      event.target.complete();
    }, 1000);
  }


  //Funciones Modal 
  cancel() {
    this.modal.dismiss(null, 'cancel');

  }
  confirm() {
    this.modal.dismiss('confirm');
  }
  onWillDismiss() {
    const ev = event as CustomEvent<OverlayEventDetail<string>>;
    if (ev.detail.role === 'confirm') {

    }
  }
}
