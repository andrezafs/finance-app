import { z } from "zod";

export const loginValidator = z.object({
  email: z
    .string({
      required_error: "E-mail é obrigatório",
    })
    .email({
      message: "Digite um e-mail válido",
    })
    .trim()
    .refine((value) => value.toLocaleLowerCase()),

  password: z
    .string({
      required_error: "Senha é obrigatória",
    })
    .min(1, { message: "É obrigatório informar uma senha" })
    .trim(),
});

export type LoginValidator = z.infer<typeof loginValidator>;
