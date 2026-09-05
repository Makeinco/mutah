import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const zoneSchema = z.enum(["approach", "entrance", "parking", "elevator", "restroom"]);
const MAX_IMAGES = 6;
const MAX_IMAGE_BYTES = 8 * 1024 * 1024;

export const analyseEvidenceServer = createServerFn({ method: "POST" })
  .validator((input: FormData) => {
    if (!(input instanceof FormData)) throw new Error("INVALID_FORM_DATA");
    const zone = zoneSchema.parse(input.get("zone"));
    const files = input.getAll("images").filter((item): item is File => item instanceof File);
    if (files.length === 0 || files.length > MAX_IMAGES) throw new Error("INVALID_IMAGE_COUNT");
    for (const file of files) {
      if (!file.type.startsWith("image/")) throw new Error("INVALID_IMAGE_TYPE");
      if (file.size > MAX_IMAGE_BYTES) throw new Error("IMAGE_TOO_LARGE");
    }
    return { zone, files };
  })
  .handler(async ({ data }) => {
    const { analyseEvidenceWithGemini } = await import("./gemini.server");
    const images = await Promise.all(
      data.files.map(async (file) => ({
        mimeType: file.type,
        base64: Buffer.from(await file.arrayBuffer()).toString("base64"),
      })),
    );
    return analyseEvidenceWithGemini({ zone: data.zone, images });
  });
