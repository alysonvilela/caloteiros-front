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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PlusCircleIcon } from "lucide-react";

export function RegisterChargeForm() {
  const { userId } = useAuth();
  const mutation = useRegisterChargesMutation();

//   mutation.mutateAsync({
//    demandDay: '',
//    serviceName: '',
//    totalPriceInCents: 2000
//   }, {
//    onSuccess(data, variables, context) {
      
//    },
//   })
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>
          <PlusCircleIcon className="mr-2 h-4 w-4" />
          Adicionar cobrança
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Adicione uma cobrança</DialogTitle>
          <DialogDescription>
            Para realizar suas cobrança adicione essas informações essenciais.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-5 items-center gap-4">
            <Label htmlFor="service-name" className="text-right col-span-2">
              Nome do serviço
            </Label>
            <Input
              id="service-name"
              defaultValue="Pedro Duarte"
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-5 items-center gap-4">
            <Label htmlFor="charge-day" className="text-right col-span-2">
              Dia da cobrança
            </Label>
            <Input
              id="charge-day"
              defaultValue="20"
              className="col-span-3"
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit">Save changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
