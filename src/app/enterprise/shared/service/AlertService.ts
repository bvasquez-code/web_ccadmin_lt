
import {Injectable} from '@angular/core';
import Swal, { SweetAlertResult } from 'sweetalert2';

@Injectable({
    providedIn: 'root'
})
export class AlertService
{


    waring(text : string = "Esta acción no podra ser revertida",title : string = "¿Estás seguro?") : Promise<SweetAlertResult<any>>
    {
        return Swal.fire({
            title: title,
            text: text,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, confirmar',
            cancelButtonText: 'No, cancelar'
        });
    }

}