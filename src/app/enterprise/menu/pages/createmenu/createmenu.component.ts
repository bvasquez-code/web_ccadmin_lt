import { AfterContentInit, AfterViewChecked, AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AppMenuService } from '../../service/appmenu.service';
import { ResponseWsDto } from 'src/app/enterprise/shared/model/dto/ResponseWsDto';
import { AppMenuEntity } from '../../model/entity/AppMenuEntity';
import { Router } from '@angular/router';

@Component({
  selector: 'app-createmenu',
  templateUrl: './createmenu.component.html'
})
export class CreatemenuComponent   {

  @ViewChild('txtMenuCod') txtMenuCod!: ElementRef<HTMLInputElement>;
  @ViewChild('txtName') txtName!: ElementRef<HTMLInputElement>;
  @ViewChild('txtDescription') txtDescription!: ElementRef<HTMLInputElement>;
  @ViewChild('cboIsMenuDad') cboIsMenuDad!: ElementRef<HTMLSelectElement>;
  @ViewChild('cboMenuDadCod') cboMenuDadCod!: ElementRef<HTMLSelectElement>;

  AppMenuDadList : AppMenuEntity[] = [];
  MenuCod : string = "";
  AppMenu : AppMenuEntity = new AppMenuEntity();

  txtMenuCodreadonly : boolean = false;
  cboMenuDadCodvisibility : boolean = true;

  constructor(
    private appMenuService : AppMenuService,
    private router: Router
  ) 
  { 

    let urlTree : any = this.router.parseUrl(this.router.url);
    this.MenuCod =  urlTree.queryParams['MenuCod'];
    this.findDataForm(this.MenuCod);
    
  }


  async findDataForm(MenuCod : string)
  {
    const rpt : ResponseWsDto = await this.appMenuService.findDataForm(MenuCod);

    if( !rpt.Status )
    {
      this.AppMenuDadList = rpt.DataAdditional.find( e => e.Name === "AppMenuDadList" )?.Data;
      this.AppMenu = rpt.DataAdditional.find( e => e.Name === "AppMenu" )?.Data;

      setTimeout(() => {this.loadingForm(this.AppMenu);}, 100);
      
    }
  }

  loadingForm(AppMenu : AppMenuEntity)
  {
    console.log("loadingForm ....");
    this.txtMenuCod.nativeElement.value = AppMenu.MenuCod;
    this.txtName.nativeElement.value  = AppMenu.Name;
    this.txtDescription.nativeElement.value  = AppMenu.Description;
    this.cboIsMenuDad.nativeElement.value  = AppMenu.IsMenuDad;
    this.cboMenuDadCod.nativeElement.value  = AppMenu.MenuDadCod;

    if(AppMenu.MenuCod) this.txtMenuCodreadonly = true;
    if(this.cboIsMenuDad.nativeElement.value === "S") this.cboMenuDadCodvisibility = false;

  }

  async save()
  {
    if(!this.AppMenu) this.AppMenu = new AppMenuEntity();
    
    this.AppMenu.MenuCod = this.txtMenuCod.nativeElement.value;
    this.AppMenu.Name = this.txtName.nativeElement.value;
    this.AppMenu.Description = this.txtDescription.nativeElement.value;
    this.AppMenu.IsMenuDad = this.cboIsMenuDad.nativeElement.value;
    this.AppMenu.MenuDadCod = ( this.AppMenu.IsMenuDad === "S" ) ? "" : this.cboMenuDadCod.nativeElement.value;

    const rpt : ResponseWsDto = await this.appMenuService.save(this.AppMenu);

    if( !rpt.Status )
    {
      
    }
  }

  IsMenuDad()
  {
    this.cboMenuDadCodvisibility = ( this.cboIsMenuDad.nativeElement.value === "S" ) ? false : true;
  }

}
