import { HeaderTableGenericDto } from "./HeaderTableGenericDto";
import { InfoTablaGenericDto } from "./InfoTablaGenericDto";

export class DataTablaGeneticDto
{
    public NameTable : string = "";
    public Headers : HeaderTableGenericDto[] = [];
    public DataTable : InfoTablaGenericDto = new InfoTablaGenericDto();

    constructor()
    {
    }

    init(Headers : HeaderTableGenericDto[],DataTable : InfoTablaGenericDto,NameTable : string = "")
    {
        this.Headers = Headers;
        this.DataTable = DataTable;
        this.NameTable = NameTable;
    }

}