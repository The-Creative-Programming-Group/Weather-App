import { log } from "next-axiom";
import { Resend } from "resend";
import { z } from "zod";

import { env } from "../../env";
import { FormEmail } from "../emails/form-email";
import { createTRPCRouter, rateLimitedProcedure } from "../trpc";

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
        subject: !process.env.TEST_MODE
          ? "Form Email from Weather.io"
          : "TEST: Form Email from Weather.io",
        react: FormEmail({
          firstName: input.firstName,
          lastName: input.lastName,
          email: input.email,
          message: input.message,
        }),
      });
    }),
});
