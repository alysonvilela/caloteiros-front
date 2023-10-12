import { Charge } from "@/interfaces/charge";
import axios from "axios";

type SuccessChargeRequest = Charge;

export interface FailChargeRequest {
  error: string;
  message: string;
}

interface RequestChargeBody {
  demandDay: string;
  serviceName: string;
  totalPriceInCents: number;
}

const fetchRegisterCharge = async (userId: string, body: RequestChargeBody) => {
  const res = await axios.post<SuccessChargeRequest>(
    `${process.env.NEXT_PUBLIC_SERVICE_URL}/dev/charge/register`,
    {
      ...body,
    },
    {
      headers: {
        "x-owner-id": userId,
      },
    },
  );
  return res.data;
};

export type SuccessTeamRequest = {
  team: {
    id: string;
  };
};

export interface RegisterTeamRequest {
  userId: string;
  body: {
    phones: string[];
  };
  chargeId: string;
}

const fetchRegisterTeamToCharge = async ({
  userId,
  chargeId,
  body,
}: RegisterTeamRequest) => {
  const res = await axios.post<SuccessTeamRequest>(
    `${process.env.NEXT_PUBLIC_SERVICE_URL}/dev/charge/${chargeId}/add-team`,
    {
      ...body,
    },
    {
      headers: {
        "x-owner-id": userId,
      },
    },
  );
  return res.data;
};

export { fetchRegisterCharge, fetchRegisterTeamToCharge };
