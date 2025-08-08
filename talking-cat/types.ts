
export type Role = 'user' | 'model' | 'error';

export interface Message {
  role: Role;
  text: string;
}
