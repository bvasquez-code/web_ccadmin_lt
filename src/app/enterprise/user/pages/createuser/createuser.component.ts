import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AppUserEntity } from '../../model/entity/AppUserEntity';
import { AppUserService } from '../../service/appuser.service';
import { Router } from '@angular/router';
import { ResponseWsDto } from 'src/app/enterprise/shared/model/dto/ResponseWsDto';
import { AppProfileEntity } from '../../model/entity/AppProfileEntity';
import { UserProfileEntity } from '../../model/entity/UserProfileEntity';

@Component({
  selector: 'app-createuser',
  templateUrl: './createuser.component.html'
})
export class CreateuserComponent implements OnInit {

  @ViewChild('cboDocumentType') cboDocumentType!: ElementRef<HTMLSelectElement>;
  @ViewChild('txtDocumentNum') txtDocumentNum!: ElementRef<HTMLInputElement>;
  @ViewChild('txtNames') txtNames!: ElementRef<HTMLInputElement>;
  @ViewChild('txtLastNames') txtLastNames!: ElementRef<HTMLInputElement>;
  @ViewChild('txtCellPhone') txtCellPhone!: ElementRef<HTMLInputElement>;
  @ViewChild('txtEmail') txtEmail!: ElementRef<HTMLInputElement>;
  @ViewChild('txtUserCod') txtUserCod!: ElementRef<HTMLInputElement>;
  @ViewChild('txtPassword') txtPassword!: ElementRef<HTMLInputElement>;

  AppUser : AppUserEntity = new AppUserEntity();
  ProfileList : AppProfileEntity[] = [];

  constructor(
    private appUserService : AppUserService,
    private router: Router
  ) 
  { 

    let urlTree : any = this.router.parseUrl(this.router.url);
    this.AppUser.UserCod =  urlTree.queryParams['UserCod'];
    this.findDataForm(this.AppUser.UserCod);

  }

  ngOnInit(): void {
  }

  async findDataForm(UserCod : string)
  {
    const rpt : ResponseWsDto = await this.appUserService.findDataForm(UserCod);

    if( !rpt.Status )
    {
      this.AppUser = rpt.DataAdditional.find( e => e.Name === "User" )?.Data;
      this.ProfileList = rpt.DataAdditional.find( e => e.Name === "ProfileList" )?.Data;

      setTimeout(() => {this.loadingForm(this.AppUser);}, 100);
      
    }
  }

  loadingForm( AppUser : AppUserEntity )
  {
    this.txtUserCod.nativeElement.value = AppUser.UserCod;
    this.txtPassword.nativeElement.value = AppUser.PasswordDecoded;

    this.cboDocumentType.nativeElement.value = AppUser.Person.DocumentType;
    this.txtDocumentNum.nativeElement.value = AppUser.Person.DocumentNum;
    this.txtNames.nativeElement.value = AppUser.Person.Names;
    this.txtLastNames.nativeElement.value = AppUser.Person.LastNames;
    this.txtCellPhone.nativeElement.value = AppUser.Person.CellPhone;
    this.txtEmail.nativeElement.value = AppUser.Person.Email;
  }

  async save()
  {
      if(!this.AppUser) this.AppUser = new AppUserEntity();

      this.AppUser.UserCod = this.txtUserCod.nativeElement.value;
      this.AppUser.PasswordDecoded = this.txtPassword.nativeElement.value;

      this.AppUser.Person.DocumentType = this.cboDocumentType.nativeElement.value;
      this.AppUser.Person.DocumentNum = this.txtDocumentNum.nativeElement.value;
      this.AppUser.Person.Names = this.txtNames.nativeElement.value;
      this.AppUser.Person.LastNames = this.txtLastNames.nativeElement.value;
      this.AppUser.Person.CellPhone = this.txtCellPhone.nativeElement.value;
      this.AppUser.Person.Email = this.txtEmail.nativeElement.value;

      const rpt : ResponseWsDto = await this.appUserService.save(this.AppUser);

  }

  CheckedMenu(AppUser : AppProfileEntity)
  {
    if(!this.AppUser) this.AppUser = new AppUserEntity();

      if( this.AppUser.UserProfileList.find( e => e.ProfileCod === AppUser.ProfileCod ) )
      {
        this.AppUser.UserProfileList = this.AppUser.UserProfileList.filter( e => e.ProfileCod !== AppUser.ProfileCod );
      }
      else
      {
        let UserProfile : UserProfileEntity = new UserProfileEntity();

        UserProfile.ProfileCod = AppUser.ProfileCod;
        UserProfile.UserCod = this.txtDocumentNum.nativeElement.value;

        this.AppUser.UserProfileList.push( 
          UserProfile
        );
      }
  }

  IsChecked(AppUser : AppProfileEntity) :boolean
  {
    if(!this.AppUser) return false;

      const IsChecked : boolean = ( this.AppUser.UserProfileList.filter( e => e.ProfileCod === AppUser.ProfileCod ).length > 0 );

      return IsChecked;
  }

}
