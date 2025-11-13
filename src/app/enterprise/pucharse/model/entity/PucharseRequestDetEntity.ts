import { ProductEntity } from "src/app/enterprise/product/model/entity/ProductEntity";
import { AuditTableEntity } from "src/app/enterprise/shared/model/entity/AuditTableEntity";

export class PucharseRequestDetEntity extends AuditTableEntity
{
    public PucharseReqCod: string;
    public ProductCod: string;
    public Variant: string;
    public NumUnit: number;
    public NumUnitPrice: number;
    public NumTotalPrice: number;

    public Product : ProductEntity;

    constructor() {
        super();
        this.PucharseReqCod = '';
        this.ProductCod = '';
        this.Variant = '';
        this.NumUnit = 0;
        this.NumUnitPrice = 0;
        this.NumTotalPrice = 0;
        this.Product = new ProductEntity();
    }
}