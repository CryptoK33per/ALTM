export function processFeatures(log:any){

  const path = (log["Process Path"] || "").toLowerCase()

  return {

    runs_from_temp: path.includes("\\temp\\") ? 1 : 0,

    runs_from_appdata: path.includes("appdata") ? 1 : 0,

    runs_from_program_files: path.includes("program files") ? 1 : 0,

    path_depth: path.split("\\").length,

    has_version_pattern: /\d+\.\d+\.\d+/.test(path) ? 1 : 0

  }

}