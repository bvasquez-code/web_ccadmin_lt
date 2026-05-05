import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ResponseWsDto } from 'src/app/enterprise/shared/model/dto/ResponseWsDto';
import { TransferDetailDto } from '../../model/dto/TransferDetailDto';
import { TransferRequestService } from '../../service/TransferRequestService';
import { StoreEntity } from 'src/app/enterprise/shared/model/entity/StoreEntity';
import { TransferRequestDetailDto } from '../../model/dto/TransferRequestDetailDto';

@Component({
  selector: 'app-transferdetail',
  templateUrl: './transferdetail.component.html'
})
export class TransferdetailComponent implements OnInit {

  TransferCod: string = '';
  transferDetail: TransferRequestDetailDto = new TransferRequestDetailDto();
  storeList: StoreEntity[] = [];

  statusHtml: any = {
    P: 'badge badge-sm bgc-red-d1 text-white pb-1 px-25',
    C: 'badge badge-sm bgc-info-d1 text-white pb-1 px-25',
    D: 'badge badge-sm bgc-warning-d1 text-white pb-1 px-25',
    F: 'badge badge-sm bgc-success-d1 text-white pb-1 px-25',
    R: 'badge badge-sm bgc-dark text-white pb-1 px-25',
    X: 'badge badge-sm bgc-secondary text-white pb-1 px-25',
    A: 'badge badge-sm bgc-secondary text-white pb-1 px-25'
  };

  statusMask: any = {
    P: 'Pendiente',
    C: 'Confirmada',
    D: 'Despachada',
    F: 'Finalizada',
    R: 'Rechazada',
    X: 'Anulada',
    A: 'Aprobada'
  };

  constructor(
    private transferService: TransferRequestService,
    private router: Router
  ) {
    let urlTree: any = this.router.parseUrl(this.router.url);
    this.TransferCod = (urlTree.queryParams['TransferCod']) ? urlTree.queryParams['TransferCod'] : '';
  }

  ngOnInit(): void {
    this.loadDetail();
  }

  async loadDetail() {

    const rpt: ResponseWsDto = await this.transferService.FindDataForm(this.TransferCod);
    if (!rpt.ErrorStatus) {
      this.transferDetail = rpt.DataAdditional?.find(e => e.Name === 'transferDetail')?.Data ?? new TransferDetailDto();
      this.storeList = rpt.DataAdditional?.find(e => e.Name === 'storeList')?.Data ?? [];
    }
  }

  getStoreDescription(storeCod: string): string {
    const store: StoreEntity | any = this.storeList.find(e => e.StoreCod === storeCod);
    return store?.StoreCod + ' - ' + store?.Name;
  }


}
