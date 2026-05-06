import { runMLModel } from "./runModel"

/*
We assume logs are already parsed from CSV
and stored in localStorage by LandingUpload.tsx
*/

export function testMLPipeline() {

  const csv = localStorage.getItem("normalized_logs_csv")

  if (!csv) {

    console.error("No CSV found in localStorage")

    return

  }

  // parse CSV again for testing

  const rows = csv.split("\n")

  const headers = rows[0].split(",")

  const logs = rows.slice(1).map(row => {

    const values = row.split(",")

    const obj:any = {}

    headers.forEach((h,i)=>{

      obj[h.trim()] = values[i]

    })

    return obj

  })

  console.log("Total logs loaded:", logs.length)

  /*
  Run full ML pipeline
  */

  const results = runMLModel(logs)

  console.log("ML Results Sample:", results.slice(0,5))

  return results

}