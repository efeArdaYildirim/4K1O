import { LangAgent } from "./LangAgent";

type User = {
  name: string;
  email: string;
  photo?: string;
  password: string;
  rank?: number;
  isLangAgent: boolean;
  birdthDay: string;
  langAgent?: LangAgent;
  disabled: boolean;
};

export { User };
