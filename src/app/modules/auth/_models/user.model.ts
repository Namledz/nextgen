import { AuthModel } from './auth.model';
import { AddressModel } from './address.model';
import { SocialNetworksModel } from './social-networks.model';

export class UserModel {
  id: number;
  uuid: string;
  first_name: string;
  last_name: string;
  password: string;
  email: string;
  role: number;
  pic: string;
  status: number;
  group: string;
  institution: string;
  // account information
  createdAt: string;
  updatedAt: string;

  setUser(user: any) {
    this.id = user.id;
    this.password = user.password || '';
    //this.fullname = user.fullname || '';
    this.email = user.email || '';
    this.pic = user.pic || './assets/media/users/default.jpg';
    this.role = user.role || [];
    // this.occupation = user.occupation || '';
    // this.companyName = user.companyName || '';
    // this.phone = user.phone || '';
    // this.address = user.address;
    // this.socialNetworks = user.socialNetworks;
  }
}
