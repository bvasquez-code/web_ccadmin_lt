import { Component, ElementRef, ViewChild, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

import { SaleService } from '../../service/sale.service';
import { CreditNoteService } from '../../service/CreditNote.service';

import { CreditNoteRegisterDto } from '../../model/dto/CreditNoteRegisterDto';
import { CreditNoteDetailDto } from '../../model/dto/CreditNoteDetailDto';
import { SaleDetailDto } from '../../model/dto/SaleDetailDto';
import { ResponseWsDto } from 'src/app/enterprise/shared/model/dto/ResponseWsDto';

import { SaleDetEntity } from '../../model/entity/SaleDetEntity';
import { CreditNoteDetEntity } from '../../model/entity/CreditNoteDetEntity';
import { IRegisterFormV2 } from 'src/app/enterprise/shared/interface/IRegisterFormV2';
import { CreditNoteHeadEntity } from '../../model/entity/CreditNoteHeadEntity';
import { AlertService } from 'src/app/enterprise/shared/service/AlertService';

@Component({
  selector: 'app-createcreditnote',
  templateUrl: './createcreditnote.component.html'
})
export class CreatecreditnoteComponent
  implements OnInit, IRegisterFormV2<CreditNoteRegisterDto, string, CreditNoteDetailDto>
{
  @ViewChild('txtDocumentCod') txtDocumentCod!: ElementRef<HTMLInputElement>;
  @ViewChild('txtCommenter') txtCommenter!: ElementRef<HTMLInputElement>;

  CreditNoteDetail: CreditNoteDetailDto = new CreditNoteDetailDto();
  CreditNoteRegister: CreditNoteRegisterDto = new CreditNoteRegisterDto();
  SaleDetail: SaleDetailDto = new SaleDetailDto();

  CreditNoteCod = '';
  txtDocumentCodReadOnly = false;
  isLoading = false;
  isTotalMode = false;

  constructor(
    private readonly saleService: SaleService,
    private readonly creditNoteService: CreditNoteService,
    private readonly toastrService: ToastrService,
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly alertService: AlertService
  ) {}

  // ===== Requerido por IRegisterFormV2 =====
  GetParamUrl(router: Router): void {
    // Implementación compatible con tu firma original
    const urlTree: any = router.parseUrl(router.url);
    this.CreditNoteCod = urlTree?.queryParams?.['CreditNoteCod'] ?? '';
  }

  // -------------------- Lifecycle --------------------
  ngOnInit(): void {
    // Usamos el método exigido por la interfaz
    this.GetParamUrl(this.router);

    // Fallback por si no vino el query param (o para navegación programática)
    if (!this.CreditNoteCod) {
      this.CreditNoteCod = this.route.snapshot.queryParamMap.get('CreditNoteCod') ?? '';
    }

    if (this.CreditNoteCod) {
      this.FindDataForm(this.CreditNoteCod);
    }
  }

  // -------------------- Getters de UI --------------------
  get totalQty(): number {
    return (this.CreditNoteRegister.DetailList ?? [])
      .reduce((acc, d) => acc + (d?.NumUnit ?? 0), 0);
  }

  get totalAmount(): number {
    return this.CreditNoteRegister.Headboard?.NumTotalPrice ?? 0;
  }

  get hasReturnItems(): boolean {
    return (this.CreditNoteRegister.DetailList ?? [])
      .some(d => (d?.NumUnit ?? 0) > 0);
  }

  get currencyCode(): string {
    return this.CreditNoteRegister.Headboard?.CurrencyCod
        || this.SaleDetail.Headboard?.CurrencyCod
        || '';
  }

  trackByProductVariant = (_: number, it: SaleDetEntity) => `${it.ProductCod}#${it.Variant}`;

  // -------------------- Helpers de negocio --------------------
  private findCreditDet(saleDet: SaleDetEntity): CreditNoteDetEntity | undefined {
    return (this.CreditNoteRegister.DetailList ?? [])
      .find(e => e.ProductCod === saleDet.ProductCod && e.Variant === saleDet.Variant);
  }

  private clampReturn(saleDet: SaleDetEntity, wanted: number): number {
    const max = saleDet?.NumUnit ?? 0;
    return Math.min(Math.max(wanted, 0), max);
  }

  private recalcTotals(): void {
    const details = this.CreditNoteRegister.DetailList ?? [];

    details.forEach(d => {
      const qty = d?.NumUnit ?? 0;
      const price = d?.NumUnitPriceSale ?? 0;
      d.NumTotalPrice = +(qty * price).toFixed(2);
    });

    const sum = details.reduce((acc, d) => acc + (d?.NumTotalPrice ?? 0), 0);
    (this.CreditNoteRegister as any).Headboard ??= {};
    this.CreditNoteRegister.Headboard!.NumTotalPrice = +sum.toFixed(2);
  }

  // -------------------- Carga por query param --------------------
  async FindDataForm(id: string): Promise<void> {
    if (!id) return;

    const rpt: ResponseWsDto = await this.creditNoteService.FindById(id);
    if (!rpt?.ErrorStatus && rpt?.Data) {
      this.txtDocumentCodReadOnly = true;
      this.CreditNoteDetail = rpt.Data;

      await this.LoadingForm(this.CreditNoteDetail);
    }
  }

  async LoadingForm(creditNoteDetail: CreditNoteDetailDto): Promise<void> {
    if (!creditNoteDetail?.Headboard?.SaleCod) return;
    await this.FindBySaleCod(creditNoteDetail.Headboard.SaleCod);
  }

  // -------------------- Acciones UI --------------------
  async FindByDocumentCod(): Promise<void> {
    this.SaleDetail = new SaleDetailDto();
    this.CreditNoteRegister = new CreditNoteRegisterDto();

    const documentCod: string = this.txtDocumentCod?.nativeElement?.value?.trim() ?? '';
    if (!documentCod) {
      this.toastrService.error('ingresa un documento de venta.');
      return;
    }

    const rpt: ResponseWsDto = await this.saleService.FindByDocumentCod(documentCod);
    if (rpt?.ErrorStatus) return;

    if (rpt?.Data) {
      this.SaleDetail = rpt.Data;

      const credit = this.SaleDetail.CreditNoteDetail;
      const status = credit?.Headboard?.CreditNoteStatus;

      if (status === 'C') {
        this.SaleDetail = new SaleDetailDto();
        this.toastrService.error('documento ya tiene una nota de crédito confirmada.');
        return;
      }
      if (status === 'P') {
        this.toastrService.error('documento ya tiene una nota de crédito pendiente.');
        return;
      }

      // inicializar estructuras para trabajar
      if (!this.SaleDetail.CreditNoteDetail) {
        (this.SaleDetail as any).CreditNoteDetail = { Headboard: {}, DetailList: [], Document: null };
      }

      // preparar register vacío basado en venta
      this.CreditNoteRegister.Headboard = {
        SaleCod: this.SaleDetail.Headboard?.SaleCod,
        StoreCod: this.SaleDetail.Headboard?.StoreCod,
        ClientCod: this.SaleDetail.Headboard?.ClientCod ?? null,
        PeriodId: this.SaleDetail.Headboard?.PeriodId,
        CurrencyCod: this.SaleDetail.Headboard?.CurrencyCod,
        CurrencyCodSys: this.SaleDetail.Headboard?.CurrencyCodSys,
        NumExchangevalue: this.SaleDetail.Headboard?.NumExchangevalue,
        IsPaid: this.SaleDetail.Headboard?.IsPaid,
        Commenter: (this.txtCommenter?.nativeElement?.value ?? '').trim(),
        NumTotalPrice: 0
      } as CreditNoteHeadEntity;

      this.CreditNoteRegister.DetailList = [];
      this.recalcTotals();
    }
  }

  async FindBySaleCod(saleCod: string): Promise<void> {
    this.SaleDetail = new SaleDetailDto();
    this.CreditNoteRegister = new CreditNoteRegisterDto();

    const rpt: ResponseWsDto = await this.saleService.FindById(saleCod);
    if (rpt?.ErrorStatus) return;

    if (rpt?.Data) {
      this.SaleDetail = rpt.Data;

      // poblar búsqueda en UI
      if (this.txtDocumentCod?.nativeElement) {
        this.txtDocumentCod.nativeElement.value = this.SaleDetail.SaleDocument?.DocumentCod ?? '';
      }

      // asegurarnos de tener estructuras
      const cn = this.SaleDetail.CreditNoteDetail ?? { Headboard: {}, DetailList: [], Document: null };
      const head = cn.Headboard ?? {};

      if (this.txtCommenter?.nativeElement) {
        this.txtCommenter.nativeElement.value = head?.Commenter ?? '';
      }

      this.isTotalMode = (head?.TypeCreditNote === 'T');

      // CLONAR head y detalles para no mutar el DTO de origen
      this.CreditNoteRegister.Headboard = { ...(head as any) };
      this.CreditNoteRegister.DetailList = (cn.DetailList ?? [])
        .map((e: any) => ({ ...(e?.CreditNoteDet ?? {}) })) as CreditNoteDetEntity[];

      this.CreditNoteRegister.Document = cn.Document;

      // heredar campos clave de la venta si faltan
      const Headboard : CreditNoteHeadEntity = this.CreditNoteRegister.Headboard;
      Headboard.SaleCod = Headboard.SaleCod ?? this.SaleDetail.Headboard?.SaleCod;
      Headboard.StoreCod = Headboard.StoreCod ?? this.SaleDetail.Headboard?.StoreCod;
      Headboard.ClientCod = Headboard.ClientCod ?? this.SaleDetail.Headboard?.ClientCod ?? null;
      Headboard.PeriodId = Headboard.PeriodId ?? this.SaleDetail.Headboard?.PeriodId;
      Headboard.CurrencyCod = Headboard.CurrencyCod ?? this.SaleDetail.Headboard?.CurrencyCod;
      Headboard.CurrencyCodSys = Headboard.CurrencyCodSys ?? this.SaleDetail.Headboard?.CurrencyCodSys;
      Headboard.NumExchangevalue = Headboard.NumExchangevalue ?? this.SaleDetail.Headboard?.NumExchangevalue;
      Headboard.IsPaid = Headboard.IsPaid ?? this.SaleDetail.Headboard?.IsPaid;
      Headboard.TypeCreditNote = head?.TypeCreditNote ?? 'P';

      this.recalcTotals();
    }
  }

  AddUnit(saleDet: SaleDetEntity): void {
    if (this.isTotalMode) return; // bloqueado en NC total

    const det = this.findCreditDet(saleDet);
    if (det) {
      det.NumUnit = this.clampReturn(saleDet, (det.NumUnit ?? 0) + 1);
    } else {
      const unitPriceSale: number = (saleDet.NumUnitPriceSale && saleDet.NumUnitPriceSale > 0)
        ? saleDet.NumUnitPriceSale
        : (saleDet.NumUnitPrice ?? 0);

      const creditNoteDetNew: CreditNoteDetEntity = new CreditNoteDetEntity();
      creditNoteDetNew.CreditNoteCod = this.CreditNoteRegister.Headboard?.CreditNoteCod ?? '';
      creditNoteDetNew.ProductCod = saleDet.ProductCod;
      creditNoteDetNew.Variant = saleDet.Variant;
      creditNoteDetNew.NumUnit = 1;
      creditNoteDetNew.NumUnitPriceSale = unitPriceSale;
      creditNoteDetNew.NumTotalPrice = unitPriceSale;

      creditNoteDetNew.NumUnitStockReturned = 0;
      // creditNoteDetNew.IsStockReturned = 'N';

      (this.CreditNoteRegister.DetailList ??= []).push(creditNoteDetNew);
    }
    this.recalcTotals();
  }

  SubtractUnit(saleDet: SaleDetEntity): void {
    if (this.isTotalMode) return; // bloqueado en NC total

    const det = this.findCreditDet(saleDet);
    if (!det) return;

    det.NumUnit = this.clampReturn(saleDet, (det.NumUnit ?? 0) - 1);

    if ((det.NumUnit ?? 0) === 0) {
      this.CreditNoteRegister.DetailList = (this.CreditNoteRegister.DetailList ?? [])
        .filter(e => !(e.ProductCod === saleDet.ProductCod && e.Variant === saleDet.Variant));
    }
    this.recalcTotals();
  }


  getUnit(saleDet: SaleDetEntity): number {
    const det = this.findCreditDet(saleDet);
    return det?.NumUnit ?? 0;
  }

  // -------------------- Persistencia --------------------
  async CreateCode(): Promise<string> {
    const rpt: ResponseWsDto = await this.creditNoteService.CreateCode();
    if (rpt?.ErrorStatus) {
      this.toastrService.error(rpt.Message);
      throw new Error(rpt.Message);
    }
    return String(rpt.Data);
  }

  async saveCreditNote(): Promise<void> {
    this.alertService.waring("Se registrara nota de credito, esta operación no tiene reversión.").then(async (result) => {
      if (result && result.isConfirmed) {
        this.Save();
      }
    });
  }

  async Save(): Promise<void> {

    

    if (!this.SaleDetail.Headboard?.SaleCod) {
      this.toastrService.error('no hay una venta seleccionada.');
      return;
    }

    const comment = this.txtCommenter?.nativeElement?.value?.trim() ?? '';
    if (!comment) {
      this.toastrService.error('ingresa el motivo de la nota de crédito.');
      return;
    }

    // preparar head
    const Headboard : CreditNoteHeadEntity = (this.CreditNoteRegister.Headboard);
    if (!Headboard.CreditNoteCod) Headboard.CreditNoteCod = await this.CreateCode();

    Headboard.SaleCod = this.SaleDetail.Headboard.SaleCod;
    Headboard.StoreCod = this.SaleDetail.Headboard.StoreCod;
    Headboard.ClientCod = this.SaleDetail.Headboard.ClientCod ?? null;
    Headboard.Commenter = comment;
    Headboard.PeriodId = this.SaleDetail.Headboard.PeriodId;
    Headboard.CurrencyCod = this.SaleDetail.Headboard.CurrencyCod;
    Headboard.CurrencyCodSys = this.SaleDetail.Headboard.CurrencyCodSys;
    Headboard.NumExchangevalue = this.SaleDetail.Headboard.NumExchangevalue;
    Headboard.IsPaid = this.SaleDetail.Headboard.IsPaid;
    Headboard.CreditNoteStatus = 'P'; // pendiente
    Headboard.IsStockReturned = 'N'; // por defecto
    Headboard.TypeCreditNote = this.isTotalMode ? 'T' : 'P';

    // detalles válidos
    this.CreditNoteRegister.DetailList = (this.CreditNoteRegister.DetailList ?? [])
      .filter(d => (d?.NumUnit ?? 0) > 0);

    if (this.CreditNoteRegister.DetailList.length === 0) {
      this.toastrService.error('debes seleccionar al menos 1 producto para devolver.');
      return;
    }

    // totales (asegura NOT NULL y consistencia)
    this.recalcTotals();

    try {
      this.isLoading = true;
      const rpt: ResponseWsDto = await this.creditNoteService.Save(this.CreditNoteRegister);

      if (rpt?.ErrorStatus) {
        this.toastrService.error(rpt.Message);
      } else {

        this.Confirm(Headboard);

      }
    } finally {
      this.isLoading = false;
    }
  }

  async Confirm(creditNoteHead : CreditNoteHeadEntity): Promise<void> {

    const CreditNoteRegister : CreditNoteRegisterDto = new CreditNoteRegisterDto();
    CreditNoteRegister.Headboard = creditNoteHead;

    const rpt : ResponseWsDto = await this.creditNoteService.Confirm(CreditNoteRegister);

    if(!rpt.ErrorStatus){
      this.toastrService.success("Nota de credito confirmada");
      window.location.assign(`/enterprise/sale/pages/viewcreditnote?CreditNoteCod=${creditNoteHead.CreditNoteCod}`);
    }
  }

  getClient(){
    const Client = this.SaleDetail.Headboard.Client;
    if(Client && Client.Person && Client.Person.DocumentNum){
      return Client.Person?.DocumentNum + ' - ' + Client.Person.Names + ' ' + Client.Person.LastNames;
    }else{
      return '';
    }
  }

  OnToggleTotalMode(ev: Event): void {
    const checked = (ev.target as HTMLInputElement).checked;
    this.isTotalMode = checked;

    if (this.isTotalMode) {
      this.applyTotalQuantities();
    } else {
      this.recalcTotals();
    }
  }

  /** Aplica cantidades completas para todos los ítems (NC total) */
  private applyTotalQuantities(): void {
    const saleDetailItems: ReadonlyArray<SaleDetEntity> = this.SaleDetail.DetailList ?? [];
    this.CreditNoteRegister.DetailList ??= [];

    for (const saleItem of saleDetailItems) {
      const unitPriceSale: number = (saleItem.NumUnitPriceSale && saleItem.NumUnitPriceSale > 0)
        ? saleItem.NumUnitPriceSale
        : (saleItem.NumUnitPrice ?? 0);

      let creditNoteDetail: CreditNoteDetEntity | undefined =
        this.CreditNoteRegister.DetailList.find(e => e.ProductCod === saleItem.ProductCod && e.Variant === saleItem.Variant);

      if (!creditNoteDetail) {
        const creditNoteDetNew: CreditNoteDetEntity = new CreditNoteDetEntity();
        creditNoteDetNew.CreditNoteCod = this.CreditNoteRegister.Headboard?.CreditNoteCod ?? '';
        creditNoteDetNew.ProductCod = saleItem.ProductCod;
        creditNoteDetNew.Variant = saleItem.Variant;
        creditNoteDetNew.NumUnit = saleItem.NumUnit ?? 0;
        creditNoteDetNew.NumUnitPriceSale = unitPriceSale;
        creditNoteDetNew.NumTotalPrice = 0; // se recalcula abajo

        // si tu entidad exige estos campos, se setean aquí (ya existen en tu modelo):
        creditNoteDetNew.NumUnitStockReturned = 0;
        // creditNoteDetNew.IsStockReturned = 'N';

        this.CreditNoteRegister.DetailList.push(creditNoteDetNew);
      } else {
        creditNoteDetail.NumUnit = saleItem.NumUnit ?? 0;
        creditNoteDetail.NumUnitPriceSale = unitPriceSale;
        // NumTotalPrice se recalcula en recalcTotals()
      }
    }

    this.recalcTotals();
  }





}