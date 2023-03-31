import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActionModalConfirmService } from 'src/app/enterprise/shared/interface/ActionModalConfirmService';
import { ActionTableService } from 'src/app/enterprise/shared/interface/ActionTableService';
import { DataTablaGeneticDto } from 'src/app/enterprise/shared/model/dto/DataTablaGeneticDto';
import { ResponsePageSearch } from 'src/app/enterprise/shared/model/dto/ResponsePageSearch';
import { PresaleService } from '../../service/presale.service';
import { SearchDto } from '../../../shared/model/dto/SearchDto';
import { PresaleHeadEntity } from '../../model/entity/PresaleHeadEntity';

@Component({
  selector: 'app-listpresale',
  templateUrl: './listpresale.component.html'
})
export class ListpresaleComponent implements OnInit,ActionTableService,ActionModalConfirmService{


  @ViewChild('txtSearch') txtSearch!: ElementRef<HTMLInputElement>;
  
  responsePageSearch : ResponsePageSearch = new ResponsePageSearch();
  
  dataTablaGenetic : DataTablaGeneticDto = new DataTablaGeneticDto();

  constructor(
    private presaleService : PresaleService
  )
  {
    
  }

  ngOnInit(): void {
    this.findAll(1,"");
  }

  filter(Page: number): void {
    this.findAll(Page,this.txtSearch.nativeElement.value);
  }
  loadingTable(responsePageSearch: ResponsePageSearch): void {
    
    const data : DataTablaGeneticDto = new DataTablaGeneticDto();
    data.init(
      [
        { Name :  "Codigo" , key : "PresaleCod" } ,
        { Name :  "Monto total" , key : "NumTotalPrice" } ,
        { Name :  "Vendedor" , key : "CreationUser"} ,
        { Name :  "Fecha de venta", key : "CreationDate" , IsDate : true },
        { Name :  "Estado" , 
          key : "SaleStatus" , 
          IsStatus : true,
          Html : {
            P : 'badge badge-sm bgc-info-d1 text-white pb-1 px-25',
            C : 'badge badge-sm bgc-red-d1 text-white pb-1 px-25'
          }
        },
        { Name :  "Opciones" , 
          ColumnAction : true , 
          Id : ["PresaleCod"] , 
          Options : [
            { Type : "Url" , Name : "Editar" , Url : "/enterprise/sale/pages/createpresale?PresaleCod={PresaleCod}" },
            { Type : "Modal" , Name : "Eliminar" , Url : "#" },
            { Type : "Modal" , Name : "Activar" , Url : "#" }
          ] 
        }
      ],
      {
        data : responsePageSearch
      },
      "Lista de solicitudes de venta"
    );

    this.dataTablaGenetic = data;

  }
  async findAll(Page: number, Query: string): Promise<void> {
    
    const search : SearchDto = new SearchDto();
    search.Page = Page;
    search.StoreCod = "T76T";
    search.Query = Query;
    const rpt = await this.presaleService.findAll(search);

    if( !rpt.ErrorStatus )
    {
      this.responsePageSearch = rpt.Data;  

      // const response : PresaleHeadEntity[] = rpt.Data;
      // const responseProcess : any[] = [];

      // for(const Item of response)
      // {
      //   const ItemProcess = {
      //     PresaleCod : Item.PresaleCod,
      //     NumTotalPrice : Item.NumTotalPrice,
      //     CreationUser : Item.CreationUser,
      //     CreationDate : Item.CreationDate,
      //     SaleStatus : Item.SaleStatus
      //   }
      //   responseProcess.push(ItemProcess);
      // }

      this.loadingTable(this.responsePageSearch);
    }

  }
  getDataRow(item: any): void {

  }
  actionModal(ModalId: string): void {
    throw new Error('Method not implemented.');
  }


}
