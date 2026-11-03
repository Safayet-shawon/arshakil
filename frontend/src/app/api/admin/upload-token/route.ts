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
        if (!pathname.startsWith("books/") || !pathname.endsWith(".pdf")) throw new Error("Only books/*.pdf");
        return { allowedContentTypes: ["application/pdf"], maximumSizeInBytes: 200_000_000, addRandomSuffix: false, allowOverwrite: true };
      },
    });
    return Response.json(json);
  } catch (e) {
    return Response.json({ error: (e as Error).message }, { status: 400 });
  }
}
