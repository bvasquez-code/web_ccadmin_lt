export class SubMenuPagina{
    
    public des_menu : string;
    public url : string;
    public icono : string;
    public flg_menu_activo : boolean;
    public url_position : string;
    public IsVisible : boolean;

    constructor()
    {
        this.des_menu = "";
        this.url = "";
        this.icono = "";
        this.flg_menu_activo = false;
        this.url_position = "";
        this.IsVisible = true;
    }

}