import { UserModel } from '../users/user.model';

export const AuthRepository = {
  findByEmail: (email: string) => UserModel.findOne({ email }),
  create: (data: any) => UserModel.create(data),
};
