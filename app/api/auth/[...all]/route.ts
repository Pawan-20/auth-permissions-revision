import { auth } from "@/lib/auth"; // path to your auth file
import { toNextJsHandler } from "better-auth/next-js";
export const { POST, GET } = toNextJsHandler(auth);

//better auth has a bunch of api's tht handle most of the work for you, we are setting those up here specifically for next js.
