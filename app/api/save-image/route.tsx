import { storage } from "@/config/firebaseConfig";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { url } = await req.json();

    if (!url) {
      return NextResponse.json(
        { error: "Image URL is required" },
        { status: 400 }
      );
    }

    let base64Image: string;
    let contentType: string;

    // Handle both data URL and regular URL formats
    if (url.startsWith("data:image")) {
      // Extract base64 data from data URL
      base64Image = url.split(",")[1];
      contentType = url.split(";")[0].split(":")[1]; // Get the MIME type (e.g., image/png)
    } else {
      // Fetch and convert regular URL to base64
      try {
        const response = await axios.get(url, {
          responseType: "arraybuffer",
          timeout: 10000, // 10 second timeout
        });
        base64Image = Buffer.from(response.data).toString("base64");
        contentType = response.headers["content-type"]; // Extract content type from the response
      } catch (error) {
        console.error("Error fetching image:", error);
        return NextResponse.json(
          { error: "Failed to fetch image from URL" },
          { status: 500 }
        );
      }
    }

    // Generate a unique filename
    const fileName = `/ai-story-${Date.now()}-${Math.random()
      .toString(36)
      .slice(2, 7)}.png`;
    const imageRef = ref(storage, fileName);

    try {
      // Upload image with the correct content type
      const buffer = Buffer.from(base64Image, "base64");
      await uploadBytes(imageRef, buffer, {
        contentType,
      });
      console.log("File uploaded successfully");

      // Get the download URL
      const downloadUrl = await getDownloadURL(imageRef);
      console.log("Download URL generated:", downloadUrl);

      return NextResponse.json({ imageUrl: downloadUrl });
    } catch (error) {
      console.error("Firebase upload error:", error);
      return NextResponse.json(
        { error: "Failed to upload image to storage" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Save image error:", error);
    return NextResponse.json(
      { error: "Failed to process image" },
      { status: 500 }
    );
  }
}
