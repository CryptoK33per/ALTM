import { GBModel } from "./gradientBoost"

function sigmoid(x: number) {
  return 1 / (1 + Math.exp(-x))
}

export function predict(model: GBModel, features: number[]) {

  let score = 0

  for (const tree of model.trees) {

    const value =
      features[tree.featureIndex] > tree.threshold
        ? tree.right
        : tree.left

    score += model.learningRate * value
  }

  /*
  🔥 Confidence (bounded 0–1)
  */
  const confidence = sigmoid(score)

  /*
  🔥 Class from RAW SCORE (not probability)
  This gives much better separation
  */

  let predictedClass = 0

  if (score > 3) predictedClass = 3          // Persistence
  else if (score > 2) predictedClass = 1     // Command Execution
  else if (score > 1.5) predictedClass = 4   // Defense Evasion
  else if (score > 0.8) predictedClass = 2   // Suspicious
  else predictedClass = 0                    // Normal

  return {
    class: predictedClass,
    confidence: Number(confidence.toFixed(4))
  }
}