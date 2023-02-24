import { Component, ViewChild } from '@angular/core';
import { AlertController, IonModal } from '@ionic/angular';
import { ReservarService } from '../services/reservar/reservar.service';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {
  @ViewChild(IonModal) modal3!: IonModal;

  salones: string | any[] | undefined;




  nombreReservante!: string;
  grupo!: string;
  banderaValidacionOcupado!: boolean;
  contador: number;

  FechaSeleccionada!: Date;
  HoraInicio: any;
  HoraFin: any;
  fecha: Date
  fechaFormateadaI: string;
  fechaFormateadaF: string;
  fechaMax: string;
  banderOcupado!: boolean;
  contrasena!: string;

  constructor(private alertController: AlertController
    , private reservarService: ReservarService
  ) {

    this.GetSalones();
    this.fecha = new Date();


    this.contador = 0;
    this.fechaFormateadaI = "2022-10-07T" + (this.fecha.getHours() < 10 ? "0" + this.fecha.getHours() : this.fecha.getHours()) + ":" + (this.fecha.getMinutes() < 10 ? "0" + this.fecha.getMinutes() : this.fecha.getMinutes()) + ":00-23:00";


    if(this.fecha.getHours() +2>=24){
      this.fechaFormateadaF = "2022-10-07T" + (this.fecha.getHours() < 10 ? "0" + this.fecha.getHours() : this.fecha.getHours()) + ":" + (this.fecha.getMinutes() < 10 ? "0" + this.fecha.getMinutes() : this.fecha.getMinutes()) + ":00-23:00";
    this.fechaMax =  "2022-10-07T" + (this.fecha.getHours() < 10 ? "0" + this.fecha.getHours() : this.fecha.getHours()) + ":" + (this.fecha.getMinutes() < 10 ? "0" + this.fecha.getMinutes() : this.fecha.getMinutes()) + ":00-23:00";

    }else{
      this.fechaFormateadaF = "2022-10-07T" + (this.fecha.getHours() + 2 < 10 ? "0" + (this.fecha.getHours() + 2) : this.fecha.getHours() + 2) + ":" + (this.fecha.getMinutes() < 10 ? "0" + this.fecha.getMinutes() : this.fecha.getMinutes()) + ":00-23:00";
      this.fechaMax = "2022-10-07T" + (this.fecha.getHours() + 2 < 10 ? "0" + (this.fecha.getHours() + 2) : this.fecha.getHours() + 2) + ":59:00-23:00";
    }
    
  }
  ngOnInit() {
    this.GetSalones();
  }


  async NotificarErrorEnFecha(){
    const alert = await this.alertController.create({
      header: 'Error ',
      message: "Tiempo mayor a 2hrs.",
      buttons: [

        {
          text: 'OK',
          role: 'confirm'

        },
      ],
    });

    await alert.present();
  }

  //verificar tiempo de reserva
  VerificarTiempo() {
    let horaI = Number.parseInt(this.fechaFormateadaI.substring(11, 13));
    let minutosI = Number.parseInt(this.fechaFormateadaI.substring(14, 16));
    let HoraF = Number.parseInt(this.fechaFormateadaF.substring(11, 13));
    let minutosF = Number.parseInt(this.fechaFormateadaF.substring(14, 16));

    console.log(HoraF +">" +(horaI + 2));
    if (HoraF > (horaI + 2)) {
      this.NotificarErrorEnFecha();
      return false
    } else {
      if (HoraF == (horaI + 2)) {
        if (minutosF > minutosI) {
          this.NotificarErrorEnFecha();
          return false
        } else {
          return true;

        }

      }else{
        return true;
      }
    }
  }

  async GetSalones() {
      let response = this.reservarService.GetSalones();
      await response.subscribe(async (data: []) => {
        if (data.length != 0) {
          this.salones = data

        } else {
          this.salones = [];
        }


      });



    }


    CambiarSalonF() {
      if ((this.contador + 1) == this.salones!.length) {
        this.contador = 0;
      } else {
        this.contador++;
      }

    }
    CambiarSalonR() {
      if ((this.contador - 1) == -1) {
        this.contador = this.salones!.length - 1;
      } else {
        this.contador--;
      }
    }

 
  async InfoCodigo() {
    
      // console.log("Guardar");
      this.VerificarOcupacion().then(async () => {
        //console.log(this.banderaValidacionOcupado);
        if (this.banderaValidacionOcupado && await this.VerificarInformacion() && this.VerificarTiempo()) {


          if (this.contrasena != "") {


            
            




            //Llamar servicio de guardado de datos


            let fecha = (<HTMLInputElement>document.getElementById("fecha")).value.substring(0, 10);
            let horaI = (<HTMLInputElement>document.getElementById("datetime2")).value.substring(11, 16);
            let horaF = (<HTMLInputElement>document.getElementById("datetime1")).value.substring(11, 16)

            
             let result = this.reservarService.Guardar(this.nombreReservante, fecha, horaI, horaF, this.salones![this.contador].Id, this.contrasena);
              
        
              (await result).subscribe(async (data:any) => {
                if (data) {
                  const alert1 = await this.alertController.create({
                    header: 'Reservación exitosa',
        
                    buttons: [
        
                      {
                        text: 'OK',
                        role: 'confirm'
        
                      },
                    ],
                  });
                  await alert1.present();
        
                  const { role } = await alert1.onDidDismiss();
                  this.nombreReservante = "";
                  this.grupo = "";
                  this.contrasena="";
                  (<HTMLInputElement>document.getElementById("fecha")).value = "";
                }
              });

          }
          else {
            const alert = await this.alertController.create({
              header: 'Coloque contraseña',
              message: "contraseña necesaria para borrar reunión",
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



        }

      });
    }

  async VerificarOcupacion() {


      return new Promise<void>(async (resolve, reject) => {

        if ((<HTMLInputElement>document.getElementById("fecha")).value == undefined) {
          const alert = await this.alertController.create({
            header: 'Error ',
            message: "Seleccione fecha",
            buttons: [

              {
                text: 'OK',
                role: 'confirm'

              },
            ],
          });

          await alert.present();

          const { role } = await alert.onDidDismiss();

          this.banderaValidacionOcupado = false;
          resolve();
        } else {


          //llamar servicio de consultar datos
          let fecha = (<HTMLInputElement>document.getElementById("fecha")).value.substring(0, 10);

          let response = await this.reservarService.getReservacionesSalonFecha(this.salones![this.contador].Id, fecha);

          try {
            response.subscribe(async (data: any) => {
              console.log(data);
              let reservaciones = <Array<any>>data;

              if (reservaciones.length == 0) {
                this.banderaValidacionOcupado = true;
                resolve();
              } else {






                //Verificación de ocupación para la entrada. 
                let horas = Number.parseInt((<HTMLInputElement>document.getElementById("datetime2")).value.substring(11, 13));
                let minutos = Number.parseInt((<HTMLInputElement>document.getElementById("datetime2")).value.substring(14, 16));
                let horasF = Number.parseInt((<HTMLInputElement>document.getElementById("datetime1")).value.substring(11, 13));
                let minutosF = Number.parseInt((<HTMLInputElement>document.getElementById("datetime1")).value.substring(14, 16));

                if (this.ValidarHoras(horas, minutos, horasF, minutosF)) {

                  let banderOcupadoFin = false;

                  this.banderOcupado = false;
                  for (let i = 0; i < reservaciones.length; i++) {

                    //hora==HoraReservacion y minutos>=HoraReservada  <------|HoraSeleccioanda----------HoraSeleccioanda|
                    if (horas == Number.parseInt(reservaciones[i].horaI.substring(0, 2)) && minutos >= Number.parseInt(reservaciones[i].horaI.substring(3, 5))) {
                      this.banderOcupado = true;
                    }
                    //hora>HoraReservacion y hora<=HoraReservada  |HoraSeleccioanda----------HoraSeleccioanda|------->
                    if (horas > Number.parseInt(reservaciones[i].horaI.substring(0, 2)) && horas < Number.parseInt(reservaciones[i].horaf.substring(0, 2))) {
                      this.banderOcupado = true;
                    }
                    //hora==HoraReservacionFin y minutos<minutosDeHoraReservada  |HoraSeleccioanda----------HoraSeleccioanda|------->
                    if (horas == Number.parseInt(reservaciones[i].horaf.substring(0, 2)) && minutos < Number.parseInt(reservaciones[i].horaf.substring(3, 5))) {
                      this.banderOcupado = true;
                    }


                    //Verificación para la hora de salida.


                    if (!this.banderOcupado)
                      if (horas >= Number.parseInt(reservaciones[i].horaf.substring(0, 2))) {

                      } else {
                        //hora==HoraReservacion y minutos>=HoraReservada  <------|HoraSeleccioanda
                        if (horasF == Number.parseInt(reservaciones[i].horaI.substring(0, 2)) && minutosF > Number.parseInt(reservaciones[i].horaI.substring(3, 5))) {
                          banderOcupadoFin = true;
                        }

                        if (horasF > Number.parseInt(reservaciones[i].horaI.substring(0, 2))) {
                          banderOcupadoFin = true;
                        }


                      }

                  }

















                  if (this.banderOcupado) {
                    document.getElementById("InicioOcupado")!.classList.remove("d-none");
                  } else {
                    !document.getElementById("InicioOcupado")!.classList.contains("d-none") ? document.getElementById("InicioOcupado")!.classList.add("d-none") : document.getElementById("InicioOcupado")!.classList;

                  }


                  if (banderOcupadoFin) {
                    document.getElementById("FinOcupado")!.classList.remove("d-none");
                  } else {
                    !document.getElementById("FinOcupado")!.classList.contains("d-none") ? document.getElementById("FinOcupado")!.classList.add("d-none") : document.getElementById("FinOcupado")!.classList;

                  }

                  !banderOcupadoFin && !this.banderOcupado ? this.banderaValidacionOcupado = true : this.banderaValidacionOcupado = false;
                  resolve();
                } else {
                  const alert1 = await this.alertController.create({
                    header: 'Error',
                    message: 'Hora de finalización menor o igual a la hora de Inicio.',
                    buttons: [

                      {
                        text: 'OK',
                        role: 'confirm'

                      },
                    ],
                  });
                  await alert1.present();

                  const { role } = await alert1.onDidDismiss();
                  this.banderaValidacionOcupado = false
                  resolve();
                }
              }
            });
          } catch (e) {
            //  console.log(e);
            resolve();
          }

        }


      });












    }

    ValidarHoras(horaI: number, minutosI: number, horaF: number, minutosF: number) {
      if (horaI > horaF) {
        return false
      }
      if (horaI == horaF && minutosI >= minutosF) {
        return false;
      }
      return true;


    }
  async VerificarInformacion() {
      if (this.nombreReservante == "" || this.nombreReservante == undefined || this.contrasena == "" || this.contrasena == undefined) {

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
        return false;
      } else return true;

    }



    doRefresh(event: any){
      setTimeout(() => {
        this.GetSalones();
        location.reload();
        event.target.complete();
      }, 1000);
    }


  }
