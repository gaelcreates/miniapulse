export type Style = {
  id: string;
  name: string;
  shortDescription: string;
  palette: string[];
  promptDetails: string;
};

export type Persona = {
  id: string;
  name: string;
  shortDescription: string;
  promptDetails: string;
};

export const STYLES: Style[] = [
  {
    id: "bold-yellow",
    name: "Bold Yellow",
    shortDescription: "Fond sombre, jaune néon dominant. Signature MiniaPulse.",
    palette: ["#0A0A0A", "#F5E632", "#E84A4A", "#FFFFFF"],
    promptDetails:
      "Visual style: deep near-black background (#0A0A0A to #1A1A1A subtle gradient). MASSIVE ultra-bold yellow neon typography (#F5E632) covering 40-50% of the frame, in heavy condensed sans-serif (Anton or Druk Wide style), positioned aggressively top-right or center. Subtle paper grain texture overlay. High contrast cinematic lighting on the subject with strong rim light. Single red accent (#E84A4A) on ONE keyword or punctuation only. Sharp dark shadows, dramatic mood. Photorealistic human subject, sharp focus.",
  },
  {
    id: "tech-cyan",
    name: "Tech Cyan",
    shortDescription: "SaaS, building in public. Cyan électrique, dashboard flou.",
    palette: ["#0B1117", "#34E0FF", "#FFFFFF", "#FF4848"],
    promptDetails:
      "Visual style: dark blue-black tech background (#0B1117). Blurred dashboard/SaaS interface in background (soft bokeh, charts, numbers). Electric cyan (#34E0FF) for main typography and glow effects. Clean modern sans-serif font (Inter or Helvetica Bold). Sticker-style tampon or badge with a metric (e.g. \"$10K MRR\"). Subtle scanline or grid overlay. Sharp tech aesthetic, minimal decoration. Photorealistic subject with cyan rim light.",
  },
  {
    id: "truth-bomb",
    name: "Truth Bomb",
    shortDescription: "Mindset, vérité dérangeante. Outline blanc, mot barré rouge.",
    palette: ["#0E0E0E", "#FFFFFF", "#E63946", "#1A1A1A"],
    promptDetails:
      "Visual style: matte black background (#0E0E0E). Bold white outlined typography (#FFFFFF stroke only, no fill) in heavy serif or condensed sans-serif. ONE word crossed out with a thick handwritten red line (#E63946). Dramatic chiaroscuro lighting on subject (half face in shadow). Mood: intense, confrontational, raw. Vignette darkening edges. Photorealistic subject, eyes intense, slight low-angle for power.",
  },
  {
    id: "soft-productivity",
    name: "Soft Productivity",
    shortDescription: "Lumière chaude, posture relax, chiffre énorme jaune saturé.",
    palette: ["#1F1B16", "#E8C547", "#7BB17A", "#F2EFE7"],
    promptDetails:
      "Visual style: warm muted brown background (#1F1B16 to #2A2520 gradient). Soft golden hour lighting on subject (relaxed posture, half smile). HUGE saturated yellow number (#E8C547) taking 30% of frame in rounded display font. Small green accent (#7BB17A) for a check icon or detail. Calm, mature, intentional mood. Subtle film grain. Photorealistic subject looking slightly off-camera, contemplative.",
  },
  {
    id: "red-conviction",
    name: "Red Conviction",
    shortDescription: "Fond rouge profond, geste passionné, accent jaune.",
    palette: ["#660A0A", "#FFFFFF", "#F5E632", "#1A1A1A"],
    promptDetails:
      "Visual style: deep blood-red background (#660A0A to #8B0F0F radial gradient). Passionate subject mid-gesture (pointing, hand raised, intense expression). White typography (#FFFFFF) heavy and condensed, with ONE word in saturated yellow (#F5E632) for emphasis. High-energy mood. Slight motion blur on the gesture if needed. Vignette. Photorealistic subject with dramatic shadows.",
  },
  {
    id: "wake-up-call",
    name: "Wake Up Call",
    shortDescription: "Stratégie, défi. Rouge saturé sur noir, sablier, compte à rebours.",
    palette: ["#000000", "#FF2D2D", "#FFFFFF", "#E0E0E0"],
    promptDetails:
      "Visual style: pure black background (#000000). Saturated bright red typography (#FF2D2D) in tactical bold sans-serif (think military or news). White secondary text (#FFFFFF). Iconic element: hourglass, countdown timer, alarm, or red dot recording — placed prominently. Urgency aesthetic, news-flash mood. Sharp clean composition. Photorealistic subject with serious expression, direct eye contact, intense lighting.",
  },
];

export const PERSONAS: Persona[] = [
  {
    id: "marc-entrepreneur",
    name: "Marc — Entrepreneur sérieux",
    shortDescription: "Trentenaire barbu, business, codes coach/consultant.",
    promptDetails:
      "Subject: French male entrepreneur, 32 years old, athletic build, approximately 1.80m tall, well-trimmed dark brown beard (medium length), short-medium dark brown hair styled back, expressive blue-grey eyes, defined square jaw, light skin with subtle natural tan. Wearing a fitted plain black t-shirt or simple dark blazer over t-shirt. Posture: confident, often standing or slight forward lean, arms crossed or hand gesturing toward camera. Direct intense eye contact. No glasses. Slight stubble texture visible. Mature professional masculine aesthetic.",
  },
  {
    id: "lea-creatrice",
    name: "Léa — Créatrice contenu",
    shortDescription: "Trentenaire dynamique, créatrice, codes infopreneur féminin.",
    promptDetails:
      "Subject: French female content creator, 29 years old, slim athletic build, approximately 1.68m tall, long wavy chestnut brown hair to mid-back, warm hazel-green eyes, friendly approachable face with high cheekbones, light fair skin with subtle freckles, natural makeup. Wearing a stylish neutral-tone blouse or modern oversized sweater (cream, beige, or muted earth tones). Posture: animated, hands often gesturing while talking, warm half-smile, head slightly tilted, engaged forward energy. Direct camera contact. Professional but warm and feminine aesthetic.",
  },
  {
    id: "alex-saas",
    name: "Alex — Fondateur SaaS",
    shortDescription: "Trentenaire tech, hoodie, codes building in public.",
    promptDetails:
      "Subject: French male SaaS founder, 30 years old, lean medium build, approximately 1.77m tall, short messy dark brown hair (slightly tousled), light beard stubble, sharp focused dark brown eyes behind clear-frame minimalist glasses, defined cheekbones, light skin. Wearing a dark grey or black premium hoodie OR fitted technical sweater. Posture: focused, often slight forward lean toward laptop or screen, hand on chin in thoughtful gesture or pointing at invisible UI. Reserved confident expression, slight smirk. Tech-forward modern aesthetic.",
  },
  {
    id: "sophie-coach",
    name: "Sophie — Coach mindset",
    shortDescription: "Quadragénaire posée, codes développement personnel premium.",
    promptDetails:
      "Subject: French female mindset coach, 42 years old, healthy mature build, approximately 1.70m tall, shoulder-length straight blonde hair (with subtle highlights), warm calm blue eyes, defined jawline, light fair skin with mature elegant features, soft natural makeup. Wearing a refined cream or camel-colored knit top or tailored blazer. Posture: serene, calm, often slight head tilt, gentle hand on chest or open palms gesture, soft confident half-smile. Direct warm eye contact. Premium professional feminine wisdom aesthetic.",
  },
];

export function getStyleById(id: string): Style | undefined {
  return STYLES.find((s) => s.id === id);
}

export function getPersonaById(id: string): Persona | undefined {
  return PERSONAS.find((p) => p.id === id);
}
