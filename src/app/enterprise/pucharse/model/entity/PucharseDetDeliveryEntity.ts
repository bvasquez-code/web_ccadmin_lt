import { AuditTableEntity } from "src/app/enterprise/shared/model/entity/AuditTableEntity";

export class PucharseDetDeliveryEntity extends AuditTableEntity
{
    public PucharseCod: string;
    public ProductCod: string;
    public Variant: string;
    public WarehouseCod: string;
    public NumUnit: number;

    constructor() {
        super();
        this.PucharseCod = '';
        this.ProductCod = '';
        this.Variant = '';
        this.WarehouseCod = '';
        this.NumUnit = 0;
    }
}