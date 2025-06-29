import React from "react";
import { Sky } from "@react-three/drei";

export default function BeautifulSky() {
  return (
    <Sky
      distance={450000}
      sunPosition={[10, 15, 5]}      // visoko nebo, suncem u pravcu
      inclination={0.6}             // visina sunca (0 - 1)
      azimuth={0.25}                // ugao horizonta
      rayleigh={1.2}                // jačina atmosfere/plavog neba
      mieCoefficient={0.015}        // zamućenost vazduha
      mieDirectionalG={0.8}         // pravac rasipanja svetlosti
      turbidity={8}                 // zamućenost neba
      luminance={1.0}               // svetlost neba
    />
  );
}
