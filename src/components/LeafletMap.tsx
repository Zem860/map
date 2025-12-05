import { useEffect, useRef } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

// 修正 Leaflet 預設 marker icon（Vite + bundler 常見問題）
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png'
import markerIcon from 'leaflet/dist/images/marker-icon.png'
import markerShadow from 'leaflet/dist/images/marker-shadow.png'

delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
})

type RandomUser = {
  name: { title: string; first: string; last: string }
  email: string
  cell: string
  picture: { thumbnail: string; medium: string }
  location: {
    city: string
    state: string
    country: string
    coordinates: {
      latitude: string
      longitude: string
    }
  }
}

type RandomUserApiResponse = {
  results: RandomUser[]
}

type RestCountry = {
  latlng?: [number, number]
}

// ⭐ 用國家名稱查座標 + 簡單快取（避免每 10 秒都打一次）
const countryLatLngCache: Record<string, [number, number]> = {}

const getCountryLatLng = async (country: string): Promise<[number, number] | null> => {
  if (countryLatLngCache[country]) {
    return countryLatLngCache[country]
  }

  try {
    const url = `https://restcountries.com/v3.1/name/${encodeURIComponent(
      country,
    )}?fields=latlng`
    const res = await fetch(url)
    if (!res.ok) {
      console.warn('[country] http error', res.status, country)
      return null
    }

    const data: RestCountry[] = await res.json()
    if (!data.length || !data[0].latlng || data[0].latlng.length < 2) {
      console.warn('[country] no latlng for', country, data)
      return null
    }

    const [lat, lng] = data[0].latlng
    if (Number.isNaN(lat) || Number.isNaN(lng)) return null

    countryLatLngCache[country] = [lat, lng]
    return [lat, lng]
  } catch (e) {
    console.warn('[country] fetch error', country, e)
    return null
  }
}

export const LeafletMap: React.FC = () => {
  const mapRef = useRef<L.Map | null>(null)
  const markerRef = useRef<L.Marker | null>(null)
  const mapContainerRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (!mapContainerRef.current) return

    // 初始化地圖（只做一次）
    if (!mapRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [20, 0],
        zoom: 2,
      })

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; OpenStreetMap',
      }).addTo(map)

      mapRef.current = map
    }

    const fetchUser = async () => {
      const map = mapRef.current
      if (!map) return

      try {
        const res = await fetch('https://randomuser.me/api/')
        const data: RandomUserApiResponse = await res.json()
        const user = data.results[0]
        if (!user) return

        const fullName = `${user.name.title} ${user.name.first} ${user.name.last}`

        console.log(
          '[fetchUser]',
          fullName,
          '-',
          user.location.city,
          user.location.state,
          user.location.country,
          'raw coords:',
          user.location.coordinates,
        )

        // 1️⃣ 先試著用「國家名稱」查中心座標
        let latLng = await getCountryLatLng(user.location.country)

        // 2️⃣ restcountries 失敗時，退回 randomuser 原始座標
        if (!latLng) {
          const rawLat = parseFloat(user.location.coordinates.latitude)
          const rawLng = parseFloat(user.location.coordinates.longitude)
          if (!Number.isNaN(rawLat) && !Number.isNaN(rawLng)) {
            console.warn('[fallback] use randomuser raw coordinates')
            latLng = [rawLat, rawLng]
          } else {
            console.warn('[skip] no valid coordinates')
            return
          }
        }

        const [lat, lng] = latLng

        const html = `
          <div style="font-size:14px; line-height:1.5; max-width:260px;">
            <img src="${user.picture.thumbnail}"
                 style="width:40px;height:40px;border-radius:50%;margin-bottom:6px;" />
            <div><strong>${fullName}</strong></div>
            <div>${user.location.city || '-'}, ${user.location.state || '-'}</div>
            <div>${user.location.country}</div>
            <br/>
            <div>Email: ${user.email}</div>
            <div>Cell: ${user.cell}</div>
          </div>
        `

        // 一個 marker：移動位置 + 更新 popup
        if (!markerRef.current) {
          markerRef.current = L.marker([lat, lng]).addTo(map)
        } else {
          markerRef.current.setLatLng([lat, lng])
        }

        markerRef.current.bindPopup(html).openPopup()
        map.setView([lat, lng], 4, { animate: true })
      } catch (err) {
        console.error('[fetchUser] error:', err)
      }
    }

    // 先跑一次
    void fetchUser()

    // ⭐ 每 10 秒戳一次 API
    const id = window.setInterval(() => {
      console.log('[interval] fetchUser at', new Date().toISOString())
      void fetchUser()
    }, 10 * 1000)

    // 清理
    return () => {
      window.clearInterval(id)
      if (mapRef.current) {
        mapRef.current.remove()
        mapRef.current = null
      }
      markerRef.current = null
    }
  }, [])

  return (
    <div
      ref={mapContainerRef}
      style={{
        width: '500px',
        height: '500px', // 正方形
        border: '1px solid #ddd',
      }}
    />
  )
}

export default LeafletMap
