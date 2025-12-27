export const UserService = {
  getProfile: (id: string) => UserRepo.findById(id),
  updateProfile: (id: string, data: any) => UserRepo.update(id, data)
};
