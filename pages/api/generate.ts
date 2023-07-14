// import { Ratelimit } from "@upstash/ratelimit";
import type { NextApiRequest, NextApiResponse } from "next";
import Replicate from "replicate";
// import requestIp from "request-ip";
// import redis from "../../utils/redis";




type Data = string;

interface ExtendedNextApiRequest extends NextApiRequest {
  body: {
    imageUrl: string;
  };
}

// Create a new ratelimiter, that allows 3 requests per 60 seconds
// const ratelimit = redis
//   ? new Ratelimit({
//       redis: redis,
//       limiter: Ratelimit.fixedWindow(3, "60 s"),
//     })
//   : undefined;

export default async function handler(
  req: ExtendedNextApiRequest,
  res: NextApiResponse<Data>
) {
//   // Rate Limiter Code
//   if (ratelimit) {
//     const identifier = requestIp.getClientIp(req);
//     const result = await ratelimit.limit(identifier!);
//     res.setHeader("X-RateLimit-Limit", result.limit);
//     res.setHeader("X-RateLimit-Remaining", result.remaining);

//     if (!result.success) {
//       res
//         .status(429)
//         .json(
//           "Too many uploads in 1 minute. Please try again in a few minutes."
//         );
//       return;
//     }
//   }

const imageUrl = req.body.imageUrl;
// POST request to Replicate to start the image restoration generation process
let startResponse = await fetch("https://api.replicate.com/v1/predictions", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Authorization: "Token " + process.env.REPLICATE_API_KEY,
  },
  body: JSON.stringify({
    version:
    "d0ee3d708c9b911f122a4ad90046c5d26a0293b99476d697f6bb7f2e251ce2d4",
    input: {  image: imageUrl},
  }),
});

let jsonStartResponse = await startResponse.json();
let endpointUrl = jsonStartResponse.urls?.get;


let restoredImage: string | null = null;

while (!restoredImage) {
  // Loop in 1s intervals until the alt text is ready
 
  let finalResponse = await fetch(endpointUrl, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Token " + process.env.REPLICATE_API_KEY,
    },
  });
  let jsonFinalResponse = await finalResponse.json();

  if (jsonFinalResponse.status === "succeeded") {
    restoredImage = jsonFinalResponse.output;
  } else if (jsonFinalResponse.status === "failed") {
    break;
  } else {
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }
}
res
  .status(200)
  .json(restoredImage ? restoredImage : "Failed to convert the  image");
}





