import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { requireAdmin } from "@/lib/server/auth";

/** Lets the signed-in admin upload a book PDF straight to the private store (PDFs are too big for a normal request). */
export async function POST(req: Request) {
  const denied = await requireAdmin();
  if (denied) return denied;
  const body = (await req.json()) as HandleUploadBody;
  try {
    const json = await handleUpload({
      body, request: req,
      onBeforeGenerateToken: async (pathname) => {
        if (/^(books|posts)\/[\w.-]+\.pdf$/.test(pathname))
          return { allowedContentTypes: ["application/pdf"], maximumSizeInBytes: 200_000_000, addRandomSuffix: false, allowOverwrite: true };
        if (/^uploads\/vid\/[\w.-]+\.(mp4|webm|mov)$/.test(pathname))
          return { allowedContentTypes: ["video/mp4", "video/webm", "video/quicktime"], maximumSizeInBytes: 100_000_000, addRandomSuffix: false, allowOverwrite: true };
        throw new Error("Not an allowed upload");
      },
    });
    return Response.json(json);
  } catch (e) {
    return Response.json({ error: (e as Error).message }, { status: 400 });
  }
}
