export interface Charge {
  id: string;
  owner_id: string;
  demand_day: string;
  created_at: string;
  deleted_at: string;
  service: Service;
  updated_at?: any;
  custom_message?: any;
  team?: Team;
}

export interface Team {
  id: string;
  charge_id: string;
  created_at: string;
  members?: Member[];
  updated_at?: any;
}

export interface Member {
  id: string;
  added_at: string;
  deleted_at?: any;
  phone: string;
  team_id: string;
}

export interface Service {
  name: string;
  value: number;
}
