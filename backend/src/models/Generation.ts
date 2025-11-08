import { AppDataSource } from "../models/database";
import { Generation } from "../entities/Generation";
import { User } from "../entities/User";

export const createGeneration = async (
  userId: string,
  imageUrl: string,
  prompt: string,
  style: string,
  status: "success" | "error"
): Promise<Generation> => {
  const generationRepo = AppDataSource.getRepository(Generation);
  const userRepo = AppDataSource.getRepository(User);

  // Ensure user exists
  const user = await userRepo.findOneBy({ id: userId });
  if (!user) throw new Error("User not found");

  // Create new Generation entity
  const generation = generationRepo.create({
    user,
    image_url: imageUrl,
    prompt,
    style,
    status,
  });

  // Save and return the saved entity (with auto-generated ID & timestamps)
  return await generationRepo.save(generation);
};

export const findGenerationsByUserId = async (
  userId: string,
  limit: number = 5
): Promise<Generation[]> => {
  const generationRepo = AppDataSource.getRepository(Generation);

  const generations = await generationRepo.find({
    where: { user: { id: userId } },
    order: { created_at: "DESC" },
    take: limit,
    relations: ["user"], // optional if you need user info
  });

  return generations;
};
