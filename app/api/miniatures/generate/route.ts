import OpenAI, { toFile } from "openai";
import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";
import { getStyleById, getPersonaById, type Style, type Persona } from "@/lib/mocks/styles-personas";

export const maxDuration = 60;

function buildEnrichedPrompt(userBrief: string, style: Style, persona: Persona): string {
  return `Create a high-quality YouTube thumbnail in 16:9 landscape format.

USER BRIEF (the topic of the video):
${userBrief}

PERSONA TO FEATURE PROMINENTLY (mandatory subject):
${persona.promptDetails}

VISUAL STYLE TO STRICTLY APPLY:
${style.promptDetails}

CRITICAL REQUIREMENTS:
- Photorealistic rendering of the human subject (the persona)
- YouTube thumbnail format: 16:9 landscape, attention-grabbing composition
- Clear visual hierarchy: persona prominent + bold typography readable at small sizes
- Strong contrast between subject and background
- Mobile thumbnail readable at 200px width
- French language for any visible text
- No watermark, no logo, no signature`;
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();

    const userBrief = formData.get("prompt") as string | null;
    const styleId = formData.get("styleId") as string | null;
    const personaId = formData.get("personaId") as string | null;
    const referenceImage = formData.get("referenceImage") as File | null;

    if (!userBrief || !userBrief.trim()) {
      return NextResponse.json({ error: "Description manquante" }, { status: 400 });
    }
    if (!styleId) {
      return NextResponse.json({ error: "Style manquant" }, { status: 400 });
    }
    if (!personaId) {
      return NextResponse.json({ error: "Persona manquant" }, { status: 400 });
    }

    const style = getStyleById(styleId);
    const persona = getPersonaById(personaId);

    if (!style) {
      return NextResponse.json({ error: `Style inconnu : ${styleId}` }, { status: 400 });
    }
    if (!persona) {
      return NextResponse.json({ error: `Persona inconnu : ${personaId}` }, { status: 400 });
    }

    const enrichedPrompt = buildEnrichedPrompt(userBrief, style, persona);

    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    let b64: string | undefined;

    if (referenceImage && referenceImage.size > 0) {
      const imageFile = await toFile(referenceImage, referenceImage.name || "reference.png", {
        type: referenceImage.type || "image/png",
      });
      const editResponse = await openai.images.edit({
        model: "gpt-image-2",
        image: imageFile,
        prompt: enrichedPrompt,
        n: 1,
        size: "1536x1024",
      });
      b64 = editResponse.data?.[0]?.b64_json;
    } else {
      const genResponse = await openai.images.generate({
        model: "gpt-image-2",
        prompt: enrichedPrompt,
        n: 1,
        size: "1536x1024",
      });
      b64 = genResponse.data?.[0]?.b64_json;
    }

    if (!b64) {
      return NextResponse.json({ error: "Aucune image renvoyée par OpenAI" }, { status: 500 });
    }

    const buffer = Buffer.from(b64, "base64");

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const userId = "demo-user";
    const filename = `${userId}/${crypto.randomUUID()}.png`;

    const { error: uploadError } = await supabase.storage
      .from("miniatures")
      .upload(filename, buffer, { contentType: "image/png" });

    if (uploadError) {
      return NextResponse.json({ error: `Upload Supabase : ${uploadError.message}` }, { status: 500 });
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from("miniatures").getPublicUrl(filename);

    const { data: row, error: dbError } = await supabase
      .from("miniatures")
      .insert({
        user_id: userId,
        prompt: enrichedPrompt,
        image_url: publicUrl,
        storage_path: filename,
      })
      .select()
      .single();

    if (dbError) {
      return NextResponse.json({ error: `Insert DB : ${dbError.message}` }, { status: 500 });
    }

    return NextResponse.json({ imageUrl: publicUrl, id: row.id });
  } catch (error) {
    console.error("[/api/miniatures/generate] error:", error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
