import { ProductEntity } from "src/app/enterprise/product/model/entity/ProductEntity";
import { AuditTableEntity } from "src/app/enterprise/shared/model/entity/AuditTableEntity";

export class TransferDetEntity extends AuditTableEntity {
    public TransferCod: string;
    public TypeOperation: string;
    public ProductCod: string;
    public Variant: string;
    public ItemNumber: number;
    public WarehouseCodOrigin: string;
    public WarehouseCodDest: string;
    public NumUnit: number;
    public LotNumber: string;
    public ExpirationDate?: Date | any;

    public Product: ProductEntity;

    constructor() {
        super();
        this.TransferCod = '';
        this.TypeOperation = '';
        this.ProductCod = '';
        this.Variant = '';
        this.ItemNumber = 0;
        this.WarehouseCodOrigin = '';
        this.WarehouseCodDest = '';
        this.NumUnit = 0;
        this.LotNumber = '';
        this.ExpirationDate = null;
        this.Product = new ProductEntity();
    }
}
