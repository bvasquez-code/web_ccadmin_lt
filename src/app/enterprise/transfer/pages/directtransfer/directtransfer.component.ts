import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { DataSesionService } from 'src/app/enterprise/compartido/service/datasesion.service';
import { ProductEntity } from 'src/app/enterprise/product/model/entity/ProductEntity';
import { ProductInfoDto } from 'src/app/enterprise/product/model/dto/ProductInfoDto';
import { ProductService } from 'src/app/enterprise/product/service/product.service';
import { ResponsePageSearch } from 'src/app/enterprise/shared/model/dto/ResponsePageSearch';
import { ResponseWsDto } from 'src/app/enterprise/shared/model/dto/ResponseWsDto';
import { ValidationHelper } from 'src/app/enterprise/shared/helper/ValidationHelper';
import { StoreEntity } from 'src/app/enterprise/shared/model/entity/StoreEntity';
import { TransferDetEntity } from '../../model/entity/TransferDetEntity';
import { TransferRegisterBundleDto } from '../../model/dto/TransferRegisterBundleDto';
import { TransferService } from '../../service/TransferService';

@Component({
  selector: 'app-directtransfer',
  templateUrl: './directtransfer.component.html'
})
export class DirecttransferComponent implements OnInit {

  @ViewChild('txtSearch') txtSearch!: ElementRef<HTMLInputElement>;
  @ViewChild('txtNumUnit') txtNumUnit!: ElementRef<HTMLInputElement>;
  @ViewChild('txtObservation') txtObservation!: ElementRef<HTMLTextAreaElement>;
  @ViewChild('cboStoreDest') cboStoreDest!: ElementRef<HTMLSelectElement>;
  @ViewChild('cboTransportMode') cboTransportMode!: ElementRef<HTMLSelectElement>;
  @ViewChild('cboReason') cboReason!: ElementRef<HTMLSelectElement>;
  @ViewChild('txtVehiclePlate') txtVehiclePlate!: ElementRef<HTMLInputElement>;
  @ViewChild('txtDriverDocType') txtDriverDocType!: ElementRef<HTMLInputElement>;
  @ViewChild('txtDriverDocNumber') txtDriverDocNumber!: ElementRef<HTMLInputElement>;
  @ViewChild('txtDriverLicenseNumber') txtDriverLicenseNumber!: ElementRef<HTMLInputElement>;
  @ViewChild('txtCarrierRuc') txtCarrierRuc!: ElementRef<HTMLInputElement>;
  @ViewChild('txtCarrierName') txtCarrierName!: ElementRef<HTMLInputElement>;

  Page: number = 1;
  transferRegister: TransferRegisterBundleDto = new TransferRegisterBundleDto();
  responsePageSearch: ResponsePageSearch<ProductEntity> = new ResponsePageSearch();
  productList: ProductEntity[] = [];
  productSelect: ProductEntity = new ProductEntity();
  storeList: StoreEntity[] = [];

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
    private productService: ProductService,
    private session: DataSesionService,
    private router: Router,
    private toastrService: ToastrService
  ) {}

  ngOnInit(): void {
    this.loadFormData();
  }

  async loadFormData() {
    const rpt: ResponseWsDto = await this.transferService.FindDataForm('');
    if (!rpt.ErrorStatus) {
      const storeList = rpt.DataAdditional?.find((e: any) => e.Name === 'StoreList')?.Data
        ?? rpt.DataAdditional?.find((e: any) => e.Name === 'storeList')?.Data
        ?? rpt.DataAdditional?.find((e: any) => e.Name === 'stores')?.Data
        ?? [];
      this.storeList = storeList;

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

    setTimeout(() => this.FindAllProduct(1), 200);
  }

  async FindAllProduct(Page: number) {
    this.Page = Page;
    const query: string = this.txtSearch?.nativeElement.value ?? '';
    const rpt: ResponseWsDto = await this.productService.FindAll(query, Page);

    if (!rpt.ErrorStatus) {
      this.responsePageSearch = rpt.Data;
      if (this.responsePageSearch.resultSearch.length > 0) {
        this.productList = this.responsePageSearch.resultSearch;
      }
    }
  }

  selectProduct(product: ProductEntity) {
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

    const numUnit = Number(this.txtNumUnit.nativeElement.value);
    if (!numUnit || numUnit <= 0) {
      this.toastrService.error('Ingrese una cantidad válida');
      return;
    }

    let transferDet: TransferDetEntity = new TransferDetEntity();
    let transferDetExist: TransferDetEntity | undefined = this.transferRegister.transferDetList.find(e => e.ProductCod === product.ProductCod);

    if (transferDetExist) {
      transferDet = transferDetExist;
    }

    let productInfoDto: ProductInfoDto = await this.findDetailById(product.ProductCod);

    transferDet.ProductCod = product.ProductCod;
    transferDet.Variant = productInfoDto.VariantList[0]?.Variant ?? '0000';
    transferDet.NumUnit = numUnit;
    transferDet.Product = product;

    if (!transferDetExist) {
      this.transferRegister.transferDetList.push(transferDet);
    }

    this.txtNumUnit.nativeElement.value = '';
  }

  async removeProduct(product: TransferDetEntity) {
    this.transferRegister.transferDetList = this.transferRegister.transferDetList.filter(e => e.ProductCod !== product.ProductCod);
  }

  async Save() {
    try {
      const destStore = this.cboStoreDest.nativeElement.value;
      ValidationHelper.validateIsNotEmpty(destStore, 'Seleccione un local destino');

      if (this.transferRegister.transferDetList.length === 0) {
        throw new Error('Debe agregar al menos un producto');
      }

      this.transferRegister.transferHead.StoreCodOrigin = this.session.getSessionStorageDto().StoreCod;
      this.transferRegister.transferHead.StoreCodDest = destStore;
      this.transferRegister.transferHead.StoreCodRequestedBy = this.session.getSessionStorageDto().StoreCod;
      this.transferRegister.transferHead.TypeOperation = 'TS';
      this.transferRegister.transferHead.Observation = this.txtObservation.nativeElement.value;

      this.transferRegister.transferDetList = this.transferRegister.transferDetList.map((det, index) => {
        det.ItemNumber = index + 1;
        det.TypeOperation = 'TS';
        det.TransferCod = this.transferRegister.transferHead.TransferCod;
        return det;
      });

      this.transferRegister.transferDocument.TransportModeCod = this.cboTransportMode?.nativeElement.value ?? '';
      this.transferRegister.transferDocument.ReasonTransferCod = this.cboReason?.nativeElement.value ?? '';
      this.transferRegister.transferDocument.VehiclePlate = this.txtVehiclePlate?.nativeElement.value ?? '';
      this.transferRegister.transferDocument.DriverDocType = this.txtDriverDocType?.nativeElement.value ?? '';
      this.transferRegister.transferDocument.DriverDocNumber = this.txtDriverDocNumber?.nativeElement.value ?? '';
      this.transferRegister.transferDocument.DriverLicenseNumber = this.txtDriverLicenseNumber?.nativeElement.value ?? '';
      this.transferRegister.transferDocument.CarrierRuc = this.txtCarrierRuc?.nativeElement.value ?? '';
      this.transferRegister.transferDocument.CarrierName = this.txtCarrierName?.nativeElement.value ?? '';

      const rpt: ResponseWsDto = await this.transferService.RegisterBundle(this.transferRegister);

      if (!rpt.ErrorStatus) {
        this.toastrService.success(rpt.Message || 'Envío directo registrado correctamente');
        setTimeout(() => {
          this.router.navigate(['/enterprise/transfer/pages/listtransferdispatch']);
        }, 1000);
      } else {
        this.toastrService.error(rpt.Message || 'Ocurrió un error al registrar el envío');
      }
    } catch (e: any) {
      this.toastrService.error(e.message);
    }
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
