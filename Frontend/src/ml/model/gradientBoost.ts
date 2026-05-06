export interface Stump {
  featureIndex: number
  threshold: number
  left: number
  right: number
}

export interface GBModel {
  trees: Stump[]
  learningRate: number
}

export function trainGradientBoost(data: any[], rounds = 20) {

  const trees: Stump[] = []

  for (let r = 0; r < rounds; r++) {

    let bestFeature = 0
    let bestError = Infinity
    let bestLeft = 0
    let bestRight = 0

    for (let f = 0; f < data[0].features.length; f++) {

      let leftSum = 0
      let leftCount = 0
      let rightSum = 0
      let rightCount = 0

      for (const row of data) {

        if (row.features[f] > 0) {
          rightSum += row.label
          rightCount++
        } else {
          leftSum += row.label
          leftCount++
        }

      }

      const leftAvg = leftCount ? leftSum / leftCount : 0
      const rightAvg = rightCount ? rightSum / rightCount : 0

      let error = 0

      for (const row of data) {

        const pred = row.features[f] > 0 ? rightAvg : leftAvg
        error += Math.abs(pred - row.label)

      }

      if (error < bestError) {
        bestError = error
        bestFeature = f
        bestLeft = leftAvg
        bestRight = rightAvg
      }

    }

    trees.push({
      featureIndex: bestFeature,
      threshold: 0.5,
      left: bestLeft,
      right: bestRight
    })

  }

  return {
    trees,
    learningRate: 0.1
  }

}