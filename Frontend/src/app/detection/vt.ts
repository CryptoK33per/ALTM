import axios from "axios"

const VT_API_KEY = "33139ea048e564e66c765e25ca6df02daa9702db8d482a2d246cd57d08764c97"

/*
🔥 CACHE
*/
const vtCache = new Map<
  string,
  { data: any; timestamp: number }
>()

const CACHE_TTL = 1000 * 60 * 60 // 1 hour

/*
🔥 HARD LIMIT (ONLY 4 CALLS)
*/
const MAX_REQUESTS = 4
let requestCount = 0

/*
🔥 MAIN FUNCTION
*/
export async function queryVirusTotal(hash: string) {

  /*
  🔥 CHECK CACHE FIRST
  */
  const cached = vtCache.get(hash)

  if (cached) {
    const isValid = Date.now() - cached.timestamp < CACHE_TTL

    if (isValid) {
      console.log("🟡 VT CACHE HIT:", hash)
      return cached.data
    } else {
      vtCache.delete(hash)
    }
  }

  /*
  🔥 LIMIT CHECK (CRITICAL FIX)
  */
  if (requestCount >= MAX_REQUESTS) {
    console.warn("⛔ VT LIMIT REACHED — SKIPPING:", hash)

    return {
      hash,
      riskScore: 0,
      isMalicious: false,
      skipped: true
    }
  }

  requestCount++

  try {
    console.log(`🔵 VT API CALL (${requestCount}/4):`, hash)

    const url = `https://www.virustotal.com/api/v3/files/${hash}`

    const response = await axios.get(url, {
      headers: {
        "x-apikey": VT_API_KEY
      }
    })

    const data = response.data?.data?.attributes

    if (!data) {
      throw new Error("Invalid VT response structure")
    }

    const stats = data.last_analysis_stats || {}

    const malicious = stats.malicious || 0
    const suspicious = stats.suspicious || 0
    const harmless = stats.harmless || 0
    const undetected = stats.undetected || 0

    /*
    🔥 Risk Score
    */
    const total = malicious + suspicious + harmless + undetected

    const riskScore = total > 0
      ? Math.round(((malicious * 1.0 + suspicious * 0.5) / total) * 100)
      : 0

    const result = {
      hash,
      malicious,
      suspicious,
      harmless,
      undetected,
      riskScore,
      isMalicious: malicious > 5
    }

    /*
    🔥 STORE CACHE
    */
    vtCache.set(hash, {
      data: result,
      timestamp: Date.now()
    })

    console.log("🟢 VT RESULT:", result)

    return result

  } catch (err: any) {

    if (err.response) {
      const status = err.response.status

      if (status === 429) {
        console.error("⛔ VT RATE LIMIT HIT (429)")
      } else if (status === 404) {
        console.warn("⚠️ Hash not found:", hash)
      } else {
        console.error("❌ VT ERROR:", status)
      }
    } else {
      console.error("❌ NETWORK ERROR:", err.message)
    }

    return {
      hash,
      riskScore: 0,
      isMalicious: false,
      error: true
    }
  }
}