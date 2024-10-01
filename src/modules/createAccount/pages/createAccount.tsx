import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  createAccountValidator,
  CreateAccountValidator,
} from "../validators/createAccountValidator";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Link } from "@tanstack/react-router";
import { useCreateUserMutation } from "@/graphql/generated/graphql";
import { toast } from "@/hooks/use-toast";

export default function CreateAccountForm() {
  const form = useForm<CreateAccountValidator>({
    resolver: zodResolver(createAccountValidator),
    mode: "onChange",
  });

  const { mutate } = useCreateUserMutation({
    onError: () => {
      toast({
        title: "Erro!",
        description: "Erro ao criar conta!",
        variant: "destructive",
        duration: 3000,
      });
    },
    onSuccess: () => {
      toast({
        title: "Sucesso!",
        description: "Conta criada com sucesso!",
        duration: 3000,
      });
    },
  });
  const onSubmit: SubmitHandler<CreateAccountValidator> = (data) =>
    mutate({
      data: {
        name: data.name,
        email: data.email,
        password: data.password,
      },
    });

  return (
    <div className="flex min-h-screen items-center justify-center">
      <Card className="mx-auto max-w-sm">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardHeader>
              <CardTitle className="text-xl">Crie uma conta</CardTitle>
              <CardDescription>
                Insira suas informações para criar uma conta
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nome</FormLabel>
                        <FormControl>
                          <Input placeholder="Digite seu Nome" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid gap-2">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>E-mail</FormLabel>
                        <FormControl>
                          <Input placeholder="Digite seu e-mail" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid gap-2">
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Senha</FormLabel>
                        <FormControl>
                          <Input placeholder="Digite sua senha" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid gap-2">
                  <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Confirme sua senha</FormLabel>
                        <FormControl>
                          <Input placeholder="Confirme sua senha" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full mt-"
                  disabled={!form.formState.isValid}
                >
                  Criar Conta
                </Button>
              </div>
              <div className=" mt-4 text-center text-sm">
                Já tem uma conta?{" "}
                <Link to="/login" className="underline">
                  Faça Login
                </Link>
              </div>
            </CardContent>
          </form>
        </Form>
      </Card>
    </div>
  );
}
