import { OptionTableGenericDto } from "./OptionTableGenericDto";

export class HeaderTableGenericDto
{
    public Name? : string = "";
    public key? : string = "";
    public ColumnAction? : boolean = false;
    public Id? : string[] = [];
    public IsStatus? : boolean = false;
    public IsDate? : boolean = false;
    public Options? :OptionTableGenericDto[] = [];
    public Html? : any;

    public constructor()
    {

    }
}