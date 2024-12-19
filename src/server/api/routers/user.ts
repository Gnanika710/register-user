import { userRegisterSchema } from "@/schema/userRegister";
import { TRPCError } from "@trpc/server";
import { createTRPCRouter, publicProcedure } from "../trpc";
import * as crypto from "crypto";
import { env } from "@/env";

const hashPassword = (password: string): { hash: string; salt: string } => {
  const salt = env.SALT;
  const hash = crypto
    .pbkdf2Sync(password, salt, 1000, 64, "sha512")
    .toString("hex");
  return { hash, salt };
};

export const userRouter = createTRPCRouter({
  create: publicProcedure
    .input(userRegisterSchema)
    .mutation(async ({ ctx, input }) => {
      const { hash } = hashPassword(input.password);
      const { error } = await ctx.db
        .from("user")
        .insert({ ...input, password: hash });
      if (error)
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Unable to create users",
        });
      return;
    }),
  read: publicProcedure.query(async ({ ctx }) => {
    const { data, error } = await ctx.db
      .from("user")
      .select("created_at, email, id, name");
    if (error)
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Unable to find users",
      });
    return data;
  }),
});
