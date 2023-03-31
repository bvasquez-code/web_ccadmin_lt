import { Injectable } from "@angular/core";
import { AppSetting } from "src/app/config/app.setting";
import { ApiService } from "../../compartido/service/api.service";
import { ResponseWsDto } from "../../shared/model/dto/ResponseWsDto";

@Injectable({
    providedIn: 'root'
})

export class ProductService
{

    constructor(private apiService: ApiService) {
    }

    async findDetailById(Request: any)
    {
        let url: string = `${AppSetting.API}/api/v1/product/findDetailById`;
        let RespuestaWS : ResponseWsDto;

        RespuestaWS = await this.apiService.ExecuteGetService(url,Request);

        return RespuestaWS;
    }
}