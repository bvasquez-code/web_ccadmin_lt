import { Injectable } from "@angular/core";
import { DataTablaGeneticDto } from "../model/dto/DataTablaGeneticDto";
import { ActionTableService } from "../interface/ActionTableService";

@Injectable({
    providedIn: 'root'
})

export class TableService
{
    dataTablaGenetic : DataTablaGeneticDto = new DataTablaGeneticDto();

    actionTableService? : ActionTableService;

    funcParam : any;

    constructor() {
    }

    public setActions(actionTableService : ActionTableService)
    {
        this.actionTableService = actionTableService;
    }

    public get(): DataTablaGeneticDto {
        return this.dataTablaGenetic;
    }

    public set(dataTablaGenetic: DataTablaGeneticDto): void {
        this.dataTablaGenetic = new DataTablaGeneticDto();
        this.dataTablaGenetic = dataTablaGenetic;
    }
 
}