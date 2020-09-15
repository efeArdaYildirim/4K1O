import { LandAgentT } from "./LandAgent";

type User = JSON & {
  name: string;
  email: string;
  photo?: string;
  password: string;
  rank?: number;
  isLandAgent: boolean;
  birdthDay: string;
  landAgent?: LandAgentT;
  disabled: boolean;
};

export { User };
