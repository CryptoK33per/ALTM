import { buildMLFeatureVector } from "../detection/mlFeatureBuilder"
import { trainGradientBoost } from "./model/gradientBoost"
import { predict } from "./model/predict"
import { buildThreat } from "../ml/threat/threatBuilder"
import { evaluateLog } from "../detection/detectionEngine"

/*
Continuous label scoring (better learning than fixed class)
*/
function generateLabelScore(features: number[]): number {
  let score = 0

  // same indices as feature order
  if (features[0]) score += 2 // encoded_powershell
  if (features[1]) score += 2 // powershell_download
  if (features[2]) score += 2 // certutil_download
  if (features[3]) score += 2 // rundll32_abuse
  if (features[4]) score += 2 // mshta_execution

  if (features[6]) score += 2 // script_to_lolbin

  if (features[8]) score += 3 // registry persistence
  if (features[9]) score += 3 // scheduled task

  if (features[10]) score += 1 // weird_time_script
  if (features[11]) score += 1 // weird_time_download

  // 🔥 new appended features (if present)
  if (features[12]) score += 1 // long_command
  if (features[13]) score += 2 // has_base64
  if (features[14]) score += 1 // many_arguments
  if (features[15]) score += 1 // system32
  if (features[16]) score += 2 // high privilege

  return score
}

export function runMLModel(logs: any[]) {

  /*
  STEP 1: Build dataset (features + label)
  */
  const dataset = logs.slice(0, 1000).map(log => {

    // 🔥 get rule detection first
    const { result } = evaluateLog(log)

    // 🔥 build feature vector using result + log
    const features = buildMLFeatureVector(result, log)

    // 🔥 better label (continuous)
    const label = generateLabelScore(features)

    return { features, label }
  })

  /*
  STEP 2: Train model
  */
  const model = trainGradientBoost(dataset, 25)

  /*
  STEP 3: Predict + build threats
  */
  const results = logs.slice(0, 1000).map((log, i) => {

    const features = dataset[i].features

    const prediction = predict(model, features)

    const threat = buildThreat(
      log,
      prediction.class,
      prediction.confidence
    )

    return {
      log,
      prediction: prediction.class,
      confidence: prediction.confidence,
      severity: threat.severity,
      mitre: threat.mitre
    }
  })

  return results
}