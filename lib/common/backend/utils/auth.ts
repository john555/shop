import { User } from "@prisma/client";

export type AuthContext = { req: { user: User } };
