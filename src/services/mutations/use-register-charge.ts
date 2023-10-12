import { Charge } from "@/interfaces/charge";
import { useAuth } from "@clerk/nextjs";
import axios, { AxiosError } from "axios";
import { useMutation, useQuery } from "react-query";
import {
  FailChargeRequest,
  SuccessTeamRequest,
  fetchRegisterCharge,
  fetchRegisterTeamToCharge,
} from "./use-register-team-to-charge";

interface Params {
  userId: string;
  charge: {
    demandDay: string;
    serviceName: string;
    totalPriceInCents: number;
  };
  team: {
    phones: string[];
  };
}

type UseRegisterChargesParam = {
  demandDay: string;
  serviceName: string;
  totalPriceInCents: number;
  phones: string[];
};

interface SuccessChargeRequest {
  charge: Charge;
  team: SuccessTeamRequest;
}

const fetchRegister = async ({ userId, charge, team }: Params) => {
  const chargeResult = await fetchRegisterCharge(userId, {
    demandDay: charge.demandDay,
    serviceName: charge.serviceName,
    totalPriceInCents: charge.totalPriceInCents,
  });

  const teamResult = await fetchRegisterTeamToCharge({
    userId,
    chargeId: chargeResult.id,
    body: {
      phones: team.phones,
    },
  });

  return {
    team: teamResult,
    charge: chargeResult,
  };
};

const useRegisterChargesMutation = () => {
  const { userId } = useAuth();
  return useMutation<
    SuccessChargeRequest,
    AxiosError<FailChargeRequest>,
    UseRegisterChargesParam
  >({
    mutationKey: ["register-charge"],
    mutationFn: ({ demandDay, phones, serviceName, totalPriceInCents }) =>
      fetchRegister({
        userId: userId ?? "",
        charge: {
          demandDay,
          serviceName,
          totalPriceInCents,
        },
        team: {
          phones,
        },
      }),
  });
};

export { useRegisterChargesMutation, fetchRegisterCharge };
