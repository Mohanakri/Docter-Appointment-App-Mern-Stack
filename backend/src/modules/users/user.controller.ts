export const getProfile = async (req, res) => {
  res.json(await UserService.getProfile(req.user.id));
};

export const updateProfile = async (req, res) => {
  res.json(await UserService.updateProfile(req.user.id, req.body));
};
