import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ProductEntity } from 'src/app/enterprise/product/model/entity/ProductEntity';
import { ProductInfoDto } from 'src/app/enterprise/product/model/dto/ProductInfoDto';
import { ProductService } from 'src/app/enterprise/product/service/product.service';
import { ProductSearchService } from 'src/app/enterprise/product/service/productsearch.service';
import { ProductSearchDto } from 'src/app/enterprise/product/model/dto/ProductSearchDto';
import { ProductSearchEntity } from 'src/app/enterprise/product/model/entity/ProductSearchEntity';
import { DataSesionService } from 'src/app/enterprise/compartido/service/datasesion.service';
import { IRegisterForm } from 'src/app/enterprise/shared/interface/IRegisterForm';
import { ResponsePageSearch } from 'src/app/enterprise/shared/model/dto/ResponsePageSearch';
import { ResponseWsDto } from 'src/app/enterprise/shared/model/dto/ResponseWsDto';
import { ValidationHelper } from 'src/app/enterprise/shared/helper/ValidationHelper';
import { StoreEntity } from 'src/app/enterprise/shared/model/entity/StoreEntity';
import { TransferRegisterBundleDto } from '../../model/dto/TransferRegisterBundleDto';
import { TransferDetEntity } from '../../model/entity/TransferDetEntity';
import { TransferService } from '../../service/TransferService';

@Component({
  selector: 'app-createtransferrequest',
  templateUrl: './createtransferrequest.component.html'
})
export class CreatetransferrequestComponent implements OnInit, IRegisterForm<TransferRegisterBundleDto, string> {

  @ViewChild('txtSearch') txtSearch!: ElementRef<HTMLInputElement>;
  @ViewChild('txtNumUnit') txtNumUnit!: ElementRef<HTMLInputElement>;
  @ViewChild('txtObservation') txtObservation!: ElementRef<HTMLTextAreaElement>;
  @ViewChild('cboStoreDest') cboStoreDest!: ElementRef<HTMLSelectElement>;
  @ViewChild('chkAllowPartial') chkAllowPartial!: ElementRef<HTMLInputElement>;

  Page: number = 1;
  TransferCod: string = '';
  transferRegister: TransferRegisterBundleDto = new TransferRegisterBundleDto();
  responsePageSearch: ResponsePageSearch<ProductSearchEntity> = new ResponsePageSearch();
  productList: ProductSearchEntity[] = [];
  productSelect: ProductSearchEntity = new ProductSearchEntity();
  productSearch: ProductSearchDto = new ProductSearchDto();
  storeList: StoreEntity[] = [];

  constructor(
    private transferService: TransferService,
    private productService: ProductService,
    private productSearchService: ProductSearchService,
    private session: DataSesionService,
    private router: Router,
    private toastrService: ToastrService
  ) {
    this.GetParamUrl(this.router);
  }

  ngOnInit(): void {
    if (!this.TransferCod) {
      this.FindDataForm('');
    }
  }

  GetParamUrl(router: Router): void {
    let urlTree: any = this.router.parseUrl(this.router.url);
    this.TransferCod = (urlTree.queryParams['TransferCod']) ? urlTree.queryParams['TransferCod'] : '';
    this.FindDataForm(this.TransferCod);
  }

  async FindDataForm(TransferCod: string): Promise<void> {
    const rpt: ResponseWsDto = await this.transferService.FindDataForm(TransferCod);

    if (!rpt.ErrorStatus) {
      const storeList = rpt.DataAdditional?.find((e: any) => e.Name === 'StoreList')?.Data
        ?? rpt.DataAdditional?.find((e: any) => e.Name === 'storeList')?.Data
        ?? rpt.DataAdditional?.find((e: any) => e.Name === 'stores')?.Data
        ?? [];

      this.storeList = storeList;

      const registerBundle = rpt.DataAdditional?.find((e: any) => e.Name === 'TransferRegisterBundle')?.Data
        ?? rpt.DataAdditional?.find((e: any) => e.Name === 'TransferRegister')?.Data
        ?? rpt.Data;

      if (registerBundle) {
        this.transferRegister = registerBundle;
        setTimeout(() => this.LoadingForm(this.transferRegister), 100);
      }
    }

    this.productList = [];
  }

  LoadingForm(Entity: TransferRegisterBundleDto): void {
    if (this.cboStoreDest) {
      this.cboStoreDest.nativeElement.value = Entity.transferHead.StoreCodDest ?? '';
    }
    if (this.txtObservation) {
      this.txtObservation.nativeElement.value = Entity.transferHead.Observation ?? '';
    }
    if (this.chkAllowPartial) {
      this.chkAllowPartial.nativeElement.checked = !!Entity.allowPartial;
    }
  }

  async Save(): Promise<void> {
    try {
      const destStore = this.cboStoreDest.nativeElement.value;
      ValidationHelper.validateIsNotEmpty(destStore, 'Seleccione un local destino');

      if (this.transferRegister.transferDetList.length === 0) {
        throw new Error('Debe agregar al menos un producto');
      }

      const invalidQty = this.transferRegister.transferDetList.find(det => det.NumUnit <= 0);
      if (invalidQty) {
        throw new Error('La cantidad debe ser mayor a cero');
      }

      this.transferRegister.transferHead.StoreCodOrigin = this.session.getSessionStorageDto().StoreCod;
      this.transferRegister.transferHead.StoreCodDest = destStore;
      this.transferRegister.transferHead.StoreCodRequestedBy = this.session.getSessionStorageDto().StoreCod;
      this.transferRegister.transferHead.TypeOperation = 'TE';
      this.transferRegister.transferHead.Observation = this.txtObservation.nativeElement.value;
      this.transferRegister.allowPartial = this.chkAllowPartial.nativeElement.checked;

      this.transferRegister.transferDetList = this.transferRegister.transferDetList.map((det, index) => {
        det.ItemNumber = index + 1;
        det.TypeOperation = 'TE';
        det.TransferCod = this.transferRegister.transferHead.TransferCod;
        return det;
      });

      const rpt: ResponseWsDto = await this.transferService.RegisterBundle(this.transferRegister);

      if (!rpt.ErrorStatus) {
        this.toastrService.success(rpt.Message || 'Transferencia registrada correctamente');
        setTimeout(() => {
          this.router.navigate(['/enterprise/transfer/pages/listtransferrequest']);
        }, 1000);
      } else {
        this.toastrService.error(rpt.Message || 'Ocurrió un error al registrar la transferencia');
      }
    } catch (e: any) {
      this.toastrService.error(e.message);
    }
  }

  async FindAllProduct(Page: number) {
    const destStore = this.cboStoreDest?.nativeElement.value ?? '';
    if (!destStore) {
      this.toastrService.error('Seleccione un local destino para buscar productos');
      return;
    }

    this.Page = Page;
    this.productSearch.StoreCod = destStore;
    this.productSearch.Page = Page;
    this.productSearch.Query = this.txtSearch?.nativeElement.value ?? '';
    this.productSearch.StockMin = 1;

    const response: ResponseWsDto = await this.productSearchService.query(this.productSearch);

    if (!response.ErrorStatus) {
      this.responsePageSearch = response.Data;
      this.productList = this.responsePageSearch.resultSearch;
    }
  }

  FindAllProductNext(PagePlus: number) {
    this.Page = this.Page + PagePlus;
    this.FindAllProduct(this.Page);
  }

  selectProduct(product: ProductSearchEntity) {
    this.txtNumUnit.nativeElement.value = '';
    this.productSelect = product;

    const existing = this.transferRegister.transferDetList.find(e => e.ProductCod === product.ProductCod);
    if (existing) {
      this.txtNumUnit.nativeElement.value = String(existing.NumUnit);
    }
  }

  async AddProduct() {
    const product = this.productSelect;
    if (!product || !product.ProductCod) {
      this.toastrService.error('Seleccione un producto');
      return;
    }

    let transferDet: TransferDetEntity = new TransferDetEntity();
    let transferDetExist: TransferDetEntity | undefined = this.transferRegister.transferDetList.find(e => e.ProductCod === product.ProductCod);

    if (transferDetExist) {
      transferDet = transferDetExist;
    }

    const numUnit = Number(this.txtNumUnit.nativeElement.value);
    if (!numUnit || numUnit <= 0) {
      this.toastrService.error('Ingrese una cantidad válida');
      return;
    }

    let productInfoDto: ProductInfoDto = await this.findDetailById(product.ProductCod);
    const productEntity: ProductEntity = new ProductEntity();
    productEntity.ProductCod = product.ProductCod;
    productEntity.ProductName = product.ProductName;

    transferDet.ProductCod = product.ProductCod;
    transferDet.Variant = productInfoDto.VariantList[0]?.Variant ?? '0000';
    transferDet.NumUnit = numUnit;
    transferDet.Product = productEntity;

    if (!transferDetExist) {
      this.transferRegister.transferDetList.push(transferDet);
    }

    this.txtNumUnit.nativeElement.value = '';
  }

  async removeProduct(product: TransferDetEntity) {
    this.transferRegister.transferDetList = this.transferRegister.transferDetList.filter(e => e.ProductCod !== product.ProductCod);
  }

  async findDetailById(ProductCod: string): Promise<ProductInfoDto> {
    let productInfoDto: ProductInfoDto = new ProductInfoDto();

    const rpt: ResponseWsDto = await this.productService.findDetailById(
      ProductCod,
      this.session.getSessionStorageDto().StoreCod
    );

    if (!rpt.ErrorStatus) {
      productInfoDto = rpt.Data;
    }

    return productInfoDto;
  }
}
