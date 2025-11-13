import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PruebaComponent } from './pages/prueba/prueba.component';
import { RegistropreventaComponent } from './enterprise/venta/pages/registropreventa/registropreventa.component';
import { MainComponent } from './enterprise/main/main.component';
import { HeaderComponent } from './enterprise/main/header/header.component';
import { MenusidebarComponent } from './enterprise/main/menusidebar/menusidebar.component';
import { FooterComponent } from './enterprise/main/footer/footer.component';
import { LoginComponent } from './enterprise/login/login.component';
import { SigninComponent } from './enterprise/login/signin/signin.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BasicAuthHtppInterceptorService } from './interceptors/BasicAuthHtppInterceptorService';
import { ModalDetalleProductoVentaComponent } from './enterprise/venta/pages/modal-detalle-producto-venta/modal-detalle-producto-venta.component';
import { ModdetalleprodventaComponent } from './enterprise/venta/pages/moddetalleprodventa/moddetalleprodventa.component';
import { CreatepresaleComponent } from './enterprise/sale/pages/createpresale/createpresale.component';
import { CreateproductComponent } from './enterprise/product/pages/createproduct/createproduct.component';
import { ListproductComponent } from './enterprise/product/pages/listproduct/listproduct.component';
import { CreatemenuComponent } from './enterprise/menu/pages/createmenu/createmenu.component';
import { ListmenuComponent } from './enterprise/menu/pages/listmenu/listmenu.component';
import { TableComponent } from './enterprise/shared/component/table/table.component';
import { CommonModule, DatePipe } from '@angular/common';
import { ListuserComponent } from './enterprise/user/pages/listuser/listuser.component';
import { CreateuserComponent } from './enterprise/user/pages/createuser/createuser.component';
import { ListprofileComponent } from './enterprise/user/pages/listprofile/listprofile.component';
import { CreateprofileComponent } from './enterprise/user/pages/createprofile/createprofile.component';
import { SpinnerComponent } from './enterprise/shared/component/spinner/spinner.component';
import { SpinnerInterceptor } from './interceptors/SpinnerInterceptor';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { CreatesaleComponent } from './enterprise/sale/pages/createsale/createsale.component';
import { ListclientComponent } from './enterprise/client/pages/listclient/listclient.component';
import { CreateclientComponent } from './enterprise/client/pages/createclient/createclient.component';
import { ModalalertComponent } from './enterprise/shared/component/modalalert/modalalert.component';
import { ModalsearchclientComponent } from './enterprise/client/pages/modalsearchclient/modalsearchclient.component';
import { ListpresaleComponent } from './enterprise/sale/pages/listpresale/listpresale.component';
import { ListbrandComponent } from './enterprise/product/pages/listbrand/listbrand.component';
import { CreatebrandComponent } from './enterprise/product/pages/createbrand/createbrand.component';
import { CreatecategoryComponent } from './enterprise/product/pages/createcategory/createcategory.component';
import { ListcategoryComponent } from './enterprise/product/pages/listcategory/listcategory.component';
import { CreatepucharseComponent } from './enterprise/pucharse/pages/createpucharse/createpucharse.component';
import { ListpucharseComponent } from './enterprise/pucharse/pages/listpucharse/listpucharse.component';
import { FormatoMonedaPeruanaPipe } from './enterprise/shared/pipe/FormatoMonedaPeruana.pipe';
import { ModalconfirmComponent } from './enterprise/shared/component/modalconfirm/modalconfirm.component';
import { ConfirmpucharseComponent } from './enterprise/pucharse/pages/confirmpucharse/confirmpucharse.component';
import { ListreceptionComponent } from './enterprise/pucharse/pages/listreception/listreception.component';
import { CreatetrxpaymentComponent } from './enterprise/trxpayment/pages/createtrxpayment/createtrxpayment.component';
import { ListsaleComponent } from './enterprise/sale/pages/listsale/listsale.component';
import { ListkardexComponent } from './enterprise/product/pages/listkardex/listkardex.component';
import { AppfileComponent } from './enterprise/system/pages/appfile/appfile.component';
import { ListcreditnoteComponent } from './enterprise/sale/pages/listcreditnote/listcreditnote.component';
import { CreatecreditnoteComponent } from './enterprise/sale/pages/createcreditnote/createcreditnote.component';
import { ReturnstockcreditnoteComponent } from './enterprise/sale/pages/returnstockcreditnote/returnstockcreditnote.component';
import { SaleStatusPipePipe } from './enterprise/sale/model/pipes/SaleStatusPipe.pipe';
import { ProductinfosalemodalComponent } from './enterprise/sale/modal/productinfosalemodal/productinfosalemodal.component';
import { ViewcreditnoteComponent } from './enterprise/sale/pages/viewcreditnote/viewcreditnote.component';

@NgModule({
  declarations: [
    AppComponent,
    MainComponent,
    HeaderComponent,
    MenusidebarComponent,
    FooterComponent,
    PruebaComponent,
    LoginComponent,
    SigninComponent,
    RegistropreventaComponent,
    ModalDetalleProductoVentaComponent,
    ModdetalleprodventaComponent,
    CreatepresaleComponent,
    CreateproductComponent,
    ListproductComponent,
    CreatemenuComponent,
    ListmenuComponent,
    TableComponent,
    ListuserComponent,
    CreateuserComponent,
    ListprofileComponent,
    CreateprofileComponent,
    SpinnerComponent,
    CreatesaleComponent,
    ListclientComponent,
    CreateclientComponent,
    ModalalertComponent,
    ModalsearchclientComponent,
    ListpresaleComponent,
    ListbrandComponent,
    CreatebrandComponent,
    CreatecategoryComponent,
    ListcategoryComponent,
    CreatepucharseComponent,
    ListpucharseComponent,
    FormatoMonedaPeruanaPipe,
    ModalconfirmComponent,
    ConfirmpucharseComponent,
    ListreceptionComponent,
    CreatetrxpaymentComponent,
    ListsaleComponent,
    ListkardexComponent,
    AppfileComponent,
    ListcreditnoteComponent,
    CreatecreditnoteComponent,
    ReturnstockcreditnoteComponent,
    SaleStatusPipePipe,
    ProductinfosalemodalComponent,
    ViewcreditnoteComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    CommonModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot(),
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: BasicAuthHtppInterceptorService,
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: SpinnerInterceptor,
      multi: true,
    },
    DatePipe
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
