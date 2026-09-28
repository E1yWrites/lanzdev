import { Composition, Still } from "remotion";
import { Hero } from "./scenes/Macropad";
import { ModpackObject, ParadaObject } from "./scenes/Objects";
import { ShareImage } from "./scenes/ShareImage";

export const RemotionRoot = () => (
  <>
    {/* 6 s seamless loop — each project key is pressed once. */}
    <Composition id="Hero" component={Hero} durationInFrames={180} fps={30} width={1080} height={1080} />
    <Still id="Parada" component={ParadaObject} width={1400} height={1050} />
    <Still id="Modpack" component={ModpackObject} width={1400} height={1050} />
    <Still id="ShareImage" component={ShareImage} width={1200} height={630} />
  </>
);
