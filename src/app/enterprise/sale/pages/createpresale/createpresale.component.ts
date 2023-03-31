import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { ProductSearchDto } from 'src/app/enterprise/product/model/dto/ProductSearchDto';
import { ProductSearchService } from 'src/app/enterprise/product/service/productsearch.service';
import { ResponseWsDto } from 'src/app/enterprise/shared/model/dto/ResponseWsDto';
import { ResponsePageSearch } from '../../../shared/model/dto/ResponsePageSearch';
import { ProductSearchEntity } from '../../../product/model/entity/ProductSearchEntity';
import { DataSesionService } from 'src/app/enterprise/compartido/service/datasesion.service';
import { RespuestaPaginacionDto } from 'src/app/enterprise/compartido/entity/RespuestaPaginacionDto';
import { InfoPaginaDto } from 'src/app/enterprise/compartido/entity/InfoPaginaDto';
import { ProductService } from '../../../product/service/product.service';
import { ProductInfoDto } from 'src/app/enterprise/product/model/dto/ProductInfoDto';
import { PresaleRegisterDto } from '../../model/dto/PresaleRegisterDto';
import { ShoppingCartService } from '../../service/shoppingcart.service';
import { ProductVariantEntity } from 'src/app/enterprise/product/model/entity/ProductVariantEntity';
import { PresaleService } from '../../service/presale.service';
import { CurrencyEntity } from 'src/app/enterprise/shared/model/entity/CurrencyEntity';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { PresaleDetailDto } from '../../model/dto/PresaleDetailDto';
import { SaleDetailDto } from '../../model/dto/SaleDetailDto';
import { ClientService } from '../../../client/service/client.service';
import { ClientEntity } from '../../../client/model/entity/ClientEntity';

@Component({
  selector: 'app-createpresale',
  templateUrl: './createpresale.component.html'
})
export class CreatepresaleComponent implements OnInit {

  @Input() ResultFormClient : object | undefined;

  @ViewChild('txt_filtro_busqueda',{static: false}) txt_filtro_busqueda!: ElementRef<HTMLInputElement>;
  @ViewChild('txt_NumUnit',{static: false}) txt_NumUnit!: ElementRef<HTMLInputElement>;
  @ViewChild('txtDocumentNum',{static: false}) txtDocumentNum!: ElementRef<HTMLInputElement>;
  @ViewChild('cboDocumentType') cboDocumentType!: ElementRef<HTMLSelectElement>;

  productSearch : ProductSearchDto = new ProductSearchDto();
  responsePageSearch : ResponsePageSearch = new ResponsePageSearch();
  productList : ProductSearchEntity[] = [];
  productListHtml : ProductSearchEntity[][] = [];
  productInfoDtoSelect : ProductInfoDto = new ProductInfoDto();
  NumPhysicalStockTotal : number = 0;

  ShoppingCart : PresaleRegisterDto = new PresaleRegisterDto();
  CurrencySystem : CurrencyEntity = new CurrencyEntity();
  ShoppingCartResult : PresaleDetailDto = new PresaleDetailDto();
  SaleDetail : SaleDetailDto = new SaleDetailDto();
  PresaleDetail : PresaleDetailDto = new PresaleDetailDto();
  ShowClientRegister : boolean = false;
  ShowClient : boolean = false;
  ShowClientSearch : boolean = false;

  DocumentType : string = "";
  DocumentNum : string = "";

  g_RptBusquedaProducto : RespuestaPaginacionDto = new RespuestaPaginacionDto();
  g_ListaBoton : InfoPaginaDto[] = [];


  constructor(
     private productSearchService : ProductSearchService
    ,private session : DataSesionService
    ,private productService : ProductService
    ,private shoppingCartService : ShoppingCartService
    ,private presaleService : PresaleService
    ,private toastrService: ToastrService
    ,private router : Router
    ,private clientService : ClientService
  ) 
  { 
    let urlTree : any = this.router.parseUrl(this.router.url);
    this.ShoppingCart.Headboard.PresaleCod =  urlTree.queryParams['PresaleCod'];
    this.productSearch.StoreCod = this.session.getSessionStorageDto().StoreCod;
    this.productSearch.Page = 1;
    this.findAllProduct();
    this.findDataForm(this.ShoppingCart.Headboard.PresaleCod);

  }

  ngOnInit(): void {
    this.shoppingCartService.Init();
    this.updateShoppingCart();
  }

  async findAllProduct()
  {
    const response : ResponseWsDto = await this.productSearchService.query(this.productSearch);

    if( !response.ErrorStatus )
    {
        this.responsePageSearch = response.Data;
        this.productList = this.responsePageSearch.resultSearch;

        this.organizeProduct();

        this.g_ListaBoton = [];
        this.g_RptBusquedaProducto.addResultPage(this.responsePageSearch);
        this.g_ListaBoton = this.CalcularPaginacion(this.g_RptBusquedaProducto);
    }
  }

  async findDataForm(PresaleCod : string)
  {
    if( !PresaleCod ) PresaleCod = "";
    const response : ResponseWsDto = await this.presaleService.findDataForm(PresaleCod);

    if( !response.ErrorStatus )
    {
      this.CurrencySystem = response.DataAdditional.find( e => e.Name === "CurrencySystem" )?.Data;
      this.PresaleDetail = response.DataAdditional.find( e => e.Name === "PresaleDetail" )?.Data;
      
      if( this.PresaleDetail )
      {
        setTimeout(() => {this.SetCart(this.PresaleDetail);}, 100);
      }
    }
  }

  FiltrarProducto( p_num_pagina_busqueda : number  = 1)
  {
    if( p_num_pagina_busqueda <= 0 ) return;

    this.productSearch.StoreCod = this.session.getSessionStorageDto().StoreCod;
    this.productSearch.Query = this.txt_filtro_busqueda.nativeElement.value;
    this.productSearch.Page = p_num_pagina_busqueda;
    this.findAllProduct();
  }

  organizeProduct()
  {
    let l_num_Producto_fila : number = 4;
    let l_num_contador : number = 0;
    let l_SubListaProducto : ProductSearchEntity[] = [];
    this.productListHtml = [];

    for (let index = 0; index < this.productList.length; index++) 
    {
      const l_Producto :ProductSearchEntity = this.productList[index];

      if( l_num_Producto_fila > l_num_contador )
      {
        l_SubListaProducto.push(l_Producto);
        l_num_contador++;
      }
      else
      {
        this.productListHtml.push(l_SubListaProducto);
        l_num_contador = 0;
        l_SubListaProducto = [];

        l_SubListaProducto.push(l_Producto);
        l_num_contador++;
      }
      
    }

    if( l_SubListaProducto.length > 0 )
    {
      this.productListHtml.push(l_SubListaProducto);
    }
  }


  CalcularPaginacion(P_InfoPaginacion : RespuestaPaginacionDto):InfoPaginaDto[]
  {
      let l_numero_paginas : number[] = [];
      let l_ListaBoton : InfoPaginaDto[] = [];

      for (let index = 0; index < P_InfoPaginacion.num_total_paginas; index++) {
        
        l_numero_paginas.push(index+1);
        
      }

      let BotonPrev : InfoPaginaDto = new InfoPaginaDto();

      BotonPrev.flg_boton_activo = true;
      BotonPrev.nom_boton = "Prev";
      BotonPrev.valor_boton = P_InfoPaginacion.num_pagina_actual - 1;

      l_ListaBoton.push(BotonPrev);

      if( l_numero_paginas.length < 13 )
      {
        for (let i = 0; i < l_numero_paginas.length; i++) {
        
          let Boton : InfoPaginaDto = new InfoPaginaDto();

          Boton.flg_boton_activo = true;
          Boton.nom_boton = l_numero_paginas[i].toString();
          Boton.valor_boton = l_numero_paginas[i];

          l_ListaBoton.push(Boton);   
        }

      }
      else
      {
        let Botones = [1,2,3
          ,P_InfoPaginacion.num_pagina_actual - 2
          ,P_InfoPaginacion.num_pagina_actual - 1
          ,P_InfoPaginacion.num_pagina_actual
          ,P_InfoPaginacion.num_pagina_actual + 1
          ,P_InfoPaginacion.num_pagina_actual + 2
          ,l_numero_paginas.length-1
          ,l_numero_paginas.length
          ,l_numero_paginas.length+1
        ]

        let valor_boton_anterior = -2;

        for (let i = 0; i < Botones.length; i++) {
        
          if( Botones[i] > 0 &&  Botones[i] <= P_InfoPaginacion.num_total_paginas )
          {

            let Existe : boolean = (l_ListaBoton.filter( 
              e => e.valor_boton === Botones[i] 
              && e.nom_boton !== "Prev" 
              && e.nom_boton !== "Next" 
            ).length > 0);

            if( Existe ) continue;

            if( Botones[i] - 1 !== valor_boton_anterior && valor_boton_anterior !== -2 )
            {
              let BotonCentro : InfoPaginaDto = new InfoPaginaDto();
              BotonCentro.flg_boton_activo = true;
              BotonCentro.nom_boton = "...";
              BotonCentro.valor_boton = -2;
              l_ListaBoton.push(BotonCentro);
            }

            let BotonCentro : InfoPaginaDto = new InfoPaginaDto();
            BotonCentro.flg_boton_activo = true;
            BotonCentro.nom_boton = Botones[i].toString();
            BotonCentro.valor_boton = Botones[i];
            l_ListaBoton.push(BotonCentro);

            valor_boton_anterior = Botones[i];
          }
          
        }

      }

      let BotonNext : InfoPaginaDto = new InfoPaginaDto();

      BotonNext.flg_boton_activo = true;
      BotonNext.nom_boton = "Next";
      BotonNext.valor_boton = P_InfoPaginacion.num_pagina_actual + 1;

      if( BotonNext.valor_boton === P_InfoPaginacion.num_total_paginas + 1)
      {
        BotonNext.valor_boton = 0;
      }

      l_ListaBoton.push(BotonNext);

      for (let i = 0; i < l_ListaBoton.length; i++) {

        let element = l_ListaBoton[i];

        if( P_InfoPaginacion.num_pagina_actual === element.valor_boton )
        {
          element.flg_boton_actual = true;
        }
        
      }
      return l_ListaBoton;
  }

  async findDetailById(ProductCod : string) 
  {
    const response : ResponseWsDto = await this.productService.findDetailById({
      ProductCod : ProductCod,
      StoreCod : this.session.getSessionStorageDto().StoreCod
    });

    if( !response.ErrorStatus )
    {
        this.productInfoDtoSelect = response.Data;
        this.NumPhysicalStockTotal = this.productInfoDtoSelect.InfoList.map( item => item.NumPhysicalStock).reduce((a, b) => a + b, 0);
    }
  }

  async SetCart(PresaleDetail : PresaleDetailDto)
  {
    for(let Product of PresaleDetail.DetailList)
    {
      const response : ResponseWsDto = await this.productService.findDetailById({
        ProductCod : Product.ProductCod,
        StoreCod : this.session.getSessionStorageDto().StoreCod
      });

      Product.ProductInfo = response.Data;
    }

    this.shoppingCartService.SetCart(PresaleDetail);
    this.updateShoppingCart();
  }

  addUnit(ProductInfo : ProductInfoDto,ProductVariant : ProductVariantEntity)
  {
    this.shoppingCartService.addUnit(ProductInfo,ProductVariant);
    this.updateShoppingCart();
  }

  subtractUnit(ProductInfo : ProductInfoDto,ProductVariant : ProductVariantEntity)
  {
    this.shoppingCartService.subtractUnit(ProductInfo,ProductVariant);
    this.updateShoppingCart();
  }

  HandbookUnit(ProductInfo : ProductInfoDto,ProductVariant : ProductVariantEntity)
  {
    try
    {
      this.shoppingCartService.HandbookUnit(ProductInfo,ProductVariant,Number(this.txt_NumUnit.nativeElement.value));
      this.updateShoppingCart();
    }catch(e)
    {
      this.txt_NumUnit.nativeElement.value = "0";
    }
  }

  updateShoppingCart()
  {
    this.ShoppingCart = this.shoppingCartService.getCart();
  }

  getTotalProduct(ProductCod : string):number
  {
    return this.shoppingCartService.getTotalProduct(ProductCod);
  }

  getTotalProductVariant(ProductCod : string,Variant : string):number
  {
    return this.shoppingCartService.getTotalProductVariant(ProductCod,Variant);
  }

  DeleteProduct(ProductCod : string)
  {
    this.shoppingCartService.DeleteProduct(ProductCod);
    this.updateShoppingCart();
  }

  async save()
  {
    this.ShoppingCart.Headboard.CurrencyCod = this.CurrencySystem.CurrencyCod;

    const response : ResponseWsDto = await this.presaleService.save(this.ShoppingCart);

    if( !response.ErrorStatus )
    {
      this.toastrService.success(
        `Se genero la venta con el codigo ${response.Data.Headboard.PresaleCod}`, 
        'Operación realizada con exito');

        this.ShoppingCartResult = response.Data;
        this.Clean();
    }
  }

  newSale():void
  {
    this.router.navigate(['/enterprise/sale/pages/createpresale']);
    setTimeout(() => {window.location.reload();}, 100);
    
  }

  InitSale():void
  {
    this.ShoppingCartResult = new PresaleRegisterDto();   
  }

  Clean():void
  {
    this.shoppingCartService.Clean();
    this.ShoppingCart = new PresaleRegisterDto();
  }

  async Confirm()
  {
    this.ShoppingCart.Headboard = this.ShoppingCartResult.Headboard;
    this.ShoppingCart.DetailList = this.ShoppingCartResult.DetailList;

    const response : ResponseWsDto = await this.presaleService.confirm(this.ShoppingCart);

    if( !response.ErrorStatus )
    {
      this.SaleDetail = response.Data;
      const SaleCod : string = this.SaleDetail.Headboard.SaleCod;
      this.router.navigate(['/enterprise/sale/pages/createsale'], { queryParams: { SaleCod: SaleCod } });
    }
  }

  async findByDocumentNum()
  {
    this.DocumentType = this.cboDocumentType.nativeElement.value;
    this.DocumentNum = this.txtDocumentNum.nativeElement.value;

    const rpt : ResponseWsDto = await this.clientService.findByDocumentNum(this.DocumentType,this.DocumentNum);

    if( !rpt.ErrorStatus )
    {
      if(rpt.Data != null)
      {
        let Client : ClientEntity = rpt.Data;

        this.shoppingCartService.AddClient(Client);
        this.updateShoppingCart();

        this.ShowClientRegister = false;
        this.ShowClientSearch = false;
        this.ShowClient = true;
        
      }
      else
      {
        this.ShowClientRegister = true;
        this.ShowClientSearch = false;
        this.ShowClient = false;
      }
    }
  }

  ResponseResultFormClient(event : any) 
  {
    this.ResultFormClient = event;

    this.shoppingCartService.AddClient(event);
    this.updateShoppingCart();

    this.ShowClientRegister = false;
    this.ShowClientSearch = false;
    this.ShowClient = true;

  }

  OpenClientModal()
  {
    this.ShowClient = false;
    this.ShowClientRegister = false;
    this.ShowClientSearch = true;
  }

}
