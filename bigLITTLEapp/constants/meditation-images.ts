import type { ImageRequireSource } from "react-native";

import trees from "@/assets/meditation-images/trees.webp";
import river from "@/assets/meditation-images/river.webp";
import meditateUnderTree from "@/assets/meditation-images/meditate-under-tree.webp";
import beach from "@/assets/meditation-images/beach.webp";
import yosemiteStars from "@/assets/meditation-images/yosemite-stars.webp";
import waterfall from "@/assets/meditation-images/waterfall.webp";

// Images ship inside the app bundle; the API only stores an audio_key string.
// This map is the join between a row from GET /meditations and its local asset.
//
// Keyed by audioKey rather than by array position. Position worked only because
// the seeded ids happened to run 1..6 with no gaps. Delete one meditation on the
// server and every image after it would silently shift by one.
export const MEDITATION_IMAGES: Record<string, ImageRequireSource> = {
    "trees.mp3": trees,
    "river.mp3": river,
    "meditate-under-tree.mp3": meditateUnderTree,
    "beach.mp3": beach,
    "yosemite-stars.mp3": yosemiteStars,
    "waterfall.mp3": waterfall,
};
