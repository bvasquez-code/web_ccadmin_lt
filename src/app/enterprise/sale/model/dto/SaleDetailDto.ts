import { SaleDetEntity } from "../entity/SaleDetEntity";
import { SaleHeadEntity } from "../entity/SaleHeadEntity";

export class SaleDetailDto
{
    public Headboard : SaleHeadEntity;
    public DetailList : SaleDetEntity[];

    public constructor()
    {
        this.Headboard = new SaleHeadEntity();
        this.DetailList = [];
    }
}