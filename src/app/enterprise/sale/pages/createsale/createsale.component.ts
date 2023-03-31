import { Component } from '@angular/core';
import { SaleService } from '../../service/sale.service';
import { Router } from '@angular/router';
import { SaleDetailDto } from '../../model/dto/SaleDetailDto';
import { ResponseWsDto } from 'src/app/enterprise/shared/model/dto/ResponseWsDto';

@Component({
  selector: 'app-createsale',
  templateUrl: './createsale.component.html'
})
export class CreatesaleComponent {

  SaleCod : string = "";
  SaleDetail : SaleDetailDto = new SaleDetailDto();
  ItemCount : number = 0;

  constructor(
     private saleservice : SaleService
    ,private router: Router
  )
  {
    let urlTree : any = this.router.parseUrl(this.router.url);
    this.SaleCod =  urlTree.queryParams['SaleCod'];
    this.findDataForm(this.SaleCod);
  }

  async findDataForm(SaleCod : string)
  {
    const rpt : ResponseWsDto = await this.saleservice.findDataForm(SaleCod);

    if( !rpt.ErrorStatus )
    {
      this.SaleDetail = rpt.DataAdditional.find( e => e.Name = "SaleDetail" )?.Data;
    }
  }

  getItemCount():number
  {
    this.ItemCount++;
    return this.ItemCount;
  }
}
