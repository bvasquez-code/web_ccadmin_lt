import { ResponsePageSearch } from "./ResponsePageSearch";

export class InfoTablaGenericDto
{
    public keys? : string[] = [];
    public data : ResponsePageSearch = new ResponsePageSearch();
}