import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DataTablaGeneticDto } from '../../model/dto/DataTablaGeneticDto';
import { TableService } from '../../service/table.service';
import { HeaderTableGenericDto } from '../../model/dto/HeaderTableGenericDto';
import { OptionTableGenericDto } from '../../model/dto/OptionTableGenericDto';
import { InfoPageDto } from '../../model/dto/InfoPageDto';
import { ResponsePageSearch } from '../../model/dto/ResponsePageSearch';
import { ActionTableService } from '../../interface/ActionTableService';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html'
})
export class TableComponent implements OnInit{

  dataSource : DataTablaGeneticDto = new DataTablaGeneticDto();
  actionTableService? : ActionTableService;

  @Input() set data(data: DataTablaGeneticDto) {
    this.dataSource = data;
  }

  @Input() set action(actionTableService : ActionTableService) {
    this.actionTableService = actionTableService;
  }


  constructor()
  {
  }

  ngOnInit(): void {

  }


  generateUrl(optionTableGeneric? : OptionTableGenericDto, item? : any, Headers? :HeaderTableGenericDto):string | any
  {
    let url : string = (optionTableGeneric?.Url) ? optionTableGeneric.Url : "";

    if(Headers?.Id)
    {
      for (let i = 0; i < Headers.Id.length; i++) {   
        url = url.replace("{"+Headers.Id[i]+"}",item[Headers.Id[i]]);  
      }
    }
    return url;
  }

  get LoadingPages():InfoPageDto[]
  {
    let ResponsePage : ResponsePageSearch = this.dataSource.DataTable.data;

    const InfoPageList : InfoPageDto[] = [];
    let NumPages : number[] = [];


    for (let index = 0; index < ResponsePage.TotalPages; index++) 
    {
      NumPages.push(index+1);
    }

    let ButtonPreview : InfoPageDto = new InfoPageDto();

    ButtonPreview.IsActive = true;
    ButtonPreview.NameButton = "Prev";
    ButtonPreview.ValueButton = ResponsePage.Page - 1;

    InfoPageList.push(ButtonPreview);

    if( NumPages.length < 13 )
    {
      for (let i = 0; i < NumPages.length; i++) {
      
        let Button : InfoPageDto = new InfoPageDto();

        Button.IsActive = true;
        Button.NameButton = NumPages[i].toString();
        Button.ValueButton = NumPages[i];

        InfoPageList.push(Button);   
      }

    }
    else
    {
      let Botones = [1,2,3
        ,ResponsePage.Page - 2
        ,ResponsePage.Page - 1
        ,ResponsePage.Page
        ,ResponsePage.Page + 1
        ,ResponsePage.Page + 2
        ,NumPages.length-1
        ,NumPages.length
        ,NumPages.length+1
      ]

      let ValueButtonPreview = -2;

      for (let i = 0; i < Botones.length; i++) {
      
        if( Botones[i] > 0 &&  Botones[i] <= ResponsePage.TotalResult )
        {

          let Existe : boolean = (InfoPageList.filter( 
            e => e.ValueButton === Botones[i] 
            && e.NameButton !== "Prev" 
            && e.NameButton !== "Next" 
          ).length > 0);

          if( Existe ) continue;

          if( Botones[i] - 1 !== ValueButtonPreview && ValueButtonPreview !== -2 )
          {
            let ButtonCenter : InfoPageDto = new InfoPageDto();
            ButtonCenter.IsActive = true;
            ButtonCenter.NameButton = "...";
            ButtonCenter.ValueButton = -2;
            InfoPageList.push(ButtonCenter);
          }

          let ButtonCenter : InfoPageDto = new InfoPageDto();
          ButtonCenter.IsActive = true;
          ButtonCenter.NameButton = Botones[i].toString();
          ButtonCenter.ValueButton = Botones[i];
          InfoPageList.push(ButtonCenter);

          ValueButtonPreview = Botones[i];
        }
        
      }

    }

    let ButtonNext : InfoPageDto = new InfoPageDto();

    ButtonNext.IsActive = true;
    ButtonNext.NameButton = "Next";
    ButtonNext.ValueButton = ResponsePage.Page + 1;

    if( ButtonNext.ValueButton === ResponsePage.TotalPages + 1)
    {
      ButtonNext.ValueButton = 0;
    }

    InfoPageList.push(ButtonNext);

    for (let i = 0; i < InfoPageList.length; i++) {

      let element = InfoPageList[i];

      if( ResponsePage.Page === element.ValueButton )
      {
        element.IsCurrent = true;
      }
      
    }
    return InfoPageList;
  }

  findResultPage(ValueButton : number)
  {
    console.log(ValueButton);
    this.actionTableService?.filter(ValueButton);
  }

  getDataRow(item : any):void
  {
    this.actionTableService?.getDataRow(item);
  }

}
