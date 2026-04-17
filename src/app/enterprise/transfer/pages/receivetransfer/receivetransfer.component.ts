import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { DataSesionService } from 'src/app/enterprise/compartido/service/datasesion.service';
import { ActionModalConfirmService } from 'src/app/enterprise/shared/interface/ActionModalConfirmService';
import { ResponseWsDto } from 'src/app/enterprise/shared/model/dto/ResponseWsDto';
import { TransferDetailDto } from '../../model/dto/TransferDetailDto';
import { TransferReceiveDto } from '../../model/dto/TransferReceiveDto';
import { TransferRequestService } from '../../service/TransferRequestService';
import { TransferService } from '../../service/TransferService';
import { TransferDetEntity } from '../../model/entity/TransferDetEntity';
import { AlertService } from 'src/app/enterprise/shared/service/AlertService';
import { ProductService } from 'src/app/enterprise/product/service/product.service';
import { ProductEntity } from 'src/app/enterprise/product/model/entity/ProductEntity';

@Component({
  selector: 'app-receivetransfer',
  templateUrl: './receivetransfer.component.html'
})
export class ReceivetransferComponent implements OnInit, ActionModalConfirmService {

  @ViewChild('txtObservation') txtObservation!: ElementRef<HTMLTextAreaElement>;

  TransferReqCod: string = '';
  transferDetail: TransferDetailDto = new TransferDetailDto();
  detailList: TransferDetEntity[] = [];
  selectedDetail: any = null;

  @ViewChild('txtEditQty') txtEditQty!: ElementRef<HTMLInputElement>;
  @ViewChild('btnCloseModalEdit') btnCloseModalEdit!: ElementRef<HTMLButtonElement>;

  @ViewChild('txtSearchBarcode') txtSearchBarcode!: ElementRef<HTMLInputElement>;
  @ViewChild('txtSearchBarcodeModal') txtSearchBarcodeModal!: ElementRef<HTMLInputElement>;
  @ViewChild('btnCloseScanModal') btnCloseScanModal!: ElementRef<HTMLButtonElement>;

  scanSearchQuery: string = '';
  scannedProduct: ProductEntity | null = null;
  scanCounter: number = 0;

  constructor(
    private transferRequestService: TransferRequestService,
    private transferService: TransferService,
    private session: DataSesionService,
    private router: Router,
    private toastrService: ToastrService,
    private alertService: AlertService,
    private productService: ProductService
  ) {
    let urlTree: any = this.router.parseUrl(this.router.url);
    this.TransferReqCod = (urlTree.queryParams['TransferReqCod']) ? urlTree.queryParams['TransferReqCod'] : '';
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
    const rpt: ResponseWsDto = await this.transferRequestService.FindDataForm(this.TransferReqCod);
    if (!rpt.ErrorStatus) {
      this.transferDetail = rpt.Data ?? rpt.DataAdditional?.find((e: any) => e.Name === 'transferDetail')?.Data ?? new TransferDetailDto();
      this.detailList = this.transferDetail.transferDetTsList || [];
    }
  }

  async confirmAll() {
    const confirm = await this.alertService.waring('¿Estás seguro de verificar todos los productos?');
    if (confirm.isConfirmed) {
      this.detailList.forEach(d => d.NumUnitReception = d.NumUnit);
    }
  }

  async toggleProductCheck(det: any, event: any) {
    const isChecking = event.target.checked;
    if (isChecking) {
      const confirm = await this.alertService.waring('¿Estás seguro de verificar este producto?');
      if (confirm.isConfirmed) {
        det.NumUnitReception = det.NumUnit;
      } else {
        event.target.checked = false;
      }
    } else {
      det.NumUnitReception = 0;
    }
  }

  async searchBarcode() {
    if (!this.txtSearchBarcode) return;
    const query = this.txtSearchBarcode.nativeElement.value.trim();
    if (!query) return;

    this.txtSearchBarcode.nativeElement.value = '';

    const rpt: ResponseWsDto = await this.productService.FindAll(query, 1);
    if (!rpt.ErrorStatus && rpt.Data?.resultSearch?.length > 0) {
      const foundProduct = rpt.Data.resultSearch.find((p: ProductEntity) => p.ProductCod === query) || rpt.Data.resultSearch[0];

      const inTransfer = this.detailList.find(d => d.ProductCod === foundProduct.ProductCod);
      if (!inTransfer) {
        this.toastrService.error('El producto escaneado no forma parte de los productos de esta transferencia.');
        return;
      }

      this.scannedProduct = foundProduct;
      this.scanCounter = 1;

      (window as any).$('#modalScanBarcode').modal('show');

      setTimeout(() => {
        if (this.txtSearchBarcodeModal) this.txtSearchBarcodeModal.nativeElement.focus();
      }, 500);

    } else {
      this.toastrService.warning('Producto no encontrado');
    }
  }

  searchBarcodeInModal() {
    if (!this.txtSearchBarcodeModal || !this.scannedProduct) return;
    const query = this.txtSearchBarcodeModal.nativeElement.value.trim();
    if (!query) return;

    this.txtSearchBarcodeModal.nativeElement.value = '';

    if (query === this.scannedProduct.ProductCod) {
      this.scanCounter++;
    } else {
      this.toastrService.warning('Código diferente. Guarde el progreso actual o cierre el modal para escanear otro producto.');
    }
  }

  saveScanQuantity() {
    if (!this.scannedProduct) return;
    const det = this.detailList.find(d => d.ProductCod === this.scannedProduct!.ProductCod);
    if (det) {
      det.NumUnitReception = (det.NumUnitReception || 0) + this.scanCounter;
    }
    this.btnCloseScanModal.nativeElement.click();
    setTimeout(() => {
      if (this.txtSearchBarcode) this.txtSearchBarcode.nativeElement.focus();
    }, 500);
  }

  openEditModal(det: any) {
    this.selectedDetail = det;
    setTimeout(() => {
      if (this.txtEditQty) this.txtEditQty.nativeElement.value = String(det.NumUnitReception > 0 ? det.NumUnitReception : det.NumUnit);
    }, 100);
  }

  saveQuantity() {
    if (!this.selectedDetail) return;
    const qty = Number(this.txtEditQty.nativeElement.value);
    if (qty < 0) {
      this.toastrService.error('La cantidad no puede ser negativa');
      return;
    }
    this.selectedDetail.NumUnitReception = qty;
    this.btnCloseModalEdit.nativeElement.click();
  }

  preReceive() {
    const unconfirmed = this.detailList.filter(d => d.NumUnitReception <= 0);
    if (unconfirmed.length > 0) {
      this.toastrService.warning('Debe confirmar (recepcionar más de 0) todos los productos antes de recepcionar la transferencia');
      return;
    }
    (window as any).$('#modal_receive').modal('show');
  }

  async receiveTransfer() {
    const request: TransferReceiveDto = new TransferReceiveDto();
    request.transferCod = this.TransferReqCod;
    request.user = this.session.getSessionStorageDto().UserCod;
    request.observation = this.txtObservation?.nativeElement.value ?? '';
    request.detailListReceive = this.detailList;

    const rpt: ResponseWsDto = await this.transferService.ReceiveTransfer(request);

    if (!rpt.ErrorStatus) {

      const rpt2: ResponseWsDto = await this.transferRequestService.ConfirmedTransfer(request);

      if (!rpt2.ErrorStatus) {
        this.toastrService.success(rpt2.Message || 'Transferencia recibida correctamente');
        setTimeout(() => {
          this.router.navigate(['/enterprise/transfer/pages/listtransferrequest']);
        }, 1000);
      } else {
        this.toastrService.error(rpt2.Message || 'No se pudo recepcionar la transferencia');
      }

    } else {
      this.toastrService.error(rpt.Message || 'No se pudo recepcionar la transferencia');
    }
  }
}
