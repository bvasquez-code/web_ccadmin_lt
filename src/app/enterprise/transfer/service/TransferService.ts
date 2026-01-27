import { Injectable } from "@angular/core";
import { AppSetting } from "src/app/config/app.setting";
import { ApiService } from "../../compartido/service/api.service";
import { ResponseWsDto } from "../../shared/model/dto/ResponseWsDto";
import { TransferDispatchDto } from "../model/dto/TransferDispatchDto";
import { TransferReceiveDto } from "../model/dto/TransferReceiveDto";
import { TransferRegisterBundleDto } from "../model/dto/TransferRegisterBundleDto";
import { TransferSearchDto } from "../model/dto/TransferSearchDto";

@Injectable({
    providedIn: 'root'
})
export class TransferService {

    constructor(private apiService: ApiService) {
    }

    async FindAll(Search: TransferSearchDto): Promise<ResponseWsDto> {
        const url: string = `${AppSetting.API}/api/v1/transfers/findAll`;
        return await this.apiService.ExecuteGetService(url, Search);
    }

    async FindById(TransferCod: string): Promise<ResponseWsDto> {
        const url: string = `${AppSetting.API}/api/v1/transfers/${TransferCod}`;
        return await this.apiService.ExecuteGetService(url, {});
    }

    async RegisterBundle(Entity: TransferRegisterBundleDto): Promise<ResponseWsDto> {
        const url: string = `${AppSetting.API}/api/v1/transfers/register-bundle`;
        return await this.apiService.ExecutePostService(url, Entity);
    }

    async FindDataForm(TransferCod: string): Promise<ResponseWsDto> {
        const url: string = `${AppSetting.API}/api/v1/transfers/findDataForm`;
        return await this.apiService.ExecuteGetService(url, { transferCod: TransferCod });
    }

    async FindDataPrint(TransferCod: string): Promise<ResponseWsDto> {
        const url: string = `${AppSetting.API}/api/v1/transfers/findDataPrint`;
        return await this.apiService.ExecuteGetService(url, { transferCod: TransferCod });
    }

    async DispatchTransfer(Request: TransferDispatchDto): Promise<ResponseWsDto> {
        const url: string = `${AppSetting.API}/api/v1/transfers/dispatch`;
        return await this.apiService.ExecutePostService(url, Request);
    }

    async ReceiveTransfer(Request: TransferReceiveDto): Promise<ResponseWsDto> {
        const url: string = `${AppSetting.API}/api/v1/transfers/receive`;
        return await this.apiService.ExecutePostService(url, Request);
    }

    async RejectTransfer(Request: TransferReceiveDto): Promise<ResponseWsDto> {
        const url: string = `${AppSetting.API}/api/v1/transfers/reject`;
        return await this.apiService.ExecutePostService(url, Request);
    }

    async CancelTransfer(Request: TransferReceiveDto): Promise<ResponseWsDto> {
        const url: string = `${AppSetting.API}/api/v1/transfers/cancel`;
        return await this.apiService.ExecutePostService(url, Request);
    }
}
