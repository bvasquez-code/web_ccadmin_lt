import { TrxPaymentEntity } from "../entity/TrxPaymentEntity";

export class TrxPaymentComponenRequestDto {

    public InputOutstandingBalance : number = 0;
    public TrxPaymentList : TrxPaymentEntity[] = [];

    constructor(){
        
    }
}
