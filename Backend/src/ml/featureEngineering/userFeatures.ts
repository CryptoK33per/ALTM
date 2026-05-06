export function userFeatures(log:any){

  const user = (log["User / Integrity Level"] || "").toLowerCase()

  return {

    is_system_account: user.includes("system") ? 1 : 0,

    is_high_integrity: user.includes("high") ? 1 : 0

  }

}