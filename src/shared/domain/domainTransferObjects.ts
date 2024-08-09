import { z } from "zod";

const userEmailSchema = z.string().email();

const EnvVariableSchema = z.string().min(1);

const postScoreInputSchema = z.object({
  userId: z.string(),
  userScore: z.string(),
  userToken: z.string(),
});

const getScoreInputSchema = z.object({
  userId: z.string(),
  userToken: z.string(),
});


const userAttributesSchema = z.object({
    userId: z.string(),
    userToken: z.string(),
    userScore: z.string().optional(),
  });

const lambdaInputSchema = z.object({
  body: z.string(),
});





export {
  userAttributesSchema,
  lambdaInputSchema,
  getScoreInputSchema,
  postScoreInputSchema,
  userEmailSchema,
  EnvVariableSchema,
};
