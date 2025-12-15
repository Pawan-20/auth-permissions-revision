import { GitHubIcon } from "@/components/auth/o-auth-icons";
import { ComponentProps, ElementType } from "react";

export const SUPPORTED_OAUTH_PROVIDERS = ["github"] as const;
export type SupportedOAuthProvider = (typeof SUPPORTED_OAUTH_PROVIDERS)[number];

export const SUPPORTED_OAUTH_PROVIDERS_DETAILS: Record<
  SupportedOAuthProvider,
  { name: string; Icon: ElementType<ComponentProps<"svg">> }
  // typescript meaning of the above value.. a react component that accepts svg props. a valid entry will looklike this : Icon: (props) => <svg {...props} />
> = {
  github: { name: "github", Icon: GitHubIcon },
};
