import { useEffect, useRef } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

// 修正預設 marker icon
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
  }
}

type RandomUserApiResponse = {
  results: RandomUser[]
}

type NominatimResult = {
  lat: string
  lon: string
}

const geocodeCity = async (user: RandomUser): Promise<[number, number] | null> => {
  const query = encodeURIComponent(
    `${user.location.city}, ${user.location.state}, ${user.location.country}`
  )

  const url = `https://nominatim.openstreetmap.org/search?format=json&q=${query}&limit=1`

  const res = await fetch(url, {
    headers: {
      "User-Agent": "leaflet-randomuser-demo",
    },
  })

  if (!res.ok) return null

  const data: NominatimResult[] = await res.json()
  if (!data.length) return null

  return [parseFloat(data[0].lat), parseFloat(data[0].lon)]
}

export const LeafletMap: React.FC = () => {
  const mapRef = useRef<L.Map | null>(null)
  const markerRef = useRef<L.Marker | null>(null)
  const mapContainerRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (!mapContainerRef.current) return

    if (!mapRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [20, 0],
        zoom: 2,
      })

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution: "&copy; OpenStreetMap",
      }).addTo(map)

      mapRef.current = map
    }

    const fetchUser = async () => {
      if (!mapRef.current) return

      const res = await fetch("https://randomuser.me/api/")
      const data: RandomUserApiResponse = await res.json()
      const user = data.results[0]

      const coords = await geocodeCity(user)
      if (!coords) return
      const [lat, lng] = coords

      // popup HTML — 保證能正確呈現
      const html = `
        <div style="font-size:14px;">
          <img src="${user.picture.thumbnail}" 
               style="width:40px;height:40px;border-radius:50%;margin-bottom:6px;" />
          <div><strong>${user.name.first} ${user.name.last}</strong></div>
          <div>${user.location.city}, ${user.location.state}</div>
          <div>${user.location.country}</div>
          <br/>
          <div>Email: ${user.email}</div>
          <div>Cell: ${user.cell}</div>
        </div>
      `

      // 移除舊的 marker
      if (markerRef.current) {
        mapRef.current.removeLayer(markerRef.current)
      }

      const marker = L.marker([lat, lng]).addTo(mapRef.current)
      marker.bindPopup(html).openPopup()
      markerRef.current = marker

      mapRef.current.setView([lat, lng], 4, { animate: true })
    }

    // 先執行一次
    fetchUser()
    const id = setInterval(fetchUser, 30 * 1000)

    return () => {
      clearInterval(id)
      if (mapRef.current) mapRef.current.remove()
    }
  }, [])

  return (
    <div
      ref={mapContainerRef}
      style={{
        width: "500px",
        height: "500px", // ⭐ 正方形地圖
        border: "1px solid #ddd",
      }}
    />
  )
}
