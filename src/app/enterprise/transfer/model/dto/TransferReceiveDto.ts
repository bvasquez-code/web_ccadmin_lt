export class TransferReceiveDto {
    public transferCod: string;
    public user: string;
    public observation: string;

    constructor() {
        this.transferCod = '';
        this.user = '';
        this.observation = '';
    }
}
