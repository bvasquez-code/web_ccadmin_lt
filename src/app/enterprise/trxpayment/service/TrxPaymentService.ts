import { Injectable } from "@angular/core";
import { AppSetting } from "src/app/config/app.setting";
import { ApiService } from "../../compartido/service/api.service";
import { ICrudService } from "../../shared/interface/ICrudService";
import { ResponseWsDto } from "../../shared/model/dto/ResponseWsDto";
import { SearchDto } from "../../shared/model/dto/SearchDto";
import { TrxPaymentEntity } from "../model/entity/TrxPaymentEntity";

@Injectable({
    providedIn: 'root'
})
export class TrxPaymentService implements ICrudService<TrxPaymentEntity,number>{

    constructor(private apiService: ApiService) {
    }
    
    FindById(Id: number): Promise<ResponseWsDto> {
        throw new Error("Method not implemented.");
    }

    FindAll(Search: SearchDto): Promise<ResponseWsDto> {
        throw new Error("Method not implemented.");
    }

    async Save(TrxPayment: TrxPaymentEntity): Promise<ResponseWsDto> {
        let url: string = `${AppSetting.API}/api/v1/TrxPayment/save`;
        let RespuestaWS : ResponseWsDto;

        RespuestaWS = await this.apiService.ExecutePostService(url,TrxPayment);

        return RespuestaWS;
    }

    SaveAll(EntityList: TrxPaymentEntity[]): Promise<ResponseWsDto> {
        throw new Error("Method not implemented.");
    }

    FindAllById(IdList: number[]): Promise<ResponseWsDto> {
        throw new Error("Method not implemented.");
    }


    async FindDataForm(): Promise<ResponseWsDto> {
        let url: string = `${AppSetting.API}/api/v1/TrxPayment/findDataForm`;
        let RespuestaWS : ResponseWsDto;

        RespuestaWS = await this.apiService.ExecuteGetService(url,{});

        return RespuestaWS;
    }
}
