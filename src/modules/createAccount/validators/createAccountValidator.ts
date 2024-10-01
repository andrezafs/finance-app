import { z } from "zod";

export const createAccountValidator = z
  .object({
    name: z.string({
      required_error: "Nome é obrigatório",
    }),
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
      .string()
      .min(1, { message: "É obrigatório informar uma senha." })
      .regex(/[A-Z]/g, "Utilize ao menos uma letra maiúscula")
      .regex(/[^a-zA-Z0-9&._-]/, "Utilize ao menos um caractere especial")
      .regex(/[0-9]/g, "utilize ao menos um número")
      .min(8, "Utilize ao menos 8 caracteres")
      .trim(),

    confirmPassword: z.string({
      required_error: "Confirme sua senha",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "As senhas devem ser iguais",
    path: ["confirmPassword"],
  });

export type CreateAccountValidator = z.infer<typeof createAccountValidator>;
