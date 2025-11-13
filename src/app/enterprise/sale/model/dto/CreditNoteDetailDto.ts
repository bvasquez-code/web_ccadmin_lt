import { ClientEntity } from "src/app/enterprise/client/model/entity/ClientEntity";
import { CreditNoteHeadEntity } from "../entity/CreditNoteHeadEntity";
import { CreditNoteDetDto } from "./CreditNoteDetDto";
import { CreditNoteDocumentEntity } from "../entity/CreditNoteDocumentEntity";

export class CreditNoteDetailDto {

    public Client: ClientEntity;
    public Headboard: CreditNoteHeadEntity;
    public Document : CreditNoteDocumentEntity;
    public DetailList: CreditNoteDetDto[];

    constructor() {
        this.Client = new ClientEntity();
        this.Headboard = new CreditNoteHeadEntity();
        this.Document = new CreditNoteDocumentEntity();
        this.DetailList = [];
    }
}
