export function temporalFeatures(log:any){

  const date = new Date(log["Date and Time"])

  const hour = date.getHours()

  return {

    time_bucket_00_05: hour < 6 ? 1 : 0,

    time_bucket_06_11: hour >= 6 && hour < 12 ? 1 : 0,

    time_bucket_12_17: hour >= 12 && hour < 18 ? 1 : 0,

    time_bucket_18_23: hour >= 18 ? 1 : 0

  }

}