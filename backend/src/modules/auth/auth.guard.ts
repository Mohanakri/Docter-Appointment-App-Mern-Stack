import { verifyToken } from './auth.tokens';

export const authGuard = (roles: string[] = []) => (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) throw new Error('Unauthorized');

  const payload: any = verifyToken(token);
  if (roles.length && !roles.includes(payload.role)) throw new Error('Forbidden');

  req.user = payload;
  next();
};
