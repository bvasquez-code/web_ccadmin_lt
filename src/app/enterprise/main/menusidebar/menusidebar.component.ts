import { DOCUMENT } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MenuPagina } from 'src/app/enterprise/menu/model/entity/MenuPagina';
import { SubMenuPagina } from 'src/app/enterprise/menu/model/entity/SubMenuPagina';
import { DataSesionService } from '../../compartido/service/datasesion.service';


@Component({
  selector: 'app-menusidebar',
  templateUrl: './menusidebar.component.html'
})
export class MenusidebarComponent implements OnInit {

  constructor(
    @Inject(DOCUMENT) document: any,
    private dataSesionService: DataSesionService
  ) {
  }


  public g_flg_menu_defecto: boolean = false;
  public g_list_menu: MenuPagina[] = [];
  public isOpenMenu: boolean = false;

  ngOnInit(): void {
    this.ObtenerMenu();
  }

  ObtenerMenu() {
    this.g_list_menu.push(this.getOptionDashboard());

    if (this.dataSesionService.PermissionExists("AT000000")) this.g_list_menu.push(this.getOptionsAdminSales());

    if (this.dataSesionService.PermissionExists("SI000000")) this.g_list_menu.push(this.getOptionSystem());

    if (this.dataSesionService.PermissionExists("US000000")) this.g_list_menu.push(this.getOptionsUser());

    if (this.dataSesionService.PermissionExists("VT000000")) this.g_list_menu.push(this.getOptionsSale());

    if (this.dataSesionService.PermissionExists("PR000000")) this.g_list_menu.push(this.getOptionsProducts());

    if (this.dataSesionService.PermissionExists("CO000000")) this.g_list_menu.push(this.getOptionsPucharse());

    if (this.dataSesionService.PermissionExists("CJ000000")) this.g_list_menu.push(this.getOptionsCash());

    if (this.dataSesionService.PermissionExists("TR000000")) this.g_list_menu.push(this.getOptionsTransfer());


    let url = document.location.href;
    this.isOpenMenu = false;

    for (let i = 0; i < this.g_list_menu.length; i++) {

      const menu = this.g_list_menu[i];

      for (let j = 0; j < menu.list_sub_menu.length; j++) {

        const submenu = menu.list_sub_menu[j];

        if (submenu.url !== "" && submenu.url !== null && url.includes(submenu.url_position)) {
          submenu.flg_menu_activo = true;
          menu.flg_menu_activo = true;
          this.isOpenMenu = true;
          console.log({ submenu: submenu });
        }
      }
    }
  }


  getOptionsUser(): MenuPagina {
    let MainMenu: MenuPagina = new MenuPagina();
    MainMenu.url = "#";
    MainMenu.des_menu = "usuarios";
    MainMenu.icono = "nav-icon fa fa-cube";

    //bandeja de usuarios
    let ListUser: SubMenuPagina = new SubMenuPagina();
    ListUser.url = "enterprise/user/pages/listuser";
    ListUser.url_position = "enterprise/user/pages/listuser";
    ListUser.des_menu = "Bandeja de Usuarios";
    ListUser.icono = "nav-icon fa fa-cube";

    let CreateUser: SubMenuPagina = new SubMenuPagina();
    CreateUser.url = "enterprise/user/pages/createuser";
    CreateUser.url_position = "enterprise/user/pages/createuser";
    CreateUser.des_menu = "Creación de Usuarios";
    CreateUser.icono = "nav-icon fa fa-cube";
    CreateUser.IsVisible = false;

    if (this.dataSesionService.PermissionExists("US000001")) MainMenu.list_sub_menu.push(ListUser);
    if (this.dataSesionService.PermissionExists("US000003")) MainMenu.list_sub_menu.push(CreateUser);

    //bandeja de perfiles
    let ListProfile: SubMenuPagina = new SubMenuPagina();
    ListProfile.url = "enterprise/user/pages/listprofile";
    ListProfile.url_position = "enterprise/user/pages/listprofile";
    ListProfile.des_menu = "Bandeja de perfiles";
    ListProfile.icono = "nav-icon fa fa-cube";

    let CreateProfile: SubMenuPagina = new SubMenuPagina();
    CreateProfile.url = "enterprise/user/pages/createprofile";
    CreateProfile.url_position = "enterprise/user/pages/createprofile";
    CreateProfile.des_menu = "crear perfil de Usuarios";
    CreateProfile.icono = "nav-icon fa fa-cube";
    CreateProfile.IsVisible = false;

    if (this.dataSesionService.PermissionExists("US000002")) MainMenu.list_sub_menu.push(ListProfile);
    if (this.dataSesionService.PermissionExists("US000004")) MainMenu.list_sub_menu.push(CreateProfile);

    return MainMenu;
  }

  getOptionSystem(): MenuPagina {
    let MainMenu: MenuPagina = new MenuPagina();
    MainMenu.url = "#";
    MainMenu.des_menu = "sistema";
    MainMenu.icono = "nav-icon fa fa-cube";

    let ListMenu: SubMenuPagina = new SubMenuPagina();
    ListMenu.url = "enterprise/menu/pages/listmenu";
    ListMenu.url_position = "enterprise/menu/pages/listmenu";
    ListMenu.des_menu = "Bandeja de menús";
    ListMenu.icono = "nav-icon fa fa-cube";


    let CreateMenu: SubMenuPagina = new SubMenuPagina();
    CreateMenu.url = "enterprise/menu/pages/createmenu";
    CreateMenu.url_position = "enterprise/menu/pages/createmenu";
    CreateMenu.des_menu = "Crear Menu";
    CreateMenu.icono = "nav-icon fa fa-cube";
    CreateMenu.IsVisible = false;

    if (this.dataSesionService.PermissionExists("SI000001")) MainMenu.list_sub_menu.push(ListMenu);
    if (this.dataSesionService.PermissionExists("SI000002")) MainMenu.list_sub_menu.push(CreateMenu);

    return MainMenu;
  }

  getOptionDashboard(): MenuPagina {
    let MainMenu: MenuPagina = new MenuPagina();

    MainMenu.url = "";
    MainMenu.des_menu = "Dashboard";
    MainMenu.icono = "nav-icon fa fa-tachometer-alt";

    return MainMenu;
  }

  getOptionsSale(): MenuPagina {
    let MainMenu: MenuPagina = new MenuPagina();

    MainMenu.url = "#";
    MainMenu.des_menu = "Ventas";
    MainMenu.icono = "nav-icon fa fa-cube";

    let CreatePresale: SubMenuPagina = new SubMenuPagina();
    CreatePresale.url = "enterprise/sale/pages/createpresale";
    CreatePresale.url_position = "enterprise/sale/pages/createpresale";
    CreatePresale.des_menu = "Realizar venta";
    CreatePresale.icono = "nav-icon fa fa-cube";

    let ListPresale: SubMenuPagina = new SubMenuPagina();
    ListPresale.url = "enterprise/sale/pages/listpresale";
    ListPresale.url_position = "enterprise/sale/pages/listpresale";
    ListPresale.des_menu = "Preventa";
    ListPresale.icono = "nav-icon fa fa-cube";

    let ListSale: SubMenuPagina = new SubMenuPagina();
    ListSale.url = "enterprise/sale/pages/listsale";
    ListSale.url_position = "enterprise/sale/pages/listsale";
    ListSale.des_menu = "Facturación";
    ListSale.icono = "nav-icon fa fa-cube";

    let CreateSale: SubMenuPagina = new SubMenuPagina();
    CreateSale.url = "enterprise/sale/pages/createsale";
    CreateSale.url_position = "enterprise/sale/pages/createsale";
    CreateSale.des_menu = "Crear Facturación";
    CreateSale.icono = "nav-icon fa fa-cube";
    CreateSale.IsVisible = false;

    let ListCreditNote: SubMenuPagina = new SubMenuPagina();
    ListCreditNote.url = "enterprise/sale/pages/listcreditnote";
    ListCreditNote.url_position = "enterprise/sale/pages/listcreditnote";
    ListCreditNote.des_menu = "Nota de credito";
    ListCreditNote.icono = "nav-icon fa fa-cube";

    let CreateCreditNote: SubMenuPagina = new SubMenuPagina();
    CreateCreditNote.url = "enterprise/sale/pages/createcreditnote";
    CreateCreditNote.url_position = "enterprise/sale/pages/createcreditnote";
    CreateCreditNote.des_menu = "Crear nota de credito";
    CreateCreditNote.icono = "nav-icon fa fa-cube";
    CreateCreditNote.IsVisible = false;

    let ReturnStockCreditnote: SubMenuPagina = new SubMenuPagina();
    ReturnStockCreditnote.url = "enterprise/sale/pages/returnstockcreditnote";
    ReturnStockCreditnote.url_position = "enterprise/sale/pages/returnstockcreditnote";
    ReturnStockCreditnote.des_menu = "Crear nota de credito";
    ReturnStockCreditnote.icono = "nav-icon fa fa-cube";
    ReturnStockCreditnote.IsVisible = false;

    let ViewCreditNote: SubMenuPagina = new SubMenuPagina();
    ViewCreditNote.url = "enterprise/sale/pages/viewcreditnote";
    ViewCreditNote.url_position = "enterprise/sale/pages/viewcreditnote";
    ViewCreditNote.des_menu = "Ver nota de crédito";
    ViewCreditNote.icono = "nav-icon fa fa-cube";
    ViewCreditNote.IsVisible = false;


    if (this.dataSesionService.PermissionExists("VT000004")) MainMenu.list_sub_menu.push(CreatePresale);
    if (this.dataSesionService.PermissionExists("VT000002")) MainMenu.list_sub_menu.push(ListPresale);
    if (this.dataSesionService.PermissionExists("VT000003")) MainMenu.list_sub_menu.push(ListSale);
    if (this.dataSesionService.PermissionExists("VT000005")) MainMenu.list_sub_menu.push(CreateSale);
    if (this.dataSesionService.PermissionExists("VT000003")) MainMenu.list_sub_menu.push(ListCreditNote);
    if (this.dataSesionService.PermissionExists("VT000005")) MainMenu.list_sub_menu.push(CreateCreditNote);
    if (this.dataSesionService.PermissionExists("VT000005")) MainMenu.list_sub_menu.push(ReturnStockCreditnote);
    if (this.dataSesionService.PermissionExists("VT000005")) MainMenu.list_sub_menu.push(ViewCreditNote);

    return MainMenu;
  }

  getOptionsAdminSales(): MenuPagina {
    let MainMenu: MenuPagina = new MenuPagina();

    MainMenu.url = "#";
    MainMenu.des_menu = "Administrar tienda";
    MainMenu.icono = "nav-icon fa fa-cube";

    let ListClient: SubMenuPagina = new SubMenuPagina();
    ListClient.url = "enterprise/client/pages/listclient";
    ListClient.url_position = "enterprise/client/pages/listclient";
    ListClient.des_menu = "Bandeja de Clientes";
    ListClient.icono = "nav-icon fa fa-cube";

    let CreateClient: SubMenuPagina = new SubMenuPagina();
    CreateClient.url = "enterprise/client/pages/createclient";
    CreateClient.url_position = "enterprise/client/pages/createclient";
    CreateClient.des_menu = "Creación de clientes";
    CreateClient.icono = "nav-icon fa fa-cube";
    CreateClient.IsVisible = false;

    if (this.dataSesionService.PermissionExists("AT000001")) MainMenu.list_sub_menu.push(ListClient);
    if (this.dataSesionService.PermissionExists("AT000002")) MainMenu.list_sub_menu.push(CreateClient);

    return MainMenu;
  }

  getOptionsProducts(): MenuPagina {
    let MainMenu: MenuPagina = new MenuPagina();

    MainMenu.url = "#";
    MainMenu.des_menu = "Productos";
    MainMenu.icono = "nav-icon fa fa-cube";

    let ListProduct: SubMenuPagina = new SubMenuPagina();
    ListProduct.url = "enterprise/product/pages/listProduct";
    ListProduct.url_position = "enterprise/product/pages/listProduct";
    ListProduct.des_menu = "Bandeja de Productos";
    ListProduct.icono = "nav-icon fa fa-cube";

    let CreateProduct: SubMenuPagina = new SubMenuPagina();
    CreateProduct.url = "enterprise/product/pages/createProduct";
    CreateProduct.url_position = "enterprise/product/pages/createProduct";
    CreateProduct.des_menu = "Creación de Productos";
    CreateProduct.icono = "nav-icon fa fa-cube";
    CreateProduct.IsVisible = false;

    if (this.dataSesionService.PermissionExists("PR000001")) MainMenu.list_sub_menu.push(ListProduct);
    if (this.dataSesionService.PermissionExists("PR000005")) MainMenu.list_sub_menu.push(CreateProduct);


    let ListBrand: SubMenuPagina = new SubMenuPagina();
    ListBrand.url = "enterprise/product/pages/listBrand";
    ListBrand.url_position = "enterprise/product/pages/listBrand";
    ListBrand.des_menu = "Bandeja de Marcas";
    ListBrand.icono = "nav-icon fa fa-cube";

    let CreateBrand: SubMenuPagina = new SubMenuPagina();
    CreateBrand.url = "enterprise/product/pages/createBrand";
    CreateBrand.url_position = "enterprise/product/pages/createBrand";
    CreateBrand.des_menu = "Creación de Marcas";
    CreateBrand.icono = "nav-icon fa fa-cube";
    CreateBrand.IsVisible = false;

    if (this.dataSesionService.PermissionExists("PR000002")) MainMenu.list_sub_menu.push(ListBrand);
    if (this.dataSesionService.PermissionExists("PR000006")) MainMenu.list_sub_menu.push(CreateBrand);


    let ListCategory: SubMenuPagina = new SubMenuPagina();
    ListCategory.url = "enterprise/product/pages/listCategory";
    ListCategory.url_position = "enterprise/product/pages/listCategory";
    ListCategory.des_menu = "Bandeja de Categorias";
    ListCategory.icono = "nav-icon fa fa-cube";

    let CreateCategory: SubMenuPagina = new SubMenuPagina();
    CreateCategory.url = "enterprise/product/pages/createCategory";
    CreateCategory.url_position = "enterprise/product/pages/createCategory";
    CreateCategory.des_menu = "Creación de categorias";
    CreateCategory.icono = "nav-icon fa fa-cube";
    CreateCategory.IsVisible = false;

    if (this.dataSesionService.PermissionExists("PR000003")) MainMenu.list_sub_menu.push(ListCategory);
    if (this.dataSesionService.PermissionExists("PR000007")) MainMenu.list_sub_menu.push(CreateCategory);


    let ListKardex: SubMenuPagina = new SubMenuPagina();
    ListKardex.url = "enterprise/product/pages/listkardex";
    ListKardex.url_position = "enterprise/product/pages/listkardex";
    ListKardex.des_menu = "Kardex";
    ListKardex.icono = "nav-icon fa fa-cube";

    if (this.dataSesionService.PermissionExists("PR000004")) MainMenu.list_sub_menu.push(ListKardex);

    return MainMenu;
  }

  getOptionsPucharse(): MenuPagina {
    let MainMenu: MenuPagina = new MenuPagina();

    MainMenu.url = "#";
    MainMenu.des_menu = "Compras";
    MainMenu.icono = "nav-icon fa fa-cube";

    let ListPucharse: SubMenuPagina = new SubMenuPagina();
    ListPucharse.url = "enterprise/pucharse/pages/listpucharse";
    ListPucharse.url_position = "enterprise/pucharse/pages/listpucharse";
    ListPucharse.des_menu = "Bandeja de compras";
    ListPucharse.icono = "nav-icon fa fa-cube";

    let CreatePucharse: SubMenuPagina = new SubMenuPagina();
    CreatePucharse.url = "enterprise/pucharse/pages/createpucharse";
    CreatePucharse.url_position = "enterprise/pucharse/pages/createpucharse";
    CreatePucharse.des_menu = "Solicitud de compra";
    CreatePucharse.icono = "nav-icon fa fa-cube";
    CreatePucharse.IsVisible = false;

    let Confirmpucharse: SubMenuPagina = new SubMenuPagina();
    Confirmpucharse.url = "enterprise/pucharse/pages/confirmpucharse";
    Confirmpucharse.url_position = "enterprise/pucharse/pages/confirmpucharse";
    Confirmpucharse.des_menu = "Solicitud de compra";
    Confirmpucharse.icono = "nav-icon fa fa-cube";
    Confirmpucharse.IsVisible = false;

    let Listreception: SubMenuPagina = new SubMenuPagina();
    Listreception.url = "enterprise/pucharse/pages/listreception";
    Listreception.url_position = "enterprise/pucharse/pages/listreception";
    Listreception.des_menu = "Recepción de compras";
    Listreception.icono = "nav-icon fa fa-cube";

    if (this.dataSesionService.PermissionExists("CO000001")) MainMenu.list_sub_menu.push(ListPucharse);
    if (this.dataSesionService.PermissionExists("CO000003")) MainMenu.list_sub_menu.push(CreatePucharse);
    if (this.dataSesionService.PermissionExists("CO000002")) MainMenu.list_sub_menu.push(Listreception);
    if (this.dataSesionService.PermissionExists("CO000004")) MainMenu.list_sub_menu.push(Confirmpucharse);

    return MainMenu;
  }


  getOptionsCash(): MenuPagina {
    let MainMenu: MenuPagina = new MenuPagina();
    MainMenu.url = "#";
    MainMenu.des_menu = "Caja";
    MainMenu.icono = "nav-icon fa fa-cube";

    let ListRegister: SubMenuPagina = new SubMenuPagina();
    ListRegister.url = "enterprise/cash/pages/listcashregister";
    ListRegister.url_position = "enterprise/cash/pages/listcashregister";
    ListRegister.des_menu = "Bandeja de Cajas";
    ListRegister.icono = "nav-icon fa fa-cube";

    let CreateRegister: SubMenuPagina = new SubMenuPagina();
    CreateRegister.url = "enterprise/cash/pages/createcashregister";
    CreateRegister.url_position = "enterprise/cash/pages/createcashregister";
    CreateRegister.des_menu = "Crear Caja";
    CreateRegister.icono = "nav-icon fa fa-cube";
    CreateRegister.IsVisible = false;

    let OpenSession: SubMenuPagina = new SubMenuPagina();
    OpenSession.url = "enterprise/cash/pages/opencashsession";
    OpenSession.url_position = "enterprise/cash/pages/opencashsession";
    OpenSession.des_menu = "Aperturar Caja";
    OpenSession.icono = "nav-icon fa fa-cube";
    OpenSession.IsVisible = false;

    let CloseSession: SubMenuPagina = new SubMenuPagina();
    CloseSession.url = "enterprise/cash/pages/closecashsession";
    CloseSession.url_position = "enterprise/cash/pages/closecashsession";
    CloseSession.des_menu = "Cerrar Caja";
    CloseSession.icono = "nav-icon fa fa-cube";
    CloseSession.IsVisible = false;

    let ViewSession: SubMenuPagina = new SubMenuPagina();
    ViewSession.url = "enterprise/cash/pages/viewcashsession";
    ViewSession.url_position = "enterprise/cash/pages/viewcashsession";
    ViewSession.des_menu = "Ver Sesión Caja";
    ViewSession.icono = "nav-icon fa fa-cube";
    ViewSession.IsVisible = false;

    if (this.dataSesionService.PermissionExists("CJ000001")) MainMenu.list_sub_menu.push(ListRegister);
    if (this.dataSesionService.PermissionExists("CJ000002")) MainMenu.list_sub_menu.push(CreateRegister);

    if (this.dataSesionService.PermissionExists("CJ000003")) MainMenu.list_sub_menu.push(OpenSession);
    if (this.dataSesionService.PermissionExists("CJ000003")) MainMenu.list_sub_menu.push(CloseSession);
    if (this.dataSesionService.PermissionExists("CJ000003")) MainMenu.list_sub_menu.push(ViewSession);

    let ListCounterfoil: SubMenuPagina = new SubMenuPagina();
    ListCounterfoil.url = "enterprise/cash/pages/listcounterfoil";
    ListCounterfoil.url_position = "enterprise/cash/pages/listcounterfoil";
    ListCounterfoil.des_menu = "Talonarios";
    ListCounterfoil.icono = "nav-icon fa fa-cube";

    // permiso: usa el mismo que bandeja de cajas o uno nuevo si lo tienes
    if (this.dataSesionService.PermissionExists("CJ000001")) MainMenu.list_sub_menu.push(ListCounterfoil);


    return MainMenu;
  }

  getOptionsTransfer(): MenuPagina {
    let MainMenu: MenuPagina = new MenuPagina();
    MainMenu.url = "#";
    MainMenu.des_menu = "Transferencias";
    MainMenu.icono = "nav-icon fa fa-truck";

    let ListTransferRequest: SubMenuPagina = new SubMenuPagina();
    ListTransferRequest.url = "enterprise/transfer/pages/listtransferrequest";
    ListTransferRequest.url_position = "enterprise/transfer/pages/listtransferrequest";
    ListTransferRequest.des_menu = "Solicitudes de transferencia";
    ListTransferRequest.icono = "nav-icon fa fa-truck";

    let CreateTransferRequest: SubMenuPagina = new SubMenuPagina();
    CreateTransferRequest.url = "enterprise/transfer/pages/createtransferrequest";
    CreateTransferRequest.url_position = "enterprise/transfer/pages/createtransferrequest";
    CreateTransferRequest.des_menu = "Crear solicitud";
    CreateTransferRequest.icono = "nav-icon fa fa-truck";
    CreateTransferRequest.IsVisible = false;

    let ListTransferDispatch: SubMenuPagina = new SubMenuPagina();
    ListTransferDispatch.url = "enterprise/transfer/pages/listtransferdispatch";
    ListTransferDispatch.url_position = "enterprise/transfer/pages/listtransferdispatch";
    ListTransferDispatch.des_menu = "Despacho de transferencias";
    ListTransferDispatch.icono = "nav-icon fa fa-truck";

    let DirectTransfer: SubMenuPagina = new SubMenuPagina();
    DirectTransfer.url = "enterprise/transfer/pages/directtransfer";
    DirectTransfer.url_position = "enterprise/transfer/pages/directtransfer";
    DirectTransfer.des_menu = "Envío directo";
    DirectTransfer.icono = "nav-icon fa fa-truck";
    DirectTransfer.IsVisible = false;

    let DispatchTransfer: SubMenuPagina = new SubMenuPagina();
    DispatchTransfer.url = "enterprise/transfer/pages/dispatchtransfer";
    DispatchTransfer.url_position = "enterprise/transfer/pages/dispatchtransfer";
    DispatchTransfer.des_menu = "Despachar transferencia";
    DispatchTransfer.icono = "nav-icon fa fa-truck";
    DispatchTransfer.IsVisible = false;

    let ReceiveTransfer: SubMenuPagina = new SubMenuPagina();
    ReceiveTransfer.url = "enterprise/transfer/pages/receivetransfer";
    ReceiveTransfer.url_position = "enterprise/transfer/pages/receivetransfer";
    ReceiveTransfer.des_menu = "Recepcionar transferencia";
    ReceiveTransfer.icono = "nav-icon fa fa-truck";
    ReceiveTransfer.IsVisible = false;

    if (this.dataSesionService.PermissionExists("TR000001")) MainMenu.list_sub_menu.push(ListTransferRequest);
    if (this.dataSesionService.PermissionExists("TR000002")) MainMenu.list_sub_menu.push(CreateTransferRequest);
    if (this.dataSesionService.PermissionExists("TR000003")) MainMenu.list_sub_menu.push(ListTransferDispatch);
    if (this.dataSesionService.PermissionExists("TR000004")) MainMenu.list_sub_menu.push(DirectTransfer);
    if (this.dataSesionService.PermissionExists("TR000005")) MainMenu.list_sub_menu.push(DispatchTransfer);
    if (this.dataSesionService.PermissionExists("TR000006")) MainMenu.list_sub_menu.push(ReceiveTransfer);

    return MainMenu;
  }


}
