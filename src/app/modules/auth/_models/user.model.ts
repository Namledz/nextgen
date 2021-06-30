import { AuthModel } from './auth.model';
import { AddressModel } from './address.model';
import { SocialNetworksModel } from './social-networks.model';

export class UserModel extends AuthModel {
  id: number;
  username: string;
  firstname: string;
  lastname: string;
  password: string;
  email: string;
  roles: number;
  pic: string;
  status: number;
  // account information
  createdAt: string;
  updatedAt: string;

  setUser(user: any) {
    this.id = user.id;
    this.username = user.username || '';
    this.password = user.password || '';
    //this.fullname = user.fullname || '';
    this.email = user.email || '';
    this.pic = user.pic || './assets/media/users/default.jpg';
    this.roles = user.roles || [];
    // this.occupation = user.occupation || '';
    // this.companyName = user.companyName || '';
    // this.phone = user.phone || '';
    // this.address = user.address;
    // this.socialNetworks = user.socialNetworks;
  }
}
