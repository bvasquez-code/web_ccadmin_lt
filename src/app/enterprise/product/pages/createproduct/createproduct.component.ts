import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ProductService } from '../../service/product.service';
import { ResponseWsDto } from 'src/app/enterprise/shared/model/dto/ResponseWsDto';
import { ProductEntity } from '../../model/entity/ProductEntity';
import { ProductRegisterDto } from '../../model/dto/ProductRegisterDto';
import { Router } from '@angular/router';
import { BrandEntity } from '../../model/entity/BrandEntity';
import { CategoryEntity } from '../../model/entity/CategoryEntity';
import { ToastrService } from 'ngx-toastr';
import { AppFileEntity } from 'src/app/enterprise/system/model/entity/AppFileEntity';
import { ProductPictureEntity } from '../../model/entity/ProductPictureEntity';
import { ValidationHelper } from 'src/app/enterprise/shared/helper/ValidationHelper';
import Swal from 'sweetalert2';
import { ProductBarcodeEntity } from '../../model/entity/ProductBarcodeEntity';

@Component({
  selector: 'app-createproduct',
  templateUrl: './createproduct.component.html'
})
export class CreateproductComponent implements OnInit {

  ProductCod : string = "";
  ProductRegister : ProductRegisterDto = new ProductRegisterDto();
  BrandList : BrandEntity[] = [];
  CategoryList : CategoryEntity[] = [];
  validation : ValidationHelper = new ValidationHelper();

  lastKeypressTime: number = 0;
  inputBuffer: string = ''; 

  txtProductCodreadonly : boolean = false;

  @ViewChild('txtBarCode') txtBarCode!: ElementRef<HTMLInputElement>;
  @ViewChild('txtProductCod') txtProductCod!: ElementRef<HTMLInputElement>;
  @ViewChild('txtProductName') txtProductName!: ElementRef<HTMLInputElement>;
  @ViewChild('txtProductDesc') txtProductDesc!: ElementRef<HTMLInputElement>;
  @ViewChild('cboCategoryCod') cboCategoryCod!: ElementRef<HTMLSelectElement>;
  @ViewChild('cboBrandCod') cboBrandCod!: ElementRef<HTMLSelectElement>;
  @ViewChild('txtNumPrice') txtNumPrice!: ElementRef<HTMLInputElement>;
  @ViewChild('txtNumMaxStock') txtNumMaxStock!: ElementRef<HTMLInputElement>;
  @ViewChild('txtNumMinStock') txtNumMinStock!: ElementRef<HTMLInputElement>;

  constructor(
    private productService : ProductService,
    private router: Router,
    private toastrService : ToastrService
  ) 
  { 
    let urlTree : any = this.router.parseUrl(this.router.url);
    this.ProductCod =  (urlTree.queryParams['ProductCod']) ? urlTree.queryParams['ProductCod'] : "";
    this.FindDataForm(this.ProductCod);
  }

  ngOnInit(): void {
  }

  async FindDataForm(ProductCod : string)
  {
    const rpt : ResponseWsDto = await this.productService.FindDataForm(ProductCod);

    if( !rpt.ErrorStatus )
    {
      this.BrandList = rpt.DataAdditional.find( e => e.Name === "brandList" )?.Data;
      this.CategoryList = rpt.DataAdditional.find( e => e.Name === "categoryList" )?.Data;
      this.ProductRegister = rpt.DataAdditional.find( e => e.Name === "product" )?.Data;

      setTimeout(() => {this.loadingForm(this.ProductRegister);}, 100);
      
    }
  }

  loadingForm(ProductRegister : ProductRegisterDto)
  {
    if(!this.ProductRegister) return;

    this.txtProductCod.nativeElement.value = this.ProductRegister.product.ProductCod;
    this.txtProductName.nativeElement.value = this.ProductRegister.product.ProductName;
    this.txtProductDesc.nativeElement.value = this.ProductRegister.product.ProductDesc;
    this.cboBrandCod.nativeElement.value = this.ProductRegister.product.BrandCod;
    this.cboCategoryCod.nativeElement.value = this.ProductRegister.product.CategoryCod;

    this.txtProductCod.nativeElement.value = this.ProductRegister.config.ProductCod;
    this.txtNumPrice.nativeElement.value = String(this.ProductRegister.config.NumPrice);
    this.txtNumMaxStock.nativeElement.value = String(this.ProductRegister.config.NumMaxStock);
    this.txtNumMinStock.nativeElement.value = String(this.ProductRegister.config.NumMinStock);
    this.txtProductCodreadonly = true;

    if(this.ProductRegister.productBarcode){
      this.txtBarCode.nativeElement.value = this.ProductRegister.productBarcode.BarCode;
    }
  }

  async save()
  {
    if(!this.ProductRegister)
    {
      this.ProductRegister = new ProductRegisterDto();
    }
    this.ProductRegister.product.ProductCod = this.txtProductCod.nativeElement.value;
    this.ProductRegister.product.ProductName = this.txtProductName.nativeElement.value;
    this.ProductRegister.product.ProductDesc = this.txtProductDesc.nativeElement.value;
    this.ProductRegister.product.BrandCod = this.cboBrandCod.nativeElement.value;
    this.ProductRegister.product.CategoryCod = this.cboCategoryCod.nativeElement.value;

    this.ProductRegister.config.ProductCod = this.txtProductCod.nativeElement.value;
    this.ProductRegister.config.NumPrice = Number(this.txtNumPrice.nativeElement.value);
    this.ProductRegister.config.NumMaxStock = Number(this.txtNumMaxStock.nativeElement.value);
    this.ProductRegister.config.NumMinStock = Number(this.txtNumMinStock.nativeElement.value);
    this.ProductRegister.config.IsDiscontable = "N";
    this.ProductRegister.config.DiscountType = "-";
    this.ProductRegister.config.NumDiscountMax = 0;
    this.ProductRegister.config.Version = "V.1";

    if(!this.ProductRegister.productBarcode){
      this.ProductRegister.productBarcode = new ProductBarcodeEntity();
    }

    this.ProductRegister.productBarcode.ProductCod = this.txtProductCod.nativeElement.value;
    this.ProductRegister.productBarcode.BarCode = this.txtBarCode.nativeElement.value;

    if(!this.validate(this.ProductRegister)) return;

    const rpt : ResponseWsDto = await this.productService.Save(this.ProductRegister);

    if( !rpt.ErrorStatus )
    {
      this.toastrService.success("Operación realizada con exito.");

      this.router.navigate(['/enterprise/product/pages/listProduct']);
    }else{
      this.toastrService.error(rpt.Message);
    }
  }

  ResponseResultFormAppFile(event : any){

    const appFile : AppFileEntity = event;

    console.log(appFile);

    if(appFile){

      if(!this.ProductRegister)
      {
        this.ProductRegister = new ProductRegisterDto();
      }

      let productPicture : ProductPictureEntity = new ProductPictureEntity();

      productPicture.FileCod = appFile.FileCod;
      productPicture.ProductCod = this.txtProductCod.nativeElement.value;
      productPicture.IsPrincipal = "N";
      productPicture.appFile = appFile;

      this.ProductRegister.pictureList.push(productPicture);

    }

  }

  setImagePrincipal(FileCod : string){

    this.ProductRegister.pictureList.forEach(picture => {
      picture.IsPrincipal = 'N';
    });

    const fileImage = this.ProductRegister.pictureList.find( e=> e.FileCod === FileCod);

    if(fileImage){
      fileImage.IsPrincipal = "S";
    }
    
  }

  async deleteImage(productPicture : ProductPictureEntity){

    Swal.fire({
      title: '¿Estás seguro?',
      text: 'Esta imagen se eliminará permanentemente',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'No, cancelar'
    }).then(async (result) => {
      if (result.isConfirmed) {
        const rpt: ResponseWsDto = await this.productService.DeletePicture(productPicture);
        if (!rpt.ErrorStatus) {
          this.FindDataForm(this.ProductCod);
        }
      }
    });
  }

  validate(productRegister : ProductRegisterDto):boolean{
    try{
      

      this.validation.validLengthString(productRegister.product.ProductCod,20,"El codigo de producto solo puedo tener 20 caracteres");
      this.validation.validateIsNotEmpty(productRegister.product.ProductCod,"Debe ingresar un codigo para el producto");

      this.validation.validLengthString(productRegister.product.ProductName,128,"El nombre del producto solo puede tener 128 caracteres");
      this.validation.validateIsNotEmpty(productRegister.product.ProductName,"Debe ingresar un nombre para el producto");

      this.validation.validLengthString(productRegister.product.ProductDesc,256,"La descripición del producto solo puede tener 256 caracteres");

      this.validation.validateIsNotEmpty(productRegister.product.BrandCod,"Seleccione una marca");
      this.validation.validateIsNotEmpty(productRegister.product.CategoryCod,"Seleccione una categoria");

      this.validation.validateIsNotEmpty(productRegister.config.NumPrice,"Debe ingresar un precio para el producto");
      this.validation.validNumber(productRegister.config.NumPrice,null,0,"Precio no valido");

      return true;
    }catch(e : any){
      this.toastrService.error(e.message);
      return false;
    }
  }

  validateKeypress(event: KeyboardEvent,id: string){

    try{
      if(id === "txtProductCod"){
        this.validation.isValidString(event.key.toString(),"Error",/[a-zA-Z0-9]/);
      }
    }catch(e : any){
      event.preventDefault();
    }
  }

  ProductCodEnter(event: KeyboardEvent){
    const now = Date.now();
    const timeDifference = now - this.lastKeypressTime;
    let IsBarcodeReaderInput : boolean = false;

    if (timeDifference < 50) {
      this.inputBuffer += event.key;
    } else {
      this.inputBuffer = event.key;
    }

    this.lastKeypressTime = now;

    if (event.key === 'Enter') {
      if (this.isBarcodeScannerInput()) {
        IsBarcodeReaderInput = true;
      } else {
        IsBarcodeReaderInput = false;
      }
      this.inputBuffer = '';
    }
  }

  isBarcodeScannerInput(): boolean {
    return this.inputBuffer.length > 5;
  }


}
