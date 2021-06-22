export interface UserCredentials {
  username: string;
  password: string;
}

export interface UserEntity {
  id: string;
  username: string;
  fullName: string;
}

export interface MessageEntity {
  id: string;
  sender: string;
  recipient: string;
  text: string;
}
