import { AuditTableEntity } from "src/app/enterprise/shared/model/entity/AuditTableEntity";

export class ProductPictureEntity extends AuditTableEntity
{
    public ProductCod : string = "";
    public FileCod : string = "";
    public IsPrincipal : string = "";
}