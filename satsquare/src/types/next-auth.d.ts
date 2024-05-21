import { User as UserModel } from "@prisma/client";
import "next-auth";

declare module "next-auth" {
  interface User extends UserModel {
    id: number;
  }
  interface Session {
    user: User;
  }
}