import { DOCUMENT } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MenuPagina } from 'src/app/enterprise/menu/model/entity/MenuPagina';
import { SubMenuPagina } from 'src/app/enterprise/menu/model/entity/SubMenuPagina';


@Component({
  selector: 'app-menusidebar',
  templateUrl: './menusidebar.component.html'
})
export class MenusidebarComponent implements OnInit {

  constructor(
    @Inject(DOCUMENT) document: any
  ) 
  { 
    
    

  }
  

  public g_flg_menu_defecto : boolean = false;
  public g_list_menu : MenuPagina[] = [];
  public isOpenMenu : boolean = false;

  ngOnInit(): void {
    this.ObtenerMenu();
  }

  ObtenerMenu()
  {
    this.g_list_menu.push( this.getOptionDashboard() );

    this.g_list_menu.push( this.getOptionsAdminSales() );

    this.g_list_menu.push( this.getOptionSystem() );

    this.g_list_menu.push( this.getOptionsUser() );

    this.g_list_menu.push( this.getOptionsSale() );
    

    let l_MenuPagina3 : MenuPagina = new MenuPagina();
    l_MenuPagina3.url = "#";
    l_MenuPagina3.des_menu = "Productos";
    l_MenuPagina3.icono = "nav-icon fa fa-cube";
    this.g_list_menu.push( l_MenuPagina3 );


    let url = document.location.href;
    this.isOpenMenu = false;

    for (let i = 0; i < this.g_list_menu.length; i++) {
      
      const menu = this.g_list_menu[i];

      for (let j = 0; j < menu.list_sub_menu.length; j++) {
      
        const submenu = menu.list_sub_menu[j];

        if(submenu.url !== "" &&  submenu.url !== null && url.includes(submenu.url_position))
        {
            submenu.flg_menu_activo = true;
            menu.flg_menu_activo = true;
            this.isOpenMenu = true;
        }
      }
    }
  }


  getOptionsUser() : MenuPagina
  {
    let MainMenu : MenuPagina = new MenuPagina();
    MainMenu.url = "#";
    MainMenu.des_menu = "usuarios";
    MainMenu.icono = "nav-icon fa fa-cube";

    //bandeja de usuarios
    let ListUser : SubMenuPagina = new SubMenuPagina();
    ListUser.url = "enterprise/user/pages/listuser";
    ListUser.url_position = "enterprise/user/pages/listuser";
    ListUser.des_menu = "Bandeja de Usuarios";
    ListUser.icono = "nav-icon fa fa-cube";

    let CreateUser : SubMenuPagina = new SubMenuPagina();
    CreateUser.url = "enterprise/user/pages/createuser";
    CreateUser.url_position = "enterprise/user/pages/createuser";
    CreateUser.des_menu = "Creación de Usuarios";
    CreateUser.icono = "nav-icon fa fa-cube";
    CreateUser.IsVisible = false;

    MainMenu.list_sub_menu.push(ListUser);
    MainMenu.list_sub_menu.push(CreateUser);

    //bandeja de perfiles
    let ListProfile : SubMenuPagina = new SubMenuPagina();
    ListProfile.url = "enterprise/user/pages/listprofile";
    ListProfile.url_position = "enterprise/user/pages/listprofile";
    ListProfile.des_menu = "Bandeja de perfiles";
    ListProfile.icono = "nav-icon fa fa-cube";

    let CreateProfile : SubMenuPagina = new SubMenuPagina();
    CreateProfile.url = "enterprise/user/pages/createprofile";
    CreateProfile.url_position = "enterprise/user/pages/createprofile";
    CreateProfile.des_menu = "crear perfil de Usuarios";
    CreateProfile.icono = "nav-icon fa fa-cube";
    CreateProfile.IsVisible = false;

    MainMenu.list_sub_menu.push(ListProfile);
    MainMenu.list_sub_menu.push(CreateProfile);

    return MainMenu;
  }

  getOptionSystem() : MenuPagina
  {
    let MainMenu : MenuPagina = new MenuPagina();
    MainMenu.url = "#";
    MainMenu.des_menu = "sistema";
    MainMenu.icono = "nav-icon fa fa-cube";

    let ListMenu : SubMenuPagina = new SubMenuPagina();
    ListMenu.url = "enterprise/menu/pages/listmenu";
    ListMenu.url_position = "enterprise/menu/pages/listmenu";
    ListMenu.des_menu = "Bandeja de menús";
    ListMenu.icono = "nav-icon fa fa-cube";


    let CreateMenu : SubMenuPagina = new SubMenuPagina();
    CreateMenu.url = "enterprise/menu/pages/createmenu";
    CreateMenu.url_position = "enterprise/menu/pages/createmenu";
    CreateMenu.des_menu = "Crear Menu";
    CreateMenu.icono = "nav-icon fa fa-cube";
    CreateMenu.IsVisible = false;

    MainMenu.list_sub_menu.push(ListMenu);
    MainMenu.list_sub_menu.push(CreateMenu);

    return MainMenu;
  }

  getOptionDashboard() : MenuPagina
  {
    let MainMenu : MenuPagina = new MenuPagina();

    MainMenu.url = "";
    MainMenu.des_menu = "Dashboard";
    MainMenu.icono = "nav-icon fa fa-tachometer-alt";

    return MainMenu;
  }

  getOptionsSale(): MenuPagina
  {
    let MainMenu : MenuPagina = new MenuPagina();

    MainMenu.url = "#";
    MainMenu.des_menu = "Ventas";
    MainMenu.icono = "nav-icon fa fa-cube";

    let CreatePresale : SubMenuPagina = new SubMenuPagina();
    CreatePresale.url = "enterprise/sale/pages/createpresale";
    CreatePresale.url_position = "enterprise/sale/pages/createpresale";
    CreatePresale.des_menu = "Realizar venta";
    CreatePresale.icono = "nav-icon fa fa-cube";

    let ListPresale : SubMenuPagina = new SubMenuPagina();
    ListPresale.url = "enterprise/sale/pages/listpresale";
    ListPresale.url_position = "enterprise/sale/pages/listpresale";
    ListPresale.des_menu = "Preventa";
    ListPresale.icono = "nav-icon fa fa-cube";

    let ListSale : SubMenuPagina = new SubMenuPagina();
    ListSale.url = "enterprise/sale/pages/listsale";
    ListSale.url_position = "enterprise/sale/pages/listsale";
    ListSale.des_menu = "Facturación";
    ListSale.icono = "nav-icon fa fa-cube";

    let CreateSale : SubMenuPagina = new SubMenuPagina();
    CreateSale.url = "enterprise/sale/pages/createsale";
    CreateSale.url_position = "enterprise/sale/pages/createsale";
    CreateSale.des_menu = "Crear Facturación";
    CreateSale.icono = "nav-icon fa fa-cube";
    CreateSale.IsVisible = false;


    MainMenu.list_sub_menu.push(CreatePresale);
    MainMenu.list_sub_menu.push(ListPresale);
    MainMenu.list_sub_menu.push(ListSale);
    MainMenu.list_sub_menu.push(CreateSale);


    return MainMenu;
  }

  getOptionsAdminSales(): MenuPagina
  {
    let MainMenu : MenuPagina = new MenuPagina();

    MainMenu.url = "#";
    MainMenu.des_menu = "Administrar tienda";
    MainMenu.icono = "nav-icon fa fa-cube";

    let ListClient : SubMenuPagina = new SubMenuPagina();
    ListClient.url = "enterprise/client/pages/listclient";
    ListClient.url_position = "enterprise/client/pages/listclient";
    ListClient.des_menu = "Bandeja de Clientes";
    ListClient.icono = "nav-icon fa fa-cube";

    let CreateClient : SubMenuPagina = new SubMenuPagina();
    CreateClient.url = "enterprise/client/pages/createclient";
    CreateClient.url_position = "enterprise/client/pages/createclient";
    CreateClient.des_menu = "Creación de clientes";
    CreateClient.icono = "nav-icon fa fa-cube";
    CreateClient.IsVisible = false;

    MainMenu.list_sub_menu.push(ListClient);
    MainMenu.list_sub_menu.push(CreateClient);

    return MainMenu;
  }

}
