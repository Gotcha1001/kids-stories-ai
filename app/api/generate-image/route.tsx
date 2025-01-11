import { NextRequest, NextResponse } from "next/server";
import Replicate from "replicate";

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const { prompt } = data;

    if (!prompt) {
      return NextResponse.json(
        { error: "Prompt is required" },
        { status: 400 }
      );
    }

    console.log("Received prompt:", prompt);

    const replicate = new Replicate({
      auth: process.env.REPLICATE_API_KEY,
    });

    const input = {
      prompt: prompt,
      num_outputs: 1,
      scheduler: "K_EULER",
      num_inference_steps: 4,
      guidance_scale: 7.5,
      output_format: "png",
    };

    console.log("Sending to Replicate with input:", input);

    const output = await replicate.run("black-forest-labs/flux-schnell", {
      input,
    });

    console.log("Replicate response:", output);

    // Check if the response contains a ReadableStream
    if (
      output &&
      Array.isArray(output) &&
      output[0] instanceof ReadableStream
    ) {
      const stream = output[0];
      const reader = stream.getReader();
      const chunks: Uint8Array[] = [];

      // Read the stream
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        chunks.push(value);
      }

      // Combine all the chunks into one Uint8Array
      const concatenated = new Uint8Array(
        chunks.reduce((acc, chunk) => acc + chunk.length, 0)
      );
      let offset = 0;
      for (const chunk of chunks) {
        concatenated.set(chunk, offset);
        offset += chunk.length;
      }

      // Convert the concatenated Uint8Array to a base64 string
      const base64 = Buffer.from(concatenated).toString("base64");
      const imageUrl = `data:image/png;base64,${base64}`;

      console.log("Generated image URL:", imageUrl);

      return NextResponse.json({ imageUrl });
    } else {
      console.error("Unexpected response format:", output);
      return NextResponse.json(
        { error: "Invalid response format from image generation" },
        { status: 500 }
      );
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Detailed error:", error.message);
      return NextResponse.json(
        { error: "Failed to generate image: " + error.message },
        { status: 500 }
      );
    } else {
      console.error("Unexpected error type:", error);
      return NextResponse.json(
        { error: "An unexpected error occurred" },
        { status: 500 }
      );
    }
  }
}
