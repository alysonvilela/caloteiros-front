import { Charge } from "@/interfaces/charge";
import axios, { AxiosError } from "axios";
import { useQuery } from "react-query";

type SuccessRequest = Charge[];
interface FailRequest {
  error: string;
  message: string;
}

const fetchUserCharges = async (userId: string) => {
  const res = await axios.get<SuccessRequest>(
    `${process.env.NEXT_PUBLIC_SERVICE_URL}/dev/charge/list`,
    {
      headers: {
        "x-owner-id": userId,
      },
    },
  );
  return res.data;
};

const useUserCharges = (userId?: string | null) => {
  return useQuery<SuccessRequest, AxiosError<FailRequest>>(
    ["user-charges", userId],
    () => fetchUserCharges(userId ?? ""),
    {
      retry: 3,
      retryDelay: 30000,
      enabled: !!userId,
    },
  );
};

export { useUserCharges, fetchUserCharges };
