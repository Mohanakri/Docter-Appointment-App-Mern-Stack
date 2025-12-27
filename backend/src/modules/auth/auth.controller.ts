import { AuthService } from './auth.service';

export const register = async (req, res) => {
  const token = await AuthService.register(req.body);
  res.json({ token });
};

export const login = async (req, res) => {
  const token = await AuthService.login(req.body);
  res.json({ token });
};


export const verifyAccount = async (req, res) => {
  await AuthRepository.verify(req.params.token);
  res.send('Account Verified');
};
