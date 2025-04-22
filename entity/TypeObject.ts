export type Location = {
    lat: number | null;
    lng: number | null;
}

export type MapInfo = {
    address: string;
    ref_id: string;
    display: string;
    phoneNumber?: string;
};

export type InputInfo = {
    input1: MapInfo | null;
    input2: MapInfo | null;
};
export type RegisterForm = {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  confirmPassword: string;
  phoneNumber: string;
  address: string;
  name: string;
  roleName: string;
  citizenIdFront: File | null,
  citizenIdBack: File | null,
  lat:number;
  lng:number;
  storeName:string;
}