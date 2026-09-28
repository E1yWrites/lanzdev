import { useEffect, useState } from "react";
import { AbsoluteFill, continueRender, delayRender, staticFile } from "remotion";
import { MacropadObject } from "./Macropad";
import { Studio, useFontsReady } from "../shared/studio";

const INK = "#EDEDEA";

function useSerif() {
  const [handle] = useState(() => delayRender("serif font"));
  useEffect(() => {
    new FontFace("Display", `url(${staticFile("fonts/newsreader-300.woff")})`, { weight: "300" })
      .load()
      .then((face) => {
        document.fonts.add(face);
        continueRender(handle);
      });
  }, [handle]);
}

const label: React.CSSProperties = {
  fontFamily: "KeyMono",
  fontWeight: 500,
  fontSize: 20,
  letterSpacing: "0.04em",
  textTransform: "uppercase",
  color: INK,
};

/** 1200×630 Open Graph image: statement on the left, the macropad at rest on the right. */
export function ShareImage() {
  useSerif();
  const ready = useFontsReady();
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <AbsoluteFill style={{ left: 470 }}>
        <Studio width={730} height={630} background={null} camera={{ position: [0, 9, 8.2], fov: 30 }}>
          <MacropadObject ready={ready} sway={false} />
        </Studio>
      </AbsoluteFill>
      <div style={{ ...label, position: "absolute", left: 64, top: 56 }}>Lorenz.dev</div>
      <div
        style={{
          position: "absolute",
          left: 60,
          top: 210,
          fontFamily: "Display",
          fontWeight: 300,
          fontSize: 84,
          lineHeight: 1,
          letterSpacing: "-0.03em",
          color: INK,
        }}
      >
        Software for
        <br />
        curious people<span style={{ color: "#FF4C29" }}>.</span>
      </div>
      <div style={{ ...label, position: "absolute", left: 64, bottom: 56, opacity: 0.6 }}>
        Tala · Parada · Modpack — Batangas, PH
      </div>
    </AbsoluteFill>
  );
}
