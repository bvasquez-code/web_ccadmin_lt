import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { DataSesionService } from 'src/app/enterprise/compartido/service/datasesion.service';
import { ActionModalConfirmService } from 'src/app/enterprise/shared/interface/ActionModalConfirmService';
import { ResponseWsDto } from 'src/app/enterprise/shared/model/dto/ResponseWsDto';
import { TransferDetailDto } from '../../model/dto/TransferDetailDto';
import { TransferReceiveDto } from '../../model/dto/TransferReceiveDto';
import { TransferDetEntity } from '../../model/entity/TransferDetEntity';
import { TransferService } from '../../service/TransferService';

@Component({
  selector: 'app-receivetransfer',
  templateUrl: './receivetransfer.component.html'
})
export class ReceivetransferComponent implements OnInit, ActionModalConfirmService {

  @ViewChild('txtObservation') txtObservation!: ElementRef<HTMLTextAreaElement>;

  TransferCod: string = '';
  transferDetail: TransferDetailDto = new TransferDetailDto();
  detailList: TransferDetEntity[] = [];

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
    if (ModalId === 'modal_receive') {
      this.receiveTransfer();
    }
  }

  async loadDetail() {
    const rpt: ResponseWsDto = await this.transferService.FindDataForm(this.TransferCod);
    if (!rpt.ErrorStatus) {
      this.transferDetail = rpt.Data ?? rpt.DataAdditional?.find((e: any) => e.Name === 'TransferDetail')?.Data ?? new TransferDetailDto();
      this.detailList = this.transferDetail.transferDetTsList.length > 0
        ? this.transferDetail.transferDetTsList
        : this.transferDetail.transferDetTeList;
    }
  }

  async receiveTransfer() {
    const request: TransferReceiveDto = new TransferReceiveDto();
    request.transferCod = this.TransferCod;
    request.user = this.session.getSessionStorageDto().UserCod;
    request.observation = this.txtObservation?.nativeElement.value ?? '';

    const rpt: ResponseWsDto = await this.transferService.ReceiveTransfer(request);

    if (!rpt.ErrorStatus) {
      this.toastrService.success(rpt.Message || 'Transferencia recibida correctamente');
      setTimeout(() => {
        this.router.navigate(['/enterprise/transfer/pages/listtransferrequest']);
      }, 1000);
    } else {
      this.toastrService.error(rpt.Message || 'No se pudo recepcionar la transferencia');
    }
  }
}
