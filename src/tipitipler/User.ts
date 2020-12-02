import { LandAgentT } from "./LandAgent";

type User = JSON &
  object & {
    name: string;
    email: string;
    photo?: string;
    password: string;
    rank?: number;
    isLandAgent: boolean;
    yearOfBirdth: string;
    landAgent?: LandAgentT;
    disabled: boolean;
  };

export { User };
