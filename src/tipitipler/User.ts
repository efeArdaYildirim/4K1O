import { Emlak } from "./Emlak";

type User = {
  name: string;
  email: string;
  photo?: string;
  password: string;
  rank?: number;
  isEmlakci: boolean;
  BirdthDay: string;
  emlak?: Emlak;
  disabled: boolean;
};

export { User };
