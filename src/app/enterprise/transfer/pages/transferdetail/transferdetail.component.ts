import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ResponseWsDto } from 'src/app/enterprise/shared/model/dto/ResponseWsDto';
import { TransferDetailDto } from '../../model/dto/TransferDetailDto';
import { TransferService } from '../../service/TransferService';

@Component({
  selector: 'app-transferdetail',
  templateUrl: './transferdetail.component.html'
})
export class TransferdetailComponent implements OnInit {

  TransferCod: string = '';
  transferDetail: TransferDetailDto = new TransferDetailDto();

  constructor(
    private transferService: TransferService,
    private router: Router
  ) {
    let urlTree: any = this.router.parseUrl(this.router.url);
    this.TransferCod = (urlTree.queryParams['TransferCod']) ? urlTree.queryParams['TransferCod'] : '';
  }

  ngOnInit(): void {
    this.loadDetail();
  }

  async loadDetail() {
    const rpt: ResponseWsDto = await this.transferService.FindDataPrint(this.TransferCod);

    if (!rpt.ErrorStatus) {
      this.transferDetail = rpt.Data ?? rpt.DataAdditional?.find((e: any) => e.Name === 'TransferDetail')?.Data ?? new TransferDetailDto();
      return;
    }

    const fallback: ResponseWsDto = await this.transferService.FindDataForm(this.TransferCod);
    if (!fallback.ErrorStatus) {
      this.transferDetail = fallback.Data ?? fallback.DataAdditional?.find((e: any) => e.Name === 'TransferDetail')?.Data ?? new TransferDetailDto();
    }
  }
}
