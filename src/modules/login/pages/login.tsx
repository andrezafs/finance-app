import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { SubmitHandler, useForm } from "react-hook-form";
import { LoginValidator, loginValidator } from "../validators/loginValidator";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Link, useNavigate } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { useAuthenticateMutation } from "@/graphql/generated/graphql";

import { useToast } from "@/hooks/use-toast";
import { sessionManager } from "@/lib/session-manager";
import { loginRoute } from "@/routes";

export function LoginForm() {
  const { toast } = useToast();
  const navigate = useNavigate();

  const form = useForm<LoginValidator>({
    resolver: zodResolver(loginValidator),
  });

  const { redirect } = loginRoute.useSearch();

  const { mutate } = useAuthenticateMutation({
    onError: () => {
      toast({
        title: "Erro!",
        description: "Erro ao realizar login!",
        variant: "destructive",
        duration: 3000,
      });
    },
    onSuccess: (data) => {
      sessionManager.authenticate(data.authenticate);
      navigate({ to: redirect ?? "/", replace: true });
    },
  });

  const onSubmit: SubmitHandler<LoginValidator> = (data) => mutate(data);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <Card className="mx-auto max-w-sm">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardHeader>
              <CardTitle className="text-2xl">Login</CardTitle>
              <CardDescription>
                Digite seus dados abaixo para fazer login em sua conta
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
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
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input placeholder="Digite sua senha" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full"
                  disabled={!form.formState.isValid}
                >
                  Entrar
                </Button>
              </div>
              <div className="mt-4 text-center text-sm">
                Não tem uma conta?{" "}
                <Link to="/createAccount" className="underline">
                  Crie uma
                </Link>
              </div>
            </CardContent>
          </form>
        </Form>
      </Card>
    </div>
  );
}
