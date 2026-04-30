import { useEffect, useState } from "react";
import type { Inspection } from "../types/inspection";

interface UseInspectionResult {
  data: Inspection | null
  loading: boolean
  error: string | null
}

// Loading - show a spinner
// Error - show an error message
// Success - show the data

export function useInspection(url: string): UseInspectionResult {
  const [data, setData] = useState<Inspection | null>(null)
  const [loading, setLoading] = useState<boolean>(true) 
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false // cancelled is the cleanup function of useEffect
    
    async function fetchData() {
      try {
        setLoading(true)
        setError(null)

        const response = await fetch(url)
        if(!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`)
        }

        const json = (await response.json()) as Inspection

        if(!cancelled) {
          setData(json)
        }
      } catch(err) {
        if(!cancelled) {
          setError(err instanceof Error ? err.message : 'Unknown error')
        }
      } finally {
        if(!cancelled) {
          setLoading(false)
        }
      }
    }
    fetchData()
    return () => {
      cancelled = true // clean up - steop memory leak
    }
  },[url]) // Tell React to 'rerun this effect whenever url changes'

  // userEffect: ตอน component แสดงครั้งแรกให้ fetch ข้อมูลจาก url if user change
  // then fetch again. 
  // if component gone while fetching, flag cancelled=true so no setState with gone component

  return {data, loading, error}
}