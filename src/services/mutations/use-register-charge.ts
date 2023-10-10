import { Charge } from "@/interfaces/charge";
import { useAuth } from "@clerk/nextjs";
import axios, { AxiosError } from "axios";
import { useMutation, useQuery } from "react-query";

type SuccessRequest = Charge[];

interface FailRequest {
  error: string;
  message: string;
}

interface RequestBody {
  demandDay: string;
  serviceName: string;
  totalPriceInCents: number;
}

const fetchRegisterCharge = async (userId: string, body: RequestBody) => {
  const res = await axios.post<SuccessRequest>(
    `${process.env.NEXT_PUBLIC_SERVICE_URL}/dev/charge/register`,
    {
      body,
      headers: {
        "x-owner-id": userId,
      },
    }
  );
  return res.data;
};

const useRegisterChargesMutation = () => {
  const { userId } = useAuth();
  return useMutation<SuccessRequest, AxiosError<FailRequest>, RequestBody>({
    mutationKey: ["register-charges"],
    mutationFn: (body) => fetchRegisterCharge(userId ?? "", body),
  });
};

export { useRegisterChargesMutation, fetchRegisterCharge };
