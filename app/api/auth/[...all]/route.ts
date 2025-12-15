import { auth } from "@/lib/auth"; // path to your auth file
import { toNextJsHandler } from "better-auth/next-js";
import { findIp } from "@arcjet/ip";
import arcjet, {
  BotOptions,
  detectBot,
  EmailOptions,
  protectSignup,
  shield,
  slidingWindow,
  SlidingWindowRateLimitOptions,
} from "@arcjet/next";
const aj = arcjet({
  key: process.env.ARCJET_API_KEY!,
  characteristics: ["userIdorIp"],
  rules: [shield({ mode: "LIVE" })],
});
const authHandlers = toNextJsHandler(auth);
const botSettings = { mode: "LIVE", allow: [] } satisfies BotOptions;
const restrictRateLimitSettings = {
  mode: "LIVE",
  max: 60,
  interval: "10m",
} as SlidingWindowRateLimitOptions<[]>;
// we'll use lax one for non-sensitive routes.
const laxRestrictRateLimitSettings = {
  mode: "LIVE",
  max: 10,
  interval: "1m",
} as SlidingWindowRateLimitOptions<[]>;

const emailSettings = {
  mode: "LIVE",
  block: ["INVALID"],
  // block: ["DISOPOSABLE", "INVALID", "NO_MX_RECORD"],
  // no_mx_record is to check if the domain is correct or not example gmai.co is not a valid one
} as EmailOptions;
export const { GET } = authHandlers;
// export const { POST } = authHandlers;
export async function POST(request: Request) {
  const cloneRequest = request.clone();
  const decision = await checkArcjet(request);

  if (decision.isDenied()) {
    if (decision.reason.isRateLimit()) {
      return new Response(null, { status: 429 });
    } else if (decision.reason.isEmail()) {
      let message: string;
      if (decision.reason.emailTypes.includes("INVALID")) {
        message = "Email address format is invalid.";
      }
      if (decision.reason.emailTypes.includes("DISPOSABLE")) {
        message = "Disposable email addresses are not allowed.";
      }
      if (decision.reason.emailTypes.includes("NO_MX_RECORDS")) {
        // this is to catch if the domain is invalid . example gmai.co is not a valid one
        message = "Email domain is not valid.";
      } else {
        message = "Invalid email";
      }
      return Response.json({ message }, { status: 400 });
    } else {
      return new Response(null, { status: 403 });
    }
  }

  return authHandlers.POST(cloneRequest);
}

async function checkArcjet(request: Request) {
  const body = (await request.json()) as unknown;
  const session = await auth.api.getSession({ headers: request.headers });

  const userIdorIp = (session?.user.id ?? findIp(request)) || "127.0.0.1";

  if (request.url.endsWith("/auth/sign-up")) {
    if (
      body &&
      typeof body === "object" &&
      "email" in body &&
      typeof body.email === "string"
    ) {
      return aj
        .withRule(
          protectSignup({
            email: emailSettings,
            bots: botSettings,
            rateLimit: restrictRateLimitSettings,
          })
        )
        .protect(request, { email: body.email, userIdorIp });
    } else {
      return aj
        .withRule(detectBot(botSettings))
        .withRule(slidingWindow(restrictRateLimitSettings))
        .protect(request, { userIdorIp });
    }
  }

  return aj
    .withRule(detectBot(botSettings))
    .withRule(slidingWindow(laxRestrictRateLimitSettings))
    .protect(request, { userIdorIp });
}
//better auth has a bunch of api's tht handle most of the work for you, we are setting those up here specifically for next js.
