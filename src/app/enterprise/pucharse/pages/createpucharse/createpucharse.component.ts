import { Component, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { IRegisterForm } from 'src/app/enterprise/shared/interface/IRegisterForm';
import { PucharseRequestRegisterDto } from '../../model/dto/PucharseRequestRegisterDto';
import { PucharseRequestHeadService } from '../../service/PucharseRequestHeadService';
import { ToastrService } from 'ngx-toastr';
import { ProductService } from 'src/app/enterprise/product/service/product.service';
import { ResponseWsDto } from 'src/app/enterprise/shared/model/dto/ResponseWsDto';
import { ProductEntity } from 'src/app/enterprise/product/model/entity/ProductEntity';
import { ResponsePageSearch } from 'src/app/enterprise/shared/model/dto/ResponsePageSearch';
import { PucharseRequestDetEntity } from '../../model/entity/PucharseRequestDetEntity';
import { DataSesionService } from 'src/app/enterprise/compartido/service/datasesion.service';
import { ProductInfoDto } from 'src/app/enterprise/product/model/dto/ProductInfoDto';
import { PucharseRequestDetailsDto } from '../../model/dto/PucharseRequestDetailsDto';

@Component({
  selector: 'app-createpucharse',
  templateUrl: './createpucharse.component.html'
})
export class CreatepucharseComponent implements IRegisterForm<PucharseRequestRegisterDto,string> {

  @ViewChild('txtSearch') txtSearch!: ElementRef<HTMLInputElement>;
  @ViewChild('txtNumUnit') txtNumUnit!: ElementRef<HTMLInputElement>;
  @ViewChild('txtNumUnitPrice') txtNumUnitPrice!: ElementRef<HTMLInputElement>;

  @ViewChild('txtDealerCod') txtDealerCod!: ElementRef<HTMLInputElement>;
  @ViewChild('txtExternalCod') txtExternalCod!: ElementRef<HTMLInputElement>;
  @ViewChild('txtCommenter') txtCommenter!: ElementRef<HTMLInputElement>;
  Page : number = 0;
  PucharseReqCod : string = "";
  pucharseRequestRegister : PucharseRequestRegisterDto = new PucharseRequestRegisterDto();
  pucharseRequestDetails : PucharseRequestDetailsDto = new PucharseRequestDetailsDto();
  productList : ProductEntity[] = [];
  responsePageSearch : ResponsePageSearch<ProductEntity> = new ResponsePageSearch();
  productSelect : ProductEntity = new ProductEntity();

  constructor(
    private pucharseRequestHeadService : PucharseRequestHeadService,
    private router: Router,
    private toastrService : ToastrService,
    private productService : ProductService,
    private session : DataSesionService
  )
  {
    this.GetParamUrl(this.router);
  }

  GetParamUrl(router: Router): void {
    let urlTree : any = this.router.parseUrl(this.router.url);
    this.PucharseReqCod =  (urlTree.queryParams['PucharseReqCod']) ? urlTree.queryParams['PucharseReqCod'] : "";
    this.FindDataForm(this.PucharseReqCod);
  }
  
  async FindDataForm(PucharseReqCod: string): Promise<void> {

    this.Page = 1;
    setTimeout(() => {this.FindAllProduct(this.Page);}, 100);


    if(!PucharseReqCod) return;

    const rpt = await this.pucharseRequestHeadService.FindDataForm(PucharseReqCod);

    if(!rpt.ErrorStatus)
    {
      this.pucharseRequestDetails = rpt.DataAdditional.find( e => e.Name === "PucharseRequestDetails")?.Data;

      this.pucharseRequestRegister.Headboard = this.pucharseRequestDetails.Headboard;
      this.pucharseRequestRegister.DetailList = this.pucharseRequestDetails.DetailList;

      setTimeout(() => {this.LoadingForm(this.pucharseRequestRegister);}, 100);

    }
    
  }

  LoadingForm(PucharseRequestRegister: PucharseRequestRegisterDto): void {

    this.txtDealerCod.nativeElement.value = PucharseRequestRegister.Headboard.DealerCod;
    this.txtExternalCod.nativeElement.value = PucharseRequestRegister.Headboard.ExternalCod;
    this.txtCommenter.nativeElement.value = PucharseRequestRegister.Headboard.Commenter;
    
  }
  
  async Save(): Promise<void> {
    this.pucharseRequestRegister.Headboard.DealerCod = this.txtDealerCod.nativeElement.value;
    this.pucharseRequestRegister.Headboard.ExternalCod = this.txtExternalCod.nativeElement.value;
    this.pucharseRequestRegister.Headboard.Commenter = this.txtCommenter.nativeElement.value;

    const rpt = await this.pucharseRequestHeadService.Save(this.pucharseRequestRegister);

    if(!rpt.ErrorStatus)
    {
      this.toastrService.success("Operación realizada con exito");
      setTimeout(() => {
        this.router.navigate(['/enterprise/pucharse/pages/listpucharse']);
      }, 1000);
    }
  }

  async FindAllProduct(Page : number)
  {
    const txtSearch : string = this.txtSearch.nativeElement.value;

    const rpt : ResponseWsDto = await this.productService.FindAll(txtSearch,Page);

    if( !rpt.ErrorStatus )
    {
      this.responsePageSearch = rpt.Data;

      if(this.responsePageSearch.resultSearch.length > 0)
      {
        this.productList = this.responsePageSearch.resultSearch;
      }

      
    }
  }

  FindAllProductNext(PagePlus : number)
  {
    this.Page = this.Page + PagePlus;
    this.FindAllProduct(this.Page);
  }

  selectProduct(product : ProductEntity)
  {
    this.txtNumUnit.nativeElement.value = "";
    this.txtNumUnitPrice.nativeElement.value = "";
    this.productSelect = product;
    console.log({ product : product});

    let PucharseRequestDetExist : PucharseRequestDetEntity | undefined = this.pucharseRequestRegister.DetailList.find( e => e.ProductCod === product.ProductCod );

    if(PucharseRequestDetExist)
    {
      this.txtNumUnit.nativeElement.value = String(PucharseRequestDetExist.NumUnit);
      this.txtNumUnitPrice.nativeElement.value = String(PucharseRequestDetExist.NumUnitPrice);
    }
  }

  async AddProduct(product : ProductEntity)
  {
    let PucharseRequestDet : PucharseRequestDetEntity = new PucharseRequestDetEntity();
    let PucharseRequestDetExist : PucharseRequestDetEntity | undefined = this.pucharseRequestRegister.DetailList.find( e => e.ProductCod === product.ProductCod );

    if(PucharseRequestDetExist)
    {
      PucharseRequestDet = PucharseRequestDetExist;
    }

    let productInfoDto : ProductInfoDto = await this.findDetailById(product.ProductCod);

    PucharseRequestDet.ProductCod = product.ProductCod;
    PucharseRequestDet.Variant = productInfoDto.VariantList[0].Variant;
    PucharseRequestDet.NumUnit = Number(this.txtNumUnit.nativeElement.value);
    PucharseRequestDet.NumUnitPrice = Number(this.txtNumUnitPrice.nativeElement.value);
    PucharseRequestDet.NumTotalPrice = PucharseRequestDet.NumUnit * PucharseRequestDet.NumUnitPrice;
    PucharseRequestDet.Product = product;
    
    if(!PucharseRequestDetExist)
    {
      this.pucharseRequestRegister.DetailList.push(
        PucharseRequestDet 
      );
    }
    this.txtNumUnit.nativeElement.value = "";
    this.txtNumUnitPrice.nativeElement.value = "";
    this.pucharseRequestRegister.Headboard.NumTotalPrice = this.pucharseRequestRegister.DetailList
                                                            .map( e => e.NumTotalPrice )
                                                            .reduce((a , b)=>a + b , 0);

  }

  async findDetailById(ProductCod : string):Promise<ProductInfoDto>
  {
    let productInfoDto : ProductInfoDto = new ProductInfoDto();

    const rpt : ResponseWsDto = await this.productService.findDetailById(
      ProductCod,
      this.session.getSessionStorageDto().StoreCod
    );

    if(!rpt.ErrorStatus)
    {
      productInfoDto = rpt.Data;
    }

    return productInfoDto;
  }

}
