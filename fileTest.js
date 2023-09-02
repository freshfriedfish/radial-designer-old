import { BeatmapDecoder } from 'osu-parsers'
import textfile from "/filetemplate.osu?raw";

const decoder = new BeatmapDecoder();
const beatmap1 = decoder.decodeFromString(textfile, true);
console.log(beatmap1)