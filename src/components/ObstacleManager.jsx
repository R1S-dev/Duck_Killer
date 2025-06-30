import React from "react";
import RoadBarrier from "./RoadBarrier";

const SPEED = 17;  // ista brzina kao put

export default function ObstacleManager() {
  return (
    <>
      <RoadBarrier initialZ={-70} speed={SPEED} onPassed={() => { /* možeš dodati logiku resetovanja */ }} />
    </>
  );
}
