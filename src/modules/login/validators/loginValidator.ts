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
    .min(8, { message: "Senha deve ter pelo menos 8 caracteres" })
    .trim(),
});

export type LoginValidator = z.infer<typeof loginValidator>;
