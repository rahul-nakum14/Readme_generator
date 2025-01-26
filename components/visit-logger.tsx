
"use client"

import { useEffect } from "react"
import { usePathname } from "next/navigation";

export function VisitLogger() {
  const pathname = usePathname();

  useEffect(() => {
    const logVisit = async () => {
      try {
        // Get IP info using ipapi.co (free tier)
        const ipResponse = await fetch("https://ipapi.co/json/")
        const ipData = await ipResponse.json()

        // Get device and browser information
        const userAgent = window.navigator.userAgent
        const screenResolution = `${window.screen.width}x${window.screen.height}`
        const language = window.navigator.language

        // Determine device type
        const deviceType = /Mobile|iP(hone|od|ad)|Android|BlackBerry|IEMobile/.test(userAgent) ? "Mobile" : "Desktop"

        // Determine browser
        const browserName = (() => {
          if (userAgent.includes("Firefox")) return "Firefox"
          if (userAgent.includes("Chrome")) return "Chrome"
          if (userAgent.includes("Safari")) return "Safari"
          if (userAgent.includes("Edge")) return "Edge"
          if (userAgent.includes("MSIE") || userAgent.includes("Trident/")) return "Internet Explorer"
          return "Unknown"
        })()

        // Determine OS
        const osName = (() => {
          if (userAgent.includes("Win")) return "Windows"
          if (userAgent.includes("Mac")) return "MacOS"
          if (userAgent.includes("Linux")) return "Linux"
          if (userAgent.includes("Android")) return "Android"
          if (userAgent.includes("iOS")) return "iOS"
          return "Unknown"
        })()

        const analyticsData = {
          ip: ipData.ip,
          userAgent,
          country: ipData.country_name,
          region: ipData.region,
          city: ipData.city,
          latitude: ipData.latitude,
          longitude: ipData.longitude,
          timezone: ipData.timezone,
          isp: ipData.org,
          pageUrl: window.location.href,
          referrer: document.referrer,
          deviceType,
          browserName,
          osName,
          screenResolution,
          language,
        }
        if (pathname === "/admin") {
          return; // Skip logging for AdminPage
        }
    
        // Send to your backend
        await fetch("https://readme-generator-z7oj.onrender.com/log-visit", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(analyticsData),
        })
      } catch (error) {
        console.error("Failed to log visit:", error)
      }
    }

    logVisit()
  }, [])

  return null
}

// "use client"

// import { useEffect } from "react"

// export function VisitLogger() {
//   useEffect(() => {
//     const logVisit = async () => {
//       try {
//         // Fetch IP and location data
//         const geoResponse = await fetch("https://ipapi.co/json/")
//         const geoData = await geoResponse.json()

//         // Get device and browser information
//         const userAgent = window.navigator.userAgent
//         const screenResolution = `${window.screen.width}x${window.screen.height}`
//         const language = window.navigator.language

//         // Determine device type
//         const deviceType = /Mobile|iP(hone|od|ad)|Android|BlackBerry|IEMobile/.test(userAgent) ? "Mobile" : "Desktop"

//         // Determine browser name
//         const browserName = (() => {
//           if (userAgent.includes("Firefox")) return "Firefox"
//           if (userAgent.includes("Chrome")) return "Chrome"
//           if (userAgent.includes("Safari")) return "Safari"
//           if (userAgent.includes("Edge")) return "Edge"
//           if (userAgent.includes("MSIE") || userAgent.includes("Trident/")) return "Internet Explorer"
//           return "Unknown"
//         })()

//         // Determine OS name
//         const osName = (() => {
//           if (userAgent.includes("Win")) return "Windows"
//           if (userAgent.includes("Mac")) return "MacOS"
//           if (userAgent.includes("Linux")) return "Linux"
//           if (userAgent.includes("Android")) return "Android"
//           if (userAgent.includes("iOS")) return "iOS"
//           return "Unknown"
//         })()

//         const analyticsData = {
//           ip: geoData.ip,
//           userAgent,
//           country: geoData.country_name,
//           region: geoData.region,
//           city: geoData.city,
//           latitude: geoData.latitude,
//           longitude: geoData.longitude,
//           timezone: geoData.timezone,
//           isp: geoData.org,
//           pageUrl: window.location.href,
//           referrer: document.referrer,
//           deviceType,
//           browserName,
//           osName,
//           screenResolution,
//           language,
//         }

//         await fetch("https://readme-generator-z7oj.onrender.com/log-visit", {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify(analyticsData),
//         })
//       } catch (error) {
//         console.error("Failed to log visit:", error)
//       }
//     }

//     logVisit()
//   }, [])

//   return null
// }

