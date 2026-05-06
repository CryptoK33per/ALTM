export function parentChildFeatures(log:any){

  const parent = (log["Parent Process Name"] || "").toLowerCase()
  const process = (log["Process Name (Image)"] || "").toLowerCase()

  return {

    office_spawn_shell:
      parent.includes("winword") || parent.includes("excel") ? 1 : 0,

    browser_spawn_shell:
      parent.includes("chrome") || parent.includes("edge") ? 1 : 0,

    parent_same_process: parent === process ? 1 : 0

  }

}