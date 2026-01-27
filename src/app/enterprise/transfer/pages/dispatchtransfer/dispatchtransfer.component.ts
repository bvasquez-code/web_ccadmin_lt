import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { DataSesionService } from 'src/app/enterprise/compartido/service/datasesion.service';
import { ActionModalConfirmService } from 'src/app/enterprise/shared/interface/ActionModalConfirmService';
import { ResponseWsDto } from 'src/app/enterprise/shared/model/dto/ResponseWsDto';
import { TransferDetailDto } from '../../model/dto/TransferDetailDto';
import { TransferDispatchDto } from '../../model/dto/TransferDispatchDto';
import { TransferDetEntity } from '../../model/entity/TransferDetEntity';
import { TransferService } from '../../service/TransferService';

@Component({
  selector: 'app-dispatchtransfer',
  templateUrl: './dispatchtransfer.component.html'
})
export class DispatchtransferComponent implements OnInit, ActionModalConfirmService {

  @ViewChild('cboTransportMode') cboTransportMode!: ElementRef<HTMLSelectElement>;
  @ViewChild('cboReason') cboReason!: ElementRef<HTMLSelectElement>;
  @ViewChild('txtVehiclePlate') txtVehiclePlate!: ElementRef<HTMLInputElement>;
  @ViewChild('txtDriverDocType') txtDriverDocType!: ElementRef<HTMLInputElement>;
  @ViewChild('txtDriverDocNumber') txtDriverDocNumber!: ElementRef<HTMLInputElement>;
  @ViewChild('txtDriverLicenseNumber') txtDriverLicenseNumber!: ElementRef<HTMLInputElement>;
  @ViewChild('txtCarrierRuc') txtCarrierRuc!: ElementRef<HTMLInputElement>;
  @ViewChild('txtCarrierName') txtCarrierName!: ElementRef<HTMLInputElement>;
  @ViewChild('txtObservation') txtObservation!: ElementRef<HTMLTextAreaElement>;

  TransferCod: string = '';
  transferDetail: TransferDetailDto = new TransferDetailDto();
  detailList: TransferDetEntity[] = [];

  transportModeList = [
    { Code: '01', Name: 'Transporte público' },
    { Code: '02', Name: 'Transporte privado' }
  ];

  reasonTransferList = [
    { Code: '01', Name: 'Venta' },
    { Code: '02', Name: 'Compra' },
    { Code: '03', Name: 'Consignación' },
    { Code: '04', Name: 'Traslado entre locales' }
  ];

  constructor(
    private transferService: TransferService,
    private session: DataSesionService,
    private router: Router,
    private toastrService: ToastrService
  ) {
    let urlTree: any = this.router.parseUrl(this.router.url);
    this.TransferCod = (urlTree.queryParams['TransferCod']) ? urlTree.queryParams['TransferCod'] : '';
  }

  ngOnInit(): void {
    this.loadDetail();
  }

  actionModal(ModalId: string): void {
    if (ModalId === 'modal_dispatch') {
      this.dispatchTransfer();
    }
  }

  async loadDetail() {
    const rpt: ResponseWsDto = await this.transferService.FindDataForm(this.TransferCod);
    if (!rpt.ErrorStatus) {
      this.transferDetail = rpt.Data ?? rpt.DataAdditional?.find((e: any) => e.Name === 'TransferDetail')?.Data ?? new TransferDetailDto();
      this.detailList = this.transferDetail.transferDetTeList.length > 0
        ? this.transferDetail.transferDetTeList
        : this.transferDetail.transferDetTsList;

      const transportModeList = rpt.DataAdditional?.find((e: any) => e.Name === 'TransportModeList')?.Data
        ?? rpt.DataAdditional?.find((e: any) => e.Name === 'transportModeList')?.Data
        ?? [];
      if (transportModeList.length > 0) {
        this.transportModeList = transportModeList;
      }

      const reasonList = rpt.DataAdditional?.find((e: any) => e.Name === 'ReasonTransferList')?.Data
        ?? rpt.DataAdditional?.find((e: any) => e.Name === 'reasonTransferList')?.Data
        ?? [];
      if (reasonList.length > 0) {
        this.reasonTransferList = reasonList;
      }
    }
  }

  async dispatchTransfer() {
    const request: TransferDispatchDto = new TransferDispatchDto();
    request.transferCod = this.TransferCod;
    request.user = this.session.getSessionStorageDto().UserCod;
    request.transportModeCod = this.cboTransportMode?.nativeElement.value ?? '';
    request.reasonTransferCod = this.cboReason?.nativeElement.value ?? '';
    request.vehiclePlate = this.txtVehiclePlate?.nativeElement.value ?? '';
    request.driverDocType = this.txtDriverDocType?.nativeElement.value ?? '';
    request.driverDocNumber = this.txtDriverDocNumber?.nativeElement.value ?? '';
    request.driverLicenseNumber = this.txtDriverLicenseNumber?.nativeElement.value ?? '';
    request.carrierRuc = this.txtCarrierRuc?.nativeElement.value ?? '';
    request.carrierName = this.txtCarrierName?.nativeElement.value ?? '';
    request.observation = this.txtObservation?.nativeElement.value ?? '';

    const rpt: ResponseWsDto = await this.transferService.DispatchTransfer(request);

    if (!rpt.ErrorStatus) {
      this.toastrService.success(rpt.Message || 'Transferencia despachada correctamente');
      setTimeout(() => {
        this.router.navigate(['/enterprise/transfer/pages/listtransferdispatch']);
      }, 1000);
    } else {
      this.toastrService.error(rpt.Message || 'No se pudo despachar la transferencia');
    }
  }
}
