import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ActionModalConfirmService } from 'src/app/enterprise/shared/interface/ActionModalConfirmService';
import { ActionTableService } from 'src/app/enterprise/shared/interface/ActionTableService';
import { ValidationHelper } from 'src/app/enterprise/shared/helper/ValidationHelper';
import { DataTablaGeneticDto } from 'src/app/enterprise/shared/model/dto/DataTablaGeneticDto';
import { ResponsePageSearch } from 'src/app/enterprise/shared/model/dto/ResponsePageSearch';
import { ResponseWsDto } from 'src/app/enterprise/shared/model/dto/ResponseWsDto';
import { BusinessConfigEntity } from 'src/app/enterprise/shared/model/entity/BusinessConfigEntity';
import { BusinessConfigGroupEntity } from '../../model/entity/BusinessConfigGroupEntity';
import { BusinessConfigGroupService } from '../../service/BusinessConfigGroupService';
import { BusinessConfigService } from '../../service/BusinessConfigService';

interface BusinessConfigDynamicField {
  column: string;
  nameKey: string;
  technicalKey: string;
  label: string;
  key: string;
  type: 'text' | 'number';
}

@Component({
  selector: 'app-createbusinessconfig',
  templateUrl: './createbusinessconfig.component.html'
})
export class CreatebusinessconfigComponent implements OnInit, ActionTableService<BusinessConfigEntity>, ActionModalConfirmService {

  @ViewChild('txtSearch') txtSearch!: ElementRef<HTMLInputElement>;

  GroupCod: string = "";
  ConfigCorr: number = 0;
  businessConfigGroup: BusinessConfigGroupEntity = new BusinessConfigGroupEntity();
  businessConfig: BusinessConfigEntity = new BusinessConfigEntity();
  dynamicFields: BusinessConfigDynamicField[] = [];
  responsePageSearch: ResponsePageSearch<BusinessConfigEntity> = new ResponsePageSearch();
  dataTablaGenetic: DataTablaGeneticDto<BusinessConfigEntity> = new DataTablaGeneticDto();
  businessConfigSelect: BusinessConfigEntity = new BusinessConfigEntity();

  private readonly fieldMap: BusinessConfigDynamicField[] = [
    { column: "ConfigCod", nameKey: "ConfigCodName", technicalKey: "ConfigCodKey", label: "", key: "", type: "text" },
    { column: "ConfigVal", nameKey: "ConfigValName", technicalKey: "ConfigValKey", label: "", key: "", type: "text" },
    { column: "ConfigName", nameKey: "ConfigNameName", technicalKey: "ConfigNameKey", label: "", key: "", type: "text" },
    { column: "ConfigDesc", nameKey: "ConfigDescName", technicalKey: "ConfigDescKey", label: "", key: "", type: "text" },
    { column: "Str1Config", nameKey: "Str1ConfigName", technicalKey: "Str1ConfigKey", label: "", key: "", type: "text" },
    { column: "Str2Config", nameKey: "Str2ConfigName", technicalKey: "Str2ConfigKey", label: "", key: "", type: "text" },
    { column: "Str3Config", nameKey: "Str3ConfigName", technicalKey: "Str3ConfigKey", label: "", key: "", type: "text" },
    { column: "Str4Config", nameKey: "Str4ConfigName", technicalKey: "Str4ConfigKey", label: "", key: "", type: "text" },
    { column: "Num1Config", nameKey: "Num1ConfigName", technicalKey: "Num1ConfigKey", label: "", key: "", type: "number" },
    { column: "Num2Config", nameKey: "Num2ConfigName", technicalKey: "Num2ConfigKey", label: "", key: "", type: "number" },
    { column: "Num3Config", nameKey: "Num3ConfigName", technicalKey: "Num3ConfigKey", label: "", key: "", type: "number" },
    { column: "Num4Config", nameKey: "Num4ConfigName", technicalKey: "Num4ConfigKey", label: "", key: "", type: "number" },
    { column: "Dcm1Config", nameKey: "Dcm1ConfigName", technicalKey: "Dcm1ConfigKey", label: "", key: "", type: "number" },
    { column: "Dcm2Config", nameKey: "Dcm2ConfigName", technicalKey: "Dcm2ConfigKey", label: "", key: "", type: "number" },
    { column: "Dcm3Config", nameKey: "Dcm3ConfigName", technicalKey: "Dcm3ConfigKey", label: "", key: "", type: "number" },
    { column: "Dcm4Config", nameKey: "Dcm4ConfigName", technicalKey: "Dcm4ConfigKey", label: "", key: "", type: "number" },
    { column: "Sta1Config", nameKey: "Sta1ConfigName", technicalKey: "Sta1ConfigKey", label: "", key: "", type: "text" },
    { column: "Sta2Config", nameKey: "Sta2ConfigName", technicalKey: "Sta2ConfigKey", label: "", key: "", type: "text" },
    { column: "Sta3Config", nameKey: "Sta3ConfigName", technicalKey: "Sta3ConfigKey", label: "", key: "", type: "text" },
    { column: "Sta4Config", nameKey: "Sta4ConfigName", technicalKey: "Sta4ConfigKey", label: "", key: "", type: "text" }
  ];

  constructor(
    private businessConfigGroupService: BusinessConfigGroupService,
    private businessConfigService: BusinessConfigService,
    private router: Router,
    private toastrService: ToastrService
  ) {
    const urlTree: any = this.router.parseUrl(this.router.url);
    this.GroupCod = urlTree.queryParams['GroupCod'] ?? "";
    this.ConfigCorr = Number(urlTree.queryParams['ConfigCorr'] ?? 0);
  }

  ngOnInit(): void {
    this.loadPage();
  }

  async loadPage(): Promise<void> {
    await this.loadGroup();
    await this.FindDataForm();
    await this.findAll(1, "");
  }

  async loadGroup(): Promise<void> {
    const rpt: ResponseWsDto = await this.businessConfigGroupService.findDataForm(this.GroupCod);
    if (!rpt.ErrorStatus) {
      this.businessConfigGroup = rpt.DataAdditional?.find(e => e.Name === "businessConfigGroup")?.Data
        ?? rpt.DataAdditional?.find(e => e.Name === "BusinessConfigGroup")?.Data
        ?? rpt.Data
        ?? new BusinessConfigGroupEntity();
      this.dynamicFields = this.resolveDynamicFields();
    }
  }

  async FindDataForm(): Promise<void> {
    const rpt: ResponseWsDto = await this.businessConfigService.findDataForm(this.GroupCod, this.ConfigCorr);

    if (!rpt.ErrorStatus) {
      this.businessConfig = rpt.DataAdditional?.find(e => e.Name === "businessConfig")?.Data
        ?? rpt.DataAdditional?.find(e => e.Name === "BusinessConfig")?.Data
        ?? rpt.Data
        ?? new BusinessConfigEntity();
      this.prepareBusinessConfig();
    }
  }

  async Save(): Promise<void> {
    this.prepareBusinessConfig();

    if (!this.validate()) return;

    const rpt: ResponseWsDto = await this.businessConfigService.save(this.businessConfig);
    if (!rpt.ErrorStatus) {
      this.toastrService.success("Configuracion guardada");
      this.ConfigCorr = 0;
      this.businessConfig = new BusinessConfigEntity();
      this.prepareBusinessConfig();
      this.findAll(1, "");
    }
  }

  validate(): boolean {
    try {
      ValidationHelper.validateIsNotEmpty(this.businessConfig.GroupCod, "Debe seleccionar un grupo");
      ValidationHelper.validNumber(this.businessConfig.GroupId, null, 1, "El grupo debe tener un id valido");

      if (this.isFieldEnabled("ConfigCod")) {
        ValidationHelper.validateIsNotEmpty(this.businessConfig.ConfigCod, "Debe ingresar el codigo de configuracion");
      }

      return true;
    } catch (e: any) {
      this.toastrService.error(e.message);
      return false;
    }
  }

  filter(Page: number): void {
    this.findAll(Page, this.txtSearch.nativeElement.value);
  }

  async findAll(Page: number, Query: string): Promise<void> {
    const rpt: ResponseWsDto = await this.businessConfigService.findAll(Query, Page, this.GroupCod);
    if (!rpt.ErrorStatus) {
      this.responsePageSearch = rpt.Data;
      this.loadingTable(this.responsePageSearch);
    }
  }

  loadingTable(responsePageSearch: ResponsePageSearch<BusinessConfigEntity>): void {
    const data: DataTablaGeneticDto<BusinessConfigEntity> = new DataTablaGeneticDto();
    const headers: any[] = [
      { Name: "Orden", key: "ConfigCorr" }
    ];

    this.dynamicFields.forEach(field => {
      headers.push({
        Name: field.label,
        key: field.column,
        FunctionKey: (item: BusinessConfigEntity) => item[field.column] ?? ""
      });
    });

    headers.push({
      Name: "Estado",
      key: "Status",
      IsStatus: true,
      Html: {
        A: 'badge badge-sm bgc-info-d1 text-white pb-1 px-25',
        I: 'badge badge-sm bgc-red-d1 text-white pb-1 px-25'
      },
      Mask: {
        A: "Activo",
        I: "Inactivo"
      }
    });

    headers.push({
      Name: "Opciones",
      ColumnAction: true,
      Id: ["GroupCod", "ConfigCorr"],
      Options: [
        { Type: "Url", Name: "fa fa-pencil-alt", Url: "/enterprise/businessconfiggroup/pages/createbusinessconfig?GroupCod={GroupCod}&ConfigCorr={ConfigCorr}" }
      ]
    });

    data.init(headers, { data: responsePageSearch }, "Valores configurados");
    this.dataTablaGenetic = data;
  }

  getDataRow(item: any): void {
    this.businessConfigSelect = item;
  }

  actionModal(ModalId: string): void {
  }

  goBack(): void {
    this.router.navigate(['/enterprise/businessconfiggroup/pages/listbusinessconfiggroup'], { queryParams: { GroupCod: this.GroupCod } });
  }

  private resolveDynamicFields(): BusinessConfigDynamicField[] {
    return this.fieldMap
      .map(field => {
        const name = this.businessConfigGroup[field.nameKey];
        const key = this.businessConfigGroup[field.technicalKey];

        return {
          ...field,
          label: this.getText(name) || this.getText(key) || field.column,
          key: this.getText(key)
        };
      })
      .filter(field => this.hasText(this.businessConfigGroup[field.nameKey]) || this.hasText(this.businessConfigGroup[field.technicalKey]));
  }

  private prepareBusinessConfig(): void {

    this.businessConfig.GroupId = this.businessConfigGroup.GroupId;
    this.businessConfig.GroupCod = this.businessConfigGroup.GroupCod;

    this.fieldMap.forEach(field => {
      if (!this.isFieldEnabled(field.column)) {
        this.businessConfig[field.column] = null;
      }
    });

    if(this.businessConfig.ConfigCorr === 0){
      this.businessConfig.ConfigCorr = this.getMaxConfigCorr() + 1;
    }
  }

  private isFieldEnabled(column: string): boolean {
    return this.dynamicFields.some(e => e.column === column);
  }

  private hasText(value: any): boolean {
    return this.getText(value) !== "";
  }

  private getText(value: any): string {
    if (value === null || value === undefined) return "";
    return String(value).trim();
  }

  private getMaxConfigCorr(): number {
    if (!this.responsePageSearch.resultSearch || this.responsePageSearch.resultSearch.length === 0) {
      return 0;
    }
    return Math.max(...this.responsePageSearch.resultSearch.map(e => e.ConfigCorr));
  }
}
