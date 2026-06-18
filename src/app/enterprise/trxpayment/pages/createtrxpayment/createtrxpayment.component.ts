import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { TrxPaymentEntity } from '../../model/entity/TrxPaymentEntity';
import { IRegisterForm } from 'src/app/enterprise/shared/interface/IRegisterForm';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { TrxPaymentService } from '../../service/TrxPaymentService';
import { ResponseWsDto } from 'src/app/enterprise/shared/model/dto/ResponseWsDto';
import { CurrencyEntity } from 'src/app/enterprise/shared/model/entity/CurrencyEntity';
import { PaymentMethodEntity } from 'src/app/enterprise/shared/model/entity/PaymentMethodEntity';
import { CreditNoteService } from 'src/app/enterprise/sale/service/CreditNote.service';
import { CreditNoteDetailDto } from 'src/app/enterprise/sale/model/dto/CreditNoteDetailDto';
import { TrxPaymentComponenRequestDto } from '../../model/dto/TrxPaymentComponenRequestDto';
import { ElementHtmlDto } from 'src/app/enterprise/shared/model/dto/ElementHtmlDto';
import { AlertService } from 'src/app/enterprise/shared/service/AlertService';

@Component({
  selector: 'app-createtrxpayment',
  templateUrl: './createtrxpayment.component.html'
})
export class CreatetrxpaymentComponent implements OnInit,IRegisterForm<TrxPaymentEntity,number>{

  @Input() TrxPaymentComponenRequest : TrxPaymentComponenRequestDto = new TrxPaymentComponenRequestDto(); 
  @Output() ResultForm = new EventEmitter<object>();

  @ViewChild('cboPaymentMethodCod') cboPaymentMethodCod!: ElementRef<HTMLSelectElement>;
  @ViewChild('cboCurrencyCod') cboCurrencyCod!: ElementRef<HTMLSelectElement>;
  @ViewChild('txtAmountPaid') txtAmountPaid!: ElementRef<HTMLInputElement>;
  @ViewChild('txtDocumentCod') txtDocumentCod!: ElementRef<HTMLInputElement>;
  

  paymentMethodList: PaymentMethodEntity[] = [];
  currencyList : CurrencyEntity[] = [];
  trxPayment : TrxPaymentEntity = new TrxPaymentEntity();
  txtDocumentVisible : boolean = false;
  creditNoteDetail : CreditNoteDetailDto = new CreditNoteDetailDto();

  txtAmountPaidConfigHtml : ElementHtmlDto = new ElementHtmlDto();
  cboCurrencyCodConfigHtml : ElementHtmlDto = new ElementHtmlDto();

  constructor(
    private toastrService : ToastrService,
    private trxPaymentService : TrxPaymentService,
    private creditNoteService : CreditNoteService,
    private alertService : AlertService
  ){
    setTimeout(() => {this.loadingModal();}, 100);
  }

  ngOnInit(): void {
    this.FindDataForm(0);
  }

  GetParamUrl(router: Router): void {
    throw new Error('Method not implemented.');
  }

  async FindDataForm(Id: number): Promise<void> {
    
    const rpt : ResponseWsDto = await this.trxPaymentService.FindDataForm();

    if(!rpt.ErrorStatus){
      this.paymentMethodList = rpt.DataAdditional.find( e => e.Name === "paymentMethodList" )?.Data;
      this.currencyList = rpt.DataAdditional.find( e => e.Name === "currencyList" )?.Data;
    }
  }

  LoadingForm(Entity: TrxPaymentEntity): void {
    throw new Error('Method not implemented.');
  }

  async Save(): Promise<void> {

    let PaymentMethodCodSelect : string = this.cboPaymentMethodCod.nativeElement.value;
    let CurrencyCodSelect : string = this.cboCurrencyCod.nativeElement.value;

    let paymentMethod : undefined | PaymentMethodEntity = this.paymentMethodList.find( e => e.PaymentMethodCod ===  PaymentMethodCodSelect );
    let Currency : undefined | CurrencyEntity = this.currencyList.find( e => e.CurrencyCod ===  CurrencyCodSelect );

    let outstandingBalance : number = Number(this.TrxPaymentComponenRequest.InputOutstandingBalance);

    if(paymentMethod){

      if(this.IsCash(paymentMethod)){
        this.trxPayment = this.transactionCash();
      }
      if(this.IsCard(paymentMethod)){
        this.trxPayment = this.transactionPos();
      }
      if(this.IsMethodPaymentOwn(paymentMethod)){
        this.trxPayment = this.transactionCreditNote();
      }
      this.trxPayment.PaymentMethodCod = paymentMethod.PaymentMethodCod;
    }

    if(Currency){
      this.trxPayment.CurrencyCod = Currency.CurrencyCod;
      this.trxPayment.NumExchangevalue = Currency.NumExchangevalue;
    }

    this.trxPayment.AmountPaid = Number(this.txtAmountPaid.nativeElement.value);
    this.trxPayment.TypeMovement = 'I'; // Ingreso

    if (this.trxPayment.AmountPaid <= 0) {
      this.toastrService.error("El monto a pagar debe ser mayor a cero.");
      return;
    }

    if (outstandingBalance == 0) {
      this.toastrService.error("Ya no existe saldo por pagar.");
      return;
    }
    if(paymentMethod){
      if(this.IsCard(paymentMethod) && this.trxPayment.AmountPaid > outstandingBalance){
        this.toastrService.error("Para este tipos de medios de pago no se puede pagar montos superiores al saldo.");
        return;
      }

      if(this.IsCash(paymentMethod) && this.trxPayment.AmountPaid > outstandingBalance){
        this.trxPayment.AmountReturned = this.trxPayment.AmountPaid - outstandingBalance;
      }

    }


    const rpt : ResponseWsDto = await this.trxPaymentService.Save(this.trxPayment);

    if(!rpt.ErrorStatus){

      const trxPaymentResult : TrxPaymentEntity = rpt.Data;

      this.TrxPaymentComponenRequest.TrxPaymentList.push(trxPaymentResult);

      this.EmitResultForm(trxPaymentResult);

      this.txtAmountPaid.nativeElement.value = "";

      this.toastrService.success("Operación realizada con exito.");

      this.toastrService.success("Se realiza el pago exitosamente");
    }else{
      this.toastrService.error(rpt.Message);
    }

  }

  transactionPos():TrxPaymentEntity{

    let TrxPayment : TrxPaymentEntity = new TrxPaymentEntity();

    TrxPayment.PaymentPlatform = "POS";
    TrxPayment.CardNumber = "4578************"
    TrxPayment.CardHolderName = "Cliente Generico"
    TrxPayment.PaymentStatus = "OK";
    TrxPayment.TransactionId = this.generateIdFromDate();

    return TrxPayment;

  }

  transactionCash():TrxPaymentEntity{

    let TrxPayment : TrxPaymentEntity = new TrxPaymentEntity();

    TrxPayment.PaymentPlatform = "FISICO";
    TrxPayment.PaymentStatus = "OK";

    return TrxPayment;

  }

  transactionCreditNote():TrxPaymentEntity{

    let TrxPayment : TrxPaymentEntity = new TrxPaymentEntity();

    TrxPayment.PaymentPlatform = "DOCUMENTO";
    TrxPayment.PaymentStatus = "OK";
    TrxPayment.TransactionId = this.creditNoteDetail.Document.CounterfoilCod+"-"+this.creditNoteDetail.Document.DocumentCod;

    return TrxPayment;

  }

  IsCash(paymentMethod : PaymentMethodEntity){
    return (paymentMethod.PaymentMethodType === "1001");
}

  IsCard(paymentMethod : PaymentMethodEntity){
      return (paymentMethod.PaymentMethodType === "1002" || paymentMethod.PaymentMethodType === "1003");
  }

  IsMethodPaymentOwn(paymentMethod : PaymentMethodEntity){
    return (paymentMethod.PaymentMethodType === "1015");
  }

  generateIdFromDate(): string {
    const now = new Date();
    const year = now.getFullYear();
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    const day = now.getDate().toString().padStart(2, '0');
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const seconds = now.getSeconds().toString().padStart(2, '0');
    const milliseconds = now.getMilliseconds().toString().padStart(3, '0');

    const id = `${year}${month}${day}_${hours}${minutes}${seconds}_${milliseconds}`;
    return id;
  }

  EmitResultForm(trxPayment : TrxPaymentEntity)
  {
    this.ResultForm.emit(trxPayment);
  }

  loadingModal(){
    
  }

  selectPaymentMethodCod(){
    let PaymentMethodCodSelect : string = this.cboPaymentMethodCod.nativeElement.value;

    this.txtDocumentVisible = (PaymentMethodCodSelect === 'NC001');
    this.txtAmountPaidConfigHtml.ReadOnly = (PaymentMethodCodSelect === 'NC001');
    this.cboCurrencyCodConfigHtml.ReadOnly = (PaymentMethodCodSelect === 'NC001');
    this.txtAmountPaid.nativeElement.value = (PaymentMethodCodSelect === 'NC001') ? "0" : String(this.TrxPaymentComponenRequest.InputOutstandingBalance);
  }

  async FindByDocumentCod(){

    let DocumentCod : string = this.txtDocumentCod.nativeElement.value;

    const rpt : ResponseWsDto = await this.creditNoteService.FindByDocumentCod(DocumentCod);

    if(!rpt.ErrorStatus){

      this.creditNoteDetail = rpt.Data;

      this.txtAmountPaid.nativeElement.value = String(this.creditNoteDetail.Headboard.NumTotalPrice);
      this.cboCurrencyCod.nativeElement.value = this.creditNoteDetail.Headboard.CurrencyCod;
      
    }

  }

  getPaymentDescription(PaymentMethodCod : string){
    return this.paymentMethodList.find( e => e.PaymentMethodCod === PaymentMethodCod)?.Description;
  }
  

}
