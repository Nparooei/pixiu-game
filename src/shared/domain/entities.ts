import { z } from "zod";

const UserSchema = z.object({
  userId: z
    .string(),
  userToken: z
    .string(),
  userScore: z.string()
});


type User = z.infer<typeof UserSchema>;

export { UserSchema, User };
