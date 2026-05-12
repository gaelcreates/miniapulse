/**
 * EXEMPLES VISUELS PAR FORMAT / STYLE
 * ─────────────────────────────────────────────────────────────────────────────
 * Pour ajouter un exemple :
 *   1. Dépose l'image dans /public/style-examples/
 *   2. Ajoute le nom du fichier dans le tableau correspondant ci-dessous
 *
 * Format recommandé : 1280×720 px (16/9), JPG ou WebP, < 200 Ko
 * Nommage conseillé  : {format-id}-{numero}.jpg  ex: facecam-1.jpg
 *
 * Les images sont affichées en vignettes cliquables sur les cards de sélection.
 * Tu peux en mettre autant que tu veux — elles défilent horizontalement.
 */

export type FormatExamples = {
  /** ID du format (doit correspondre à ContentFormat.id dans la page) */
  formatId: string;
  /** Chemins relatifs depuis /public — ex: "/style-examples/facecam-1.jpg" */
  images: string[];
};

export const FORMAT_EXAMPLES: FormatExamples[] = [
  {
    formatId: "facecam",
    images: [
      // "/style-examples/facecam-1.jpg",
      // "/style-examples/facecam-2.jpg",
    ],
  },
  {
    formatId: "vlog",
    images: [
      // "/style-examples/vlog-1.jpg",
    ],
  },
  {
    formatId: "cinematique",
    images: [
      // "/style-examples/cinematique-1.jpg",
    ],
  },
  {
    formatId: "infopreneur",
    images: [
      // "/style-examples/infopreneur-1.jpg",
      // "/style-examples/infopreneur-2.jpg",
      // "/style-examples/infopreneur-3.jpg",
    ],
  },
  {
    formatId: "entertainment",
    images: [
      // "/style-examples/entertainment-1.jpg",
    ],
  },
  {
    formatId: "gaming",
    images: [
      // "/style-examples/gaming-1.jpg",
    ],
  },
  {
    formatId: "podcast",
    images: [
      // "/style-examples/podcast-1.jpg",
    ],
  },
  {
    formatId: "coaching",
    images: [
      // "/style-examples/coaching-1.jpg",
      // "/style-examples/coaching-2.jpg",
    ],
  },
];

/** Helper — retourne les images d'un format donné */
export function getExamplesForFormat(formatId: string): string[] {
  return FORMAT_EXAMPLES.find((f) => f.formatId === formatId)?.images ?? [];
}
