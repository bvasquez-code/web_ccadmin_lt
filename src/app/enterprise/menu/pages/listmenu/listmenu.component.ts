import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { DataTablaGeneticDto } from 'src/app/enterprise/shared/model/dto/DataTablaGeneticDto';
import { ResponsePageSearch } from 'src/app/enterprise/shared/model/dto/ResponsePageSearch';
import { ResponseWsDto } from 'src/app/enterprise/shared/model/dto/ResponseWsDto';
import { SearchDto } from 'src/app/enterprise/shared/model/dto/SearchDto';
import { AppMenuService } from '../../service/appmenu.service';
import { ActionTableService } from 'src/app/enterprise/shared/interface/ActionTableService';
import { AppMenuEntity } from '../../model/entity/AppMenuEntity';
import { ActionModalConfirmService } from 'src/app/enterprise/shared/interface/ActionModalConfirmService';

@Component({
  selector: 'app-listmenu',
  templateUrl: './listmenu.component.html'
})
export class ListmenuComponent implements OnInit,ActionTableService,ActionModalConfirmService {

  @ViewChild('txtSearch') txtSearch!: ElementRef<HTMLInputElement>;
  
  responsePageSearch : ResponsePageSearch = new ResponsePageSearch();

  dataTablaGenetic : DataTablaGeneticDto = new DataTablaGeneticDto();

  AppMenuSelectionClick : AppMenuEntity = new AppMenuEntity();
  
  constructor(
    private appMenuService : AppMenuService
  )
  {
  }

  ngOnInit(): void 
  {
    this.findAll(1,"");
  }

  getDataRow(item: AppMenuEntity) 
  {
    this.AppMenuSelectionClick = item;
    console.log(this.AppMenuSelectionClick);
  }

  filter(Page : number)
  {
    const Query = (this.txtSearch?.nativeElement?.value) ? this.txtSearch.nativeElement.value : "";
    this.findAll(Page,Query);
  }

  loadingTable(responsePageSearch : ResponsePageSearch)
  {
      const data : DataTablaGeneticDto = new DataTablaGeneticDto();
      data.init(
        [
          { Name :  "Codigo" , key : "MenuCod" } ,
          { Name :  "Descripción" , key : "Name"} ,
          { Name :  "Modificación", key : "ModifyDate" , IsDate : true },
          { Name :  "Estado" , 
            key : "Status" , 
            IsStatus : true,
            Html : {
              Activo : 'badge badge-sm bgc-info-d1 text-white pb-1 px-25',
              Inactivo : 'badge badge-sm bgc-red-d1 text-white pb-1 px-25'
            }
          },
          { Name :  "Opciones" , 
            ColumnAction : true , 
            Id : ["MenuCod"] , 
            Options : [
              { Type : "Url" , Name : "Editar" , Url : "/enterprise/menu/pages/createmenu?MenuCod={MenuCod}" },
              { Type : "Modal" , Name : "Eliminar" , Url : "#" },
              { Type : "Modal" , Name : "Activar" , Url : "#" }
            ] 
          }
        ],
        {
          data : responsePageSearch
        },
        "Lista de menus del sistema"
      );

      this.dataTablaGenetic = data;
  }

  async findAll(Page : number,Query : string): Promise<void>
  {
      let search : SearchDto = new SearchDto();
      search.Page = Page;
      search.Query = Query;

      const rpt : ResponseWsDto = await this.appMenuService.findAll(search);

      if( !rpt.ErrorStatus )
      {
          this.responsePageSearch = rpt.Data;  

          if(  this.responsePageSearch.resultSearch != null && this.responsePageSearch.resultSearch.length > 0 )
          {
              const resultSearch : AppMenuEntity[] = this.responsePageSearch.resultSearch;

              for(let element of resultSearch)
              {
                element.Status = (element.Status === "A") ? "Activo" : "Inactivo";
              }
          }
  
          this.loadingTable(this.responsePageSearch);
      }
  }

  actionModal(ModalId : string): void 
  {
    if(ModalId == "Eliminar") this.deactivateById();
    if(ModalId == "Activar") this.activateById();
  }

  async deactivateById()
  {
    this.AppMenuSelectionClick.Status = "I";
    const rpt : ResponseWsDto = await this.appMenuService.updateStatus(this.AppMenuSelectionClick);

    if( !rpt.ErrorStatus )
    {
      this.findAll(1,"");
    }
  }

  async activateById()
  {
    this.AppMenuSelectionClick.Status = "A";
    const rpt : ResponseWsDto = await this.appMenuService.updateStatus(this.AppMenuSelectionClick);

    if( !rpt.ErrorStatus )
    {
      this.findAll(1,"");
    }
  }

}
