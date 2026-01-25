import { useEffect, useRef, useState } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

// ---- 1. Leaflet Icon Fix (標準修正) ----
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

// ---- 2. Types 定義 (清楚定義資料結構) ----
type SimulationResult = {
  city: string
  country: string
  lat: number
  lng: number
}

// ---- 3. Service Layer (負責髒活：API 抓取與座標轉換) ----
// 將這些邏輯放在 Component 之外，保持 Component 乾淨
const LocationService = {
  cache: {} as Record<string, [number, number]>,

  // 取得隨機 User (只抓需要的欄位)
  async fetchRandomUser() {
    try {
      const res = await fetch('https://randomuser.me/api/?inc=location,name&noinfo')
      const data = await res.json()
      return data.results?.[0]
    } catch (err) {
      console.error('RandomUser API Error:', err)
      return null
    }
  },

  // 精準座標查詢 (Open-Meteo)
  async resolveCoordinates(city: string, country: string): Promise<[number, number] | null> {
    const key = `${city}-${country}`.toLowerCase()
    if (this.cache[key]) return this.cache[key]

    try {
      // 同時搜尋 city 與 country 可以大幅提高精準度
      const query = `${city}, ${country}`
      const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
        query
      )}&count=1&language=en&format=json`

      const res = await fetch(url)
      const data = await res.json()
      const item = data.results?.[0]

      if (item && item.latitude && item.longitude) {
        const coords: [number, number] = [item.latitude, item.longitude]
        this.cache[key] = coords
        return coords
      }
    } catch (err) {
      console.warn('Geocoding Error:', err)
    }
    return null
  },
}

// ---- 4. Main Component ----
export const LeafletMap: React.FC<{ products: productData[] }> = ({ products }) => {
  // Map Refs
  const mapContainerRef = useRef<HTMLDivElement | null>(null)
  const mapInstanceRef = useRef<L.Map | null>(null)
  const markerRef = useRef<L.Marker | null>(null)

  // ✅ 這就是你之後要放在 Store 的變數
  // 目前先用 local state 模擬，你可以直接拿這個 state 去做結帳邏輯
  const [currentStoreContext, setCurrentStoreContext] = useState<{
    city: string
    country: string
  } | null>(null)

  // 初始化地圖 (只執行一次)
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return

    const map = L.map(mapContainerRef.current, { center: [20, 0], zoom: 2 })
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; OpenStreetMap',
    }).addTo(map)

    mapInstanceRef.current = map

    return () => {
      map.remove()
      mapInstanceRef.current = null
    }
  }, [])

  // 模擬邏輯 (每 10 秒執行一次)
  useEffect(() => {
    let isMounted = true

    const runSimulation = async () => {
      if (!mapInstanceRef.current || products.length === 0) return

      // 1. 隨機選書
      const pickedProduct = products[Math.floor(Math.random() * products.length)]

      // 2. 抓 User
      const user = await LocationService.fetchRandomUser()
      if (!user || !isMounted) return

      const { city, country } = user.location

      // 3. 抓精準座標 (忽略 RandomUser 給的假座標)
      const coords = await LocationService.resolveCoordinates(city, country)
      
      // 如果查不到座標，這次就跳過，避免標在地圖奇怪的地方
      if (!coords || !isMounted) return 

      const [lat, lng] = coords

      // 4. ✅ 更新變數 (模擬 Store 更新)
      // 這裡你可以想像成: dispatch(setStoreLocation({ city, country }))
      setCurrentStoreContext({ city, country })

      // 5. 更新地圖 UI
      updateMapUI(mapInstanceRef.current, markerRef, {
        lat,
        lng,
        city,
        country,
      }, pickedProduct)
    }

    // 立即執行一次，然後設 Interval
    runSimulation()
    const intervalId = setInterval(runSimulation, 10000)

    return () => {
      isMounted = false
      clearInterval(intervalId)
    }
  }, [products])

  // Helper: 更新地圖與 Marker (抽離出來讓 useEffect 更乾淨)
  const updateMapUI = (
    map: L.Map,
    markerRef: React.MutableRefObject<L.Marker | null>,
    location: SimulationResult,
    product: productData
  ) => {
    const { lat, lng, city, country} = location
    const author = JSON.parse(product.content || '{}').author || 'Unknown'

    const popupHtml = `
      <div style="font-family: system-ui; min-width: 220px;">
        <div style="display:flex; gap:10px; margin-bottom:8px; align-items: start;">
           <img src="${product.imageUrl}" style="width:48px; height:64px; object-fit:cover; border-radius:4px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);" />
           <div>
             <div style="font-weight:bold; font-size:14px; line-height: 1.2; margin-bottom: 2px;">${product.title}</div>
             <div style="font-size:12px; color:#666;">by ${author}</div>
           </div>
        </div>
        <div style="font-size:13px; border-top: 1px solid #eee; padding-top: 6px; color: #444;">
          <strong>Someone</strong> just bought this in <br/>
          <span style="color:#d32f2f; font-weight:bold;">${city}, ${country}</span>
        </div>
      </div>
    `

    if (!markerRef.current) {
      markerRef.current = L.marker([lat, lng]).addTo(map)
    } else {
      markerRef.current.setLatLng([lat, lng])
    }

    markerRef.current.bindPopup(popupHtml).openPopup()
    
    // 使用 flyTo 會有更精緻的飛行動畫
    map.flyTo([lat, lng], 6, { duration: 2 })
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
      {/* ✅ 變數顯示區塊 
         這區塊模擬之後你在結帳頁面或是 Store 裡面會拿到的資料
      */}
      <div style={{ 
        padding: '12px', 
        background: '#f8f9fa', 
        border: '1px solid #e9ecef', 
        borderRadius: '8px',
        fontSize: '14px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <span>🛒 Current Store Context:</span>
        {currentStoreContext ? (
          <strong style={{ color: '#2e7d32' }}>
            {currentStoreContext.city}, {currentStoreContext.country}
          </strong>
        ) : (
          <span style={{ color: '#999' }}>Waiting for incoming order...</span>
        )}
      </div>

      <div 
        ref={mapContainerRef} 
        style={{ 
          height: '500px', 
          width: '100%', 
          borderRadius: '8px', 
          overflow: 'hidden',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)' 
        }} 
      />
    </div>
  )
}

export default LeafletMap