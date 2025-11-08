import { AppDataSource } from "../models/database";
import { User } from "../entities/User";

export interface IUser {
  id: string;
  email: string;
  password: string;
  created_at: string;
}

// Create a new user
export const createUser = async (
  email: string,
  hashedPassword: string
): Promise<IUser> => {
  const userRepo = AppDataSource.getRepository(User);

  const existing = await userRepo.findOneBy({ email });
  if (existing) {
    throw new Error("User already exists");
  }

  const newUser = userRepo.create({
    email,
    password: hashedPassword,
  });

  const savedUser = await userRepo.save(newUser);

  // Convert to plain object matching your old interface
  return {
    id: savedUser.id,
    email: savedUser.email,
    password: savedUser.password,
    created_at: savedUser.created_at.toISOString(),
  };
};

// Find user by email
export const findUserByEmail = async (
  email: string
): Promise<IUser | undefined> => {
  const userRepo = AppDataSource.getRepository(User);
  const user = await userRepo.findOneBy({ email });
  return user
    ? {
        id: user.id,
        email: user.email,
        password: user.password,
        created_at: user.created_at.toISOString(),
      }
    : undefined;
};

// Find user by id
export const findUserById = async (id: string): Promise<IUser | undefined> => {
  const userRepo = AppDataSource.getRepository(User);
  const user = await userRepo.findOneBy({ id });
  return user
    ? {
        id: user.id,
        email: user.email,
        password: user.password,
        created_at: user.created_at.toISOString(),
      }
    : undefined;
};
