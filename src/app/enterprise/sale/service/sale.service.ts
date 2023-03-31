import { Injectable } from "@angular/core";
import { AppSetting } from "src/app/config/app.setting";
import { ApiService } from "../../compartido/service/api.service";
import { ResponseWsDto } from "../../shared/model/dto/ResponseWsDto";
import { PresaleRegisterDto } from "../model/dto/PresaleRegisterDto";

@Injectable({
    providedIn: 'root'
})
export class SaleService
{
    constructor(private apiService: ApiService) {
    }

    async findDataForm(SaleCod : string)
    {
        let url: string = `${AppSetting.API}/api/v1/sale/findDataForm`;
        let RespuestaWS : ResponseWsDto;

        RespuestaWS = await this.apiService.ExecuteGetService(url,{ SaleCod : SaleCod });

        return RespuestaWS;
    }
}