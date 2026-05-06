import { processFeatures } from "./processFeatures"
import { commandFeatures } from "./commandFeatures"
import { parentChildFeatures } from "./parentChildFeatures"
import { temporalFeatures } from "./temporalFeatures"
import { userFeatures } from "./userFeatures"
import { hashFeatures } from "./hashFeatures"

export function buildFeatureVector(log:any){

  const features = {

    ...processFeatures(log),

    ...commandFeatures(log),

    ...parentChildFeatures(log),

    ...temporalFeatures(log),

    ...userFeatures(log),

    ...hashFeatures(log)

  }

  return Object.values(features)

}