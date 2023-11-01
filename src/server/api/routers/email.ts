import { createTRPCRouter, rateLimitedProcedure } from "~/server/api/trpc";
import { z } from "zod";
import { Resend } from "resend";
import { env } from "~/env.mjs";
import { FormEmail } from "~/emails/form-email";
import { log } from "next-axiom";

const resend = new Resend(env.RESEND_API_KEY);

export const emailRouter = createTRPCRouter({
  sendContactEmail: rateLimitedProcedure
    .input(
      z.object({
        firstName: z.string().min(2).max(50),
        lastName: z.string().min(2).max(50),
        email: z.string().email(),
        message: z.string(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      log.info("User sent email", {
        firstName: input.firstName,
        lastName: input.lastName,
        email: input.email,
        message: input.message,
        user: ctx.ip,
      });
      return await resend.emails.send({
        from: "onbording@resend.dev",
        to: "jakob.roessner@outlook.de",
        subject: "Form Email from Weather.io",
        react: FormEmail({
          firstName: input.firstName,
          lastName: input.lastName,
          email: input.email,
          message: input.message,
        }),
      });
    }),
});
