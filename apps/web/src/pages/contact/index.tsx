import type { SubmitHandler } from "react-hook-form";
import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import Layout from "~/components/Layout";
import { api } from "~/lib/utils/api";
import { getLocaleProps, useScopedI18n } from "~/locales";

const ContactUs = () => {
  const translationContact = useScopedI18n("contact");
  const translationCommon = useScopedI18n("common");

  const ContactValidator = z.object({
    firstName: z
      .string()
      .min(2, { message: translationContact("at least 2 characters") })
      .max(50),
    lastName: z
      .string()
      .min(2, { message: translationContact("at least 2 characters") })
      .max(50),
    email: z.string().email({ message: translationContact("invalid email") }),
    message: z
      .string()
      .min(10, { message: translationContact("at least 10 characters") })
      .max(500),
    // This is a honeypot to prevent spam
    testMessage: z.string().max(0),
  });

  type ContactValidatorType = z.infer<typeof ContactValidator>;

  let toastIdTmp: string | number;

  const mutation = api.email.sendContactEmail.useMutation({
    onMutate: () => {
      toastIdTmp = toast.loading(
        translationContact("sending email loading toast"),
      );
    },

    onSuccess: () => {
      toast.success(translationContact("sent toast"), { id: toastIdTmp });
      reset();
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ContactValidatorType>({
    resolver: zodResolver(ContactValidator),
  });

  const onSubmit: SubmitHandler<ContactValidatorType> = (data) => {
    mutation.mutate(data);
  };

  return (
    <>
      <Layout
        title={translationCommon("menu contact")}
        classNameShareButton="mt-24 md:mt-28"
        page="contact"
      >
        <div className="flex w-full flex-col items-center">
          <h1 className="mt-10 flex justify-center text-4xl font-bold">
            {translationCommon("menu contact")}
          </h1>
          <hr className="mt-3 h-1.5 w-6/12 rounded bg-[#2d3142] md:w-4/12" />
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex w-full flex-col items-center"
          >
            <div className="mb-2 ml-5 mr-5 mt-5 flex flex-col md:w-1/3 md:flex-row">
              <div className="mb-2 flex w-60 flex-col md:mb-0 md:mr-4 md:w-full">
                {errors.firstName && (
                  <p className="text-red-500" role="alert">
                    {errors.firstName.message}
                  </p>
                )}
                <label className="ml-2" htmlFor="firstname">
                  {translationContact("first name")}
                </label>
                <input
                  className="h-10 w-full rounded-md bg-[#d7d5db] pl-2"
                  id="firstname"
                  {...register("firstName")}
                />
              </div>
              <div className="flex w-60 flex-col md:w-full">
                {errors.lastName && (
                  <p className="text-red-500" role="alert">
                    {errors.lastName.message}
                  </p>
                )}
                <label className="ml-2" htmlFor="lastname">
                  {translationContact("last name")}
                </label>
                <input
                  className="h-10 w-full rounded-md bg-[#d8d5db] pl-2"
                  id="lastname"
                  {...register("lastName")}
                />
              </div>
            </div>
            <div className="mb-2 flex w-60 flex-col md:w-4/12">
              {errors.email && (
                <p className="text-red-500" role="alert">
                  {errors.email.message}
                </p>
              )}
              <label className="ml-2" htmlFor="email">
                {translationContact("email")}
              </label>
              <input
                className="h-10 w-full rounded-md bg-[#d8d5db] pl-2"
                id="email"
                autoComplete="email"
                {...register("email")}
              />
            </div>
            <div className="mb-8 flex w-60 flex-col md:w-4/12">
              {errors.message && (
                <p className="text-red-500" role="alert">
                  {errors.message.message}
                </p>
              )}
              <label className="ml-2" htmlFor="message">
                {translationContact("message")}
              </label>
              <textarea
                className="h-64 w-full resize-none rounded-md bg-[#d8d5db] pl-2"
                id="message"
                {...register("message")}
              />
            </div>
            <input className="hidden" {...register("testMessage")} />
            <button
              className="mb-8 rounded border-2 border-solid border-black bg-[#2d3142] pb-2 pl-4 pr-4 pt-2 font-bold text-white"
              type="submit"
            >
              <div>{translationContact("send button")}</div>
            </button>
          </form>
        </div>
      </Layout>
    </>
  );
};

export const getStaticProps = getLocaleProps();

export default ContactUs;
