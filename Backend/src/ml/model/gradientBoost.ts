export interface Stump {

  featureIndex:number

  threshold:number

  left:number

  right:number

}

export interface GBModel {

  trees:Stump[]

  learningRate:number

}

export function trainGradientBoost(data:any[], rounds=20){

  const trees:Stump[]=[]

  for(let r=0;r<rounds;r++){

    let bestFeature=0
    let bestError=Infinity

    for(let f=0;f<data[0].features.length;f++){

      let error=0

      for(const row of data){

        const pred=row.features[f]>0?1:0

        error+=Math.abs(pred-row.label)

      }

      if(error<bestError){

        bestError=error

        bestFeature=f

      }

    }

    trees.push({

      featureIndex:bestFeature,

      threshold:0.5,

      left:0,

      right:1

    })

  }

  return {

    trees,

    learningRate:0.1

  }

}