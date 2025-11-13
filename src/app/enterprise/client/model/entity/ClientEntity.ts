import { AuditTableEntity } from '../../../shared/model/entity/AuditTableEntity';
import { PersonEntity } from '../../../person/model/entity/PersonEntity';

export class ClientEntity extends AuditTableEntity
{
    public ClientCod: string = "";
	public PersonCod: string = "";

    public Person : PersonEntity = new PersonEntity();

    public DocumentNum : string = "";
    public Names : string = "";

    public constructor()
    {
        super();
    }

}