import { Component, OnInit, ViewChild } from '@angular/core';
import { ReservarService } from '../services/reservar/reservar.service';
import { IonModal } from '@ionic/angular';
import { OverlayEventDetail } from '@ionic/core/components';
import { ModificacionesServiceService } from '../services/Modificaciones/modificaciones-service.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-modificar',
  templateUrl: './modificar.page.html',
  styleUrls: ['./modificar.page.scss'],
})
export class ModificarPage implements OnInit {
  @ViewChild(IonModal) modal!: IonModal;
  salas: Array<any>;
  isOpen: boolean
  Nombre: string
  Descripcion: string;
  Contrasena: string
  Id: number;
  ContrasenaSala: string;
  opcion: number;
  opcionTexto: string;
  constructor(private reservarService: ReservarService, private modificarService: ModificacionesServiceService, private activatedRoute: ActivatedRoute) {
    this.isOpen = false;
    this.Nombre = "";
    this.Descripcion = "";
    this.Contrasena = "";
    this.Id = 0;
    this.salas = [];
    this.ContrasenaSala = "";
    this.opcion = 0;
    this.opcionTexto = "Editar";
  }

  ngOnInit() {
    this.opcion = Number.parseInt(this.activatedRoute.snapshot.paramMap.get('op') as string);
    if (this.opcion == 1) {
      this.opcionTexto = "Editar";
    } else {
      this.opcionTexto = "Eliminar";
    }
    this.GetSalones().then(result => {
      console.log(this.salas);
    });
  }

  async GetSalones() {



    let respons = this.reservarService.GetSalones();

    return new Promise<void>((resolve, reject) => {
      respons.subscribe(async (data) => {
        let salonesL = <Array<any>>data;
        if (salonesL.length > 0) {
          this.salas = await salonesL;
          resolve();

        }


      })
    });
  }


  ShowModal(sala: any) {
    this.isOpen = true;
    this.Nombre = sala.Nombre
    this.Descripcion = sala.Descripcion;
    this.Id = sala.Id;
    this.ContrasenaSala = sala.Contrasena;
  }


  cancel() {
    this.isOpen = false;
    this.Nombre = "";
    this.Descripcion = "";
    this.Contrasena = "";
    this.Id = 0;

    this.ContrasenaSala = "";
    this.modal.dismiss(null, 'cancel');
  }

  async confirm() {

    if (this.Contrasena == this.ContrasenaSala) {
      if (this.opcion == 1) {
        let respuesta = this.modificarService.ModificarSalon(this.Nombre, this.Descripcion, this.Id);
        (await respuesta).subscribe((data) => {

          if (data.correcto == true) {
            this.isOpen = false;
            this.Nombre = "";
            this.Descripcion = "";
            this.Contrasena = "";
            this.Id = 0;

            this.ContrasenaSala = "";
            this.ngOnInit();
          }
        });

      }else{
        let respuesta = this.modificarService.EliminarSalon(this.Id);
        (await respuesta).subscribe((data:any) => {

          if (data.correcto == true) {
            this.isOpen = false;
            this.Nombre = "";
            this.Descripcion = "";
            this.Contrasena = "";
            this.Id = 0;

            this.ContrasenaSala = "";
            this.ngOnInit();
          }
        });
      }
    }







  }

  onWillDismiss(event: Event) {
    const ev = event as CustomEvent<OverlayEventDetail<string>>;
    if (ev.detail.role === 'confirm') {

    }
  }






  doRefresh(event: any) {
    setTimeout(() => {
      this.GetSalones();
      location.reload();
      event.target.complete();
    }, 1000);
  }
}
