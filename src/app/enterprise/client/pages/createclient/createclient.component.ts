import { Component, ElementRef, EventEmitter, Input, Output, ViewChild, OnInit } from '@angular/core';
import { ClientService } from '../../service/client.service';
import { ClientEntity } from '../../model/entity/ClientEntity';
import { ResponseWsDto } from '../../../shared/model/dto/ResponseWsDto';
import { NonNullableFormBuilder } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-createclient',
  templateUrl: './createclient.component.html'
})
export class CreateclientComponent implements OnInit{

  @Input() InputDocumentNum : string = ""; 
  @Input() InputDocumentType : string = "";
  @Input() InvokeType : string = "form";
  @Output() ResultForm = new EventEmitter<object>();

  @ViewChild('cboPersonType') cboPersonType!: ElementRef<HTMLSelectElement>;
  @ViewChild('cboDocumentType') cboDocumentType!: ElementRef<HTMLSelectElement>;
  @ViewChild('txtDocumentNum') txtDocumentNum!: ElementRef<HTMLInputElement>;
  @ViewChild('txtNames') txtNames!: ElementRef<HTMLInputElement>;
  @ViewChild('txtLastNames') txtLastNames!: ElementRef<HTMLInputElement>;
  @ViewChild('txtCellPhone') txtCellPhone!: ElementRef<HTMLInputElement>;
  @ViewChild('txtEmail') txtEmail!: ElementRef<HTMLInputElement>;
  @ViewChild('txtPhone') txtPhone!: ElementRef<HTMLInputElement>;

  Client : ClientEntity = new ClientEntity();

  public constructor(
    private clientService : ClientService,
    private router: Router
  )
  {
    let urlTree : any = this.router.parseUrl(this.router.url);
    this.Client.ClientCod =  urlTree.queryParams['ClientCod'];
    if(this.Client.ClientCod) this.findDataForm(this.Client.ClientCod);

    setTimeout(() => {this.loadingModal();}, 100);
  }


  ngOnInit(): void {
    
  }

  
  async findDataForm(ClientCod : string)
  {
    const rpt : ResponseWsDto = await this.clientService.findDataForm(ClientCod);

    if( !rpt.Status )
    {
      this.Client = rpt.DataAdditional.find( e => e.Name === "Client" )?.Data;

      setTimeout(() => {this.loadingForm(this.Client);}, 100);
      
    }
  }

  async save()
  {
    if(!this.Client) this.Client = new ClientEntity();

      this.Client.Person.PersonType = this.cboPersonType.nativeElement.value;
      this.Client.Person.DocumentType = this.cboDocumentType.nativeElement.value;
      this.Client.Person.DocumentNum = this.txtDocumentNum.nativeElement.value;
      this.Client.Person.Names = this.txtNames.nativeElement.value;
      this.Client.Person.LastNames = this.txtLastNames.nativeElement.value;
      this.Client.Person.CellPhone = this.txtCellPhone.nativeElement.value;
      this.Client.Person.Email = this.txtEmail.nativeElement.value;
      this.Client.Person.Phone = this.txtPhone.nativeElement.value;

      const rpt : ResponseWsDto = await this.clientService.Save(this.Client);

      if( !rpt.ErrorStatus )
      {
        this.Client = rpt.Data;
        this.EmitResultForm(this.Client);
      }
  }

  async findByDocumentNum()
  {
    let DocumentType : string = "";
    let DocumentNum : string = "";

    if( String(this.txtDocumentNum.nativeElement.value).length != 8 ) return;

    DocumentType = this.cboDocumentType.nativeElement.value;
    DocumentNum = this.txtDocumentNum.nativeElement.value;

    const rpt : ResponseWsDto = await this.clientService.findByDocumentNum(DocumentType,DocumentNum);

    if( !rpt.ErrorStatus )
    {
      this.Client = rpt.Data;
      if(rpt.Data != NonNullableFormBuilder) this.loadingForm(this.Client);
    }

  }

  loadingForm( Client : ClientEntity )
  {
    this.cboPersonType.nativeElement.value = Client.Person.PersonType;
    this.cboDocumentType.nativeElement.value = Client.Person.DocumentType;
    this.txtDocumentNum.nativeElement.value = Client.Person.DocumentNum;
    this.txtNames.nativeElement.value = Client.Person.Names;
    this.txtLastNames.nativeElement.value = Client.Person.LastNames;
    this.txtCellPhone.nativeElement.value = Client.Person.CellPhone;
    this.txtEmail.nativeElement.value = Client.Person.Email;
    this.txtPhone.nativeElement.value = Client.Person.Phone;
  }

  EmitResultForm(Client : ClientEntity)
  {
    this.ResultForm.emit(Client);
  }

  loadingModal()
  {
    if( this.InvokeType === "modal" )
    {
      this.txtDocumentNum.nativeElement.value = this.InputDocumentNum;
      this.cboDocumentType.nativeElement.value = this.InputDocumentType;
    }
    
  }

}
