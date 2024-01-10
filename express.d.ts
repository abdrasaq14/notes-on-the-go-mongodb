import { Request } from "express";
export interface AuthenticatedRequest extends Request {
  user?: string; // Adjust the properties according to your user object
  token?: { userToken: string }; // Adjust the properties according to your user object
  jwtSecret?: { secretKey: string };
  newUserId?: { UserId: number };
  session: Session & Partial<SessionData> & { token?: any };
}
