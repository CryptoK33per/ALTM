export function commandFeatures(log:any){

  const cmd = (log["Command Line"] || "").toLowerCase()

  const urlRegex = /(http|https):\/\//

  const ipRegex = /\b\d{1,3}(\.\d{1,3}){3}\b/

  const base64Regex = /[A-Za-z0-9+/]{20,}={0,2}/

  return {

    command_length: cmd.length,

    contains_url: urlRegex.test(cmd) ? 1 : 0,

    contains_ip: ipRegex.test(cmd) ? 1 : 0,

    contains_base64: base64Regex.test(cmd) ? 1 : 0,

    suspicious_keyword_count:
      ["download","invoke","iex","certutil"].filter(k => cmd.includes(k)).length

  }

}