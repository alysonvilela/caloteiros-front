import { useRegisterChargesMutation } from "@/services/mutations/use-register-charge";
import { useAuth } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  CurrencyInput,
  Input,
  PhoneInput,
  PhoneRegex,
} from "@/components/ui/input";
import { LoaderIcon, Plus, PlusCircleIcon, Trash } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useFieldArray, useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useState } from "react";
import { useQueryClient } from "react-query";
import { Separator } from "@/components/ui/separator";

const formSchema = z.object({
  serviceName: z.string().min(3, {
    message: "O serviço deve conter ao menos 3 caracteres.",
  }),
  demandDay: z
    .string()
    .transform((arg) => Number(arg))
    .pipe(
      z
        .number()
        .positive({
          message: "Adicione um dia de cobrança.",
        })
        .finite()
        .min(1, {
          message: "O menor dia possível é o dia 1.",
        })
        .max(28, {
          message: "O dia deve ser até o dia 28.",
        })
        .transform((arg) => String(arg)),
    ),
  price: z.string(),
  phones: z.array(
    z
      .string()
      .min(1, {
        message: "Adicione um número de celular.",
      })
      .regex(PhoneRegex, {
        message: "Número de celular inválido.",
      })
      .min(1),
  ),
});

export function RegisterChargeForm() {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();
  const mutation = useRegisterChargesMutation();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      serviceName: "",
      demandDay: "",
      price: "R$ 29,90",
      phones: [""],
    },
    mode: "onSubmit",
  });
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "phones" as never,
    keyName: "id",
  });

  const onOpenChange = (option: boolean) => {
    form.reset();
    setOpen(option);
  };

  function onSubmit(values: z.infer<typeof formSchema>) {
    const priceInCents = Number(
      values.price
        .slice(3, values.price.length)
        .replaceAll(",", "")
        .replaceAll(".", ""),
    );
    const cleanedPhones = values.phones
      .filter((i) => !!i)
      .map((phone) => phone.replace(/\D/g, ""));

    mutation.mutate(
      {
        demandDay: String(values.demandDay),
        serviceName: values.serviceName,
        totalPriceInCents: priceInCents,
        phones: cleanedPhones,
      },
      {
        onSuccess(_data) {
          queryClient.invalidateQueries({ queryKey: ["user-charges"] });
          queryClient.refetchQueries({ queryKey: ["user-charges"] });
          onOpenChange(false);
        },
      },
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange} modal>
      <DialogTrigger asChild>
        <Button>
          <PlusCircleIcon className="mr-2 h-4 w-4" />
          Adicionar cobrança
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <DialogHeader>
              <DialogTitle>Adicione uma cobrança</DialogTitle>
              <DialogDescription>
                Para realizar suas cobrança adicione essas informações
                essenciais.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <FormField
                control={form.control}
                name="serviceName"
                render={({ field }) => (
                  <FormItem className="grid grid-cols-5 items-center gap-x-4">
                    <FormLabel className="text-right col-span-2">
                      Nome do serviço
                    </FormLabel>
                    <FormControl className="col-span-3">
                      <Input placeholder="Netflix" {...field} />
                    </FormControl>
                    <FormMessage className="col-span-5 text-right" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="demandDay"
                render={({ field }) => (
                  <FormItem className="grid grid-cols-5 items-center gap-x-4">
                    <FormLabel className="text-right col-span-2">
                      Dia de cobrança
                    </FormLabel>
                    <FormControl className="col-span-3">
                      <Input maxLength={2} placeholder="20" {...field} />
                    </FormControl>
                    <FormMessage className="col-span-5 text-right" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem className="grid grid-cols-5 items-center gap-x-4">
                    <FormLabel className="text-right col-span-2">
                      Preço
                    </FormLabel>
                    <FormControl className="col-span-3">
                      <CurrencyInput {...field} />
                    </FormControl>
                    <FormMessage className="col-span-5 text-right" />
                  </FormItem>
                )}
              />
              <Separator className="my-4" />
              <DialogTitle className="flex gap-4">
                Membros
                <Button
                  size={"xs"}
                  variant={"secondary"}
                  onClick={() =>
                    append("", {
                      shouldFocus: true,
                      focusName: `phones.${fields.length}`,
                    })
                  }
                  type="button"
                >
                  <Plus size={14} /> ADICIONAR MEMBRO
                </Button>
              </DialogTitle>
              {fields.map((field, index) => (
                <FormField
                  key={field.id}
                  control={form.control}
                  name={`phones.${index}` as const}
                  render={({ field }) => (
                    <FormItem className="grid grid-cols-5 items-center gap-x-4">
                      <FormLabel className="text-right col-span-2">
                        Contato
                      </FormLabel>
                      <div className="col-span-3 flex gap-4">
                        <FormControl>
                          <PhoneInput
                            placeholder="+55 (11) 99999-9999"
                            {...field}
                          />
                        </FormControl>
                        {index > 0 && (
                          <Button
                            type="button"
                            size={"icon"}
                            onClick={() => remove(index)}
                            className="min-w-[40px] min-h-[40px]"
                          >
                            <Trash size={14} />
                          </Button>
                        )}
                      </div>

                      <FormMessage className="col-span-5 text-right" />
                    </FormItem>
                  )}
                />
              ))}
            </div>
            <DialogFooter>
              <Button disabled={mutation.isLoading} type="submit">
                {mutation.isLoading ? <LoaderIcon /> : "Registrar"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
