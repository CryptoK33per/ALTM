export function hashFeatures(log:any){

  const hashes = (log["Hashes"] || "")

  const types = hashes.split(",")

  return {

    hash_present: hashes.length > 0 ? 1 : 0,

    hash_type_count: types.length

  }

}