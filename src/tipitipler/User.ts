import { LangAgent } from "./LangAgent";

type User = JSON & {
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
