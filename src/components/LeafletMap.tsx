import { useEffect, useRef } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png'
import markerIcon from 'leaflet/dist/images/marker-icon.png'
import markerShadow from 'leaflet/dist/images/marker-shadow.png'
import type { productData } from '@/type/product'

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
    coordinates: { latitude: string; longitude: string }
  }
}

type RandomUserApiResponse = { results: RandomUser[] }

// ---- 小 cache：避免一直查同樣的地點 / 國家 ----
const latLngCache: Record<string, [number, number]> = {}
const countryIso2Cache: Record<string, string> = {}

// 回傳國碼
async function getIso2(countryName: string): Promise<string | null> {
  const key = countryName.trim().toLowerCase()
  if (countryIso2Cache[key]) return countryIso2Cache[key]

  try {
    // restcountries欄位名字叫 cca2=ISO2
    const url = `https://restcountries.com/v3.1/name/${encodeURIComponent(countryName)}?fields=cca2`
    const res = await fetch(url)
    if (!res.ok) return null
    const data = await res.json()
    const iso2 = data?.[0]?.cca2
    if (!iso2) return null
    countryIso2Cache[key] = iso2
    return iso2
  } catch {
    return null
  }
}

// Open-Meteo：用城市名 +（可選）國碼查座標
async function geocodeCity(city: string, iso2?: string | null): Promise<[number, number] | null> {
  const cacheKey = `${(iso2 ?? '').toLowerCase()}__${city.trim().toLowerCase()}`
  if (latLngCache[cacheKey]) return latLngCache[cacheKey]

  try {
    const url =
      `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}` +
      `&count=1&language=en&format=json` +
      (iso2 ? `&country=${encodeURIComponent(iso2)}` : '')

    const res = await fetch(url)
    if (!res.ok) return null

    const data = await res.json()
    const item = data?.results?.[0]
    const lat = item?.latitude
    const lon = item?.longitude
    if (typeof lat !== 'number' || typeof lon !== 'number') return null

    const latLng: [number, number] = [lat, lon]
    latLngCache[cacheKey] = latLng
    return latLng
  } catch {
    return null
  }
}

async function resolveLatLng(input: { city: string; country: string }): Promise<[number, number] | null> {
  const iso2 = await getIso2(input.country) // 這行你不用管它怎麼拿到的
  return await geocodeCity(input.city, iso2)
}

export const LeafletMap: React.FC<{ products: productData[] }> = ({ products }) => {
  const mapRef = useRef<L.Map | null>(null)
  const markerRef = useRef<L.Marker | null>(null)
  const mapContainerRef = useRef<HTMLDivElement | null>(null)
  useEffect(() => {
    const container = mapContainerRef.current
    if (!container) return

    let disposed = false

    if (!mapRef.current) {
      const map = L.map(container, { center: [20, 0], zoom: 2 })
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; OpenStreetMap',
      }).addTo(map)
      mapRef.current = map
    }

    const fetchUser = async () => {
      const picked = products[Math.floor(Math.random() * products.length)];
      const map = mapRef.current
      if (!map || disposed) return

      try {
        const res = await fetch('https://randomuser.me/api/')
        const data: RandomUserApiResponse = await res.json()
        const user = data.results?.[0]
        if (!user || disposed) return
        // const fullName = `${user.name.title} ${user.name.first} ${user.name.last}`
        // const query = { city: 'Taipei', country: 'Taiwan' }
        const query = {
          city: user.location.city,
          country: user.location.country,
        }

        // ✅ 用你指定的 city/country 查座標
        let latLng = await resolveLatLng(query)

        // ✅ fallback：randomuser 原始座標（保留你原本邏輯）
        if (!latLng) {
          const rawLat = parseFloat(user.location.coordinates.latitude)
          const rawLng = parseFloat(user.location.coordinates.longitude)
          if (!Number.isNaN(rawLat) && !Number.isNaN(rawLng)) {
            latLng = [rawLat, rawLng]
          } else {
            return
          }
        }

        if (disposed) return
        const [lat, lng] = latLng

        const html = `
          <div style="display:flex; align-items:center; gap:8px; margin-bottom:8px;">
          <div style="font-size:14px; line-height:1.5; max-width:260px;">
            <div>Someone from <strong>${user.location.city || '-'}, ${user.location.country || '-'}</strong></div>
            <div>just bought <strong>${picked.title}</strong> by <strong>${JSON.parse(picked.content || '{}').author}</strong></div>
          </div>
                      <img src="${picked.imageUrl}" style="width:40px;height:40px;margin-bottom:6px;" />
</div>
        `

        if (!markerRef.current) {
          markerRef.current = L.marker([lat, lng]).addTo(map)
        } else {
          markerRef.current.setLatLng([lat, lng])
        }

        markerRef.current.bindPopup(html).openPopup()
        map.setView([lat, lng], 7, { animate: true })
      } catch (err) {
        if (!disposed) console.error('[fetchUser] error:', err)
      }
    }

    fetchUser()
    const id = setInterval(() => { fetchUser(); }, 10_000)

    return () => {
      disposed = true
      window.clearInterval(id)
      if (mapRef.current) {
        mapRef.current.remove()
        mapRef.current = null
      }
      markerRef.current = null
    }
  }, [])

  return <div ref={mapContainerRef} style={{ height: '500px', border: '1px solid #ddd' }} />
}

export default LeafletMap
