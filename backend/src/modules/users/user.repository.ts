import { UserModel } from './user.model';

export const UserRepo = {
  findById: (id: string) => UserModel.findById(id),
  update: (id: string, data: any) => UserModel.findByIdAndUpdate(id, data)
};
