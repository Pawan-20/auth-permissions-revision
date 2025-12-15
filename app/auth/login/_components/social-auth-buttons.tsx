"use client";

import { BetterAuthActionButton } from "@/components/auth/better-auth-action-btn";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import {
  SUPPORTED_OAUTH_PROVIDERS,
  SUPPORTED_OAUTH_PROVIDERS_DETAILS,
} from "@/lib/o-auth-providers";

export function SocialAuthButtons() {
  return SUPPORTED_OAUTH_PROVIDERS.map((provider) => {
    const Icon = SUPPORTED_OAUTH_PROVIDERS_DETAILS[provider].Icon;

    return (
      <BetterAuthActionButton
        variant="outline"
        key={provider}
        action={() =>
          authClient.signIn.social({ provider: provider, callbackURL: "/" })
        }
      >
        <Icon /> {SUPPORTED_OAUTH_PROVIDERS_DETAILS[provider].name}
      </BetterAuthActionButton>
    );
  });
}

export default SocialAuthButtons;
