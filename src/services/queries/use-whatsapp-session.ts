import { IWpStatus } from "@/interfaces/enums/wp-status";
import axios, { AxiosError } from "axios";
import { useQuery } from "react-query";

interface SuccessRequest {
  me: {
    id: string;
    pushName: string;
  } | null;
  status: IWpStatus;
}
// interface SuccessRequest {
//   id: string
//   pushName: string
// }

interface FailRequest {
  error: string;
  message: string;
}

interface Params {
  enabled?: boolean;
}

const fetchWhatsAppSession = async () => {
  const res = await axios.get<SuccessRequest>(
    `${process.env.NEXT_PUBLIC_SERVICE_URL}/dev/admin/session`,
  );
  return res.data;
};

const useWhatsAppSession = (enabled: boolean) => {
  return useQuery<SuccessRequest, AxiosError<FailRequest>>(
    ["wp-session"],
    fetchWhatsAppSession,
    {
      retry: 3,
      retryDelay: 800,
      ...(enabled && {
        refetchIntervalInBackground: true,
        refetchInterval: 3000,
      }),
    },
  );
};

export { useWhatsAppSession, fetchWhatsAppSession };
