import { ResponsePageSearch } from "../model/dto/ResponsePageSearch";

export interface ActionTableService
{
    filter(Page : number) : void;

    loadingTable(responsePageSearch : ResponsePageSearch):void;

    findAll(Page : number,Query : string): Promise<void>;

    getDataRow(item : any) :void;
}