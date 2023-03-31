import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { RespuestaWsDto } from '../entity/RespuestaWsDto';
import { SessionStorageDto } from '../entity/SessionStorageDto';


@Injectable({
    providedIn: 'root'
})
export class DataSesionService {

    private g_SessionStorageDto : SessionStorageDto = new SessionStorageDto();

    constructor()
    {
        this.cargarInfoSesion();
    }

    private cargarInfoSesion()
    {
        this.g_SessionStorageDto.Token = this.ObtenerKeySesion( sessionStorage.getItem('Token') );
        this.g_SessionStorageDto.UserCod = this.ObtenerKeySesion( sessionStorage.getItem('UserCod') );
        this.g_SessionStorageDto.PersonCod = this.ObtenerKeySesion( sessionStorage.getItem('PersonCod') );
        this.g_SessionStorageDto.Email = this.ObtenerKeySesion( sessionStorage.getItem('Email') );
        this.g_SessionStorageDto.SessionID = Number(this.ObtenerKeySesion( sessionStorage.getItem('SessionID') ));
        this.g_SessionStorageDto.StoreCod = this.ObtenerKeySesion( sessionStorage.getItem('StoreCod') );
        this.g_SessionStorageDto.Names = this.ObtenerKeySesion( sessionStorage.getItem('Names') );
    }

    private ObtenerKeySesion( valor : any ) : string
    {
        if( valor)
        {
            return valor;
        }

        return "";
    }

    getSessionStorageDto()
    {
        return this.g_SessionStorageDto;
    }

}