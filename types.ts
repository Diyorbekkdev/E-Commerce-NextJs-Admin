export interface CategoryTypes {
  _id: string;
  name: string;
  url: string;
  image: string;
}

export interface LayoutType {
  children: React.ReactNode;
}

export interface User {
  key?: React.Key;
  _id?: string;
  role?: number;
  firstName: string;
  lastName: string;
  username: string;
  phoneNumber: string;
  password?: string;
}



