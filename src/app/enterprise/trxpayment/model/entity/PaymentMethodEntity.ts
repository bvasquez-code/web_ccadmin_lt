import { AuditTableEntity } from "src/app/enterprise/shared/model/entity/AuditTableEntity";

export class PaymentMethodEntity extends AuditTableEntity {

    public PaymentMethodCod : string;
    public Name : string;
    public Description : string;
    public PaymentMethodType : string;

    constructor(){
        super();
        this.PaymentMethodCod = "";
        this.Name = "";
        this.Description = "";
        this.PaymentMethodType = "";
    }

}
