import { Composition, Still } from "remotion";
import { ParadaFilm } from "./scenes/ParadaFilm";
import { ShareImage } from "./scenes/ShareImage";
import { MacropadStill, ParadaStill, TalaStill } from "./scenes/Stills";
import { TalaFilm } from "./scenes/TalaFilm";

export const RemotionRoot = () => (
  <>
    {/* Transparent model renders — covers, and what the site shows before WebGL takes over. */}
    <Still id="Macropad" component={MacropadStill} width={1600} height={1200} />
    <Still id="Parada" component={ParadaStill} width={1600} height={1200} />
    <Still id="Tala" component={TalaStill} width={1600} height={1200} />
    {/* 15-second showcase films. */}
    <Composition id="ParadaFilm" component={ParadaFilm} durationInFrames={450} fps={30} width={1280} height={720} />
    <Composition id="TalaFilm" component={TalaFilm} durationInFrames={450} fps={30} width={1280} height={720} />
    <Still id="ShareImage" component={ShareImage} width={1200} height={630} />
  </>
);
