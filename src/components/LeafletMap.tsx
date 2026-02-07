import { useEffect, useRef, useCallback } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

// ---- 1. Leaflet Icon Fix (標準修正) ----
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png'
import markerIcon from 'leaflet/dist/images/marker-icon.png'
import markerShadow from 'leaflet/dist/images/marker-shadow.png'
import type { productData } from '@/type/product'
import { useMapStore, MapService } from '@/store/mapStore'
import type { MapProduct, StoreContext } from '@/store/mapStore'

delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
})

// ---- Helper: productData → MapProduct ----
function toMapProduct(product: productData): MapProduct {
  const author = (() => {
    try {
      return JSON.parse(product.content || '{}').author || 'Unknown'
    } catch {
      return 'Unknown'
    }
  })()
  return {
    title: product.title,
    imageUrl: product.imageUrl,
    author,
  }
}

// ---- Main Component ----
export const LeafletMap: React.FC<{ products: productData[] }> = ({ products }) => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null)
  const mapInstanceRef = useRef<L.Map | null>(null)
  const markerRef = useRef<L.Marker | null>(null)
  // 用來追蹤地圖是否已經初始化完成
  const mapReadyRef = useRef(false)

  // 從 store 訂閱
  const currentContext = useMapStore((s) => s.currentContext)
  const currentProduct = useMapStore((s) => s.currentProduct)
  const isPaused = useMapStore((s) => s.isPaused)
  const isRandom = useMapStore((s) => s.isRandom)

  // ---- 共用的地圖 UI 更新函式 ----
  const showPopupOnMap = useCallback(
    (ctx: StoreContext, product: MapProduct) => {
      const map = mapInstanceRef.current
      if (!map) return

      const { lat, lng, city, country } = ctx
      const labelText = 'Someone just bought this in'
      const labelColor = '#d32f2f'

      const popupHtml = `
        <div style="font-family: system-ui; min-width: 220px;">
          <div style="display:flex; gap:10px; margin-bottom:8px; align-items: start;">
             <img src="${product.imageUrl}" style="width:48px; height:64px; object-fit:cover; border-radius:4px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);" />
             <div>
               <div style="font-weight:bold; font-size:14px; line-height: 1.2; margin-bottom: 2px;">${product.title}</div>
               <div style="font-size:12px; color:#666;">by ${product.author}</div>
             </div>
          </div>
          <div style="font-size:13px; border-top: 1px solid #eee; padding-top: 6px; color: #444;">
            <strong>${labelText}</strong><br/>
            <span style="color:${labelColor}; font-weight:bold;">${city}, ${country}</span>
          </div>
        </div>
      `

      // 更新 / 建立 marker
      if (!markerRef.current) {
        markerRef.current = L.marker([lat, lng]).addTo(map)
      } else {
        markerRef.current.setLatLng([lat, lng])
      }

      // 使用 Leaflet 的 popup API，直接開在指定座標
      const popup = L.popup({ maxWidth: 260 })
        .setLatLng([lat, lng])
        .setContent(popupHtml)

      popup.openOn(map)

      // 再飛動畫，視覺上會從目前位置飛到新點
      map.flyTo([lat, lng], 6, { duration: 2 })
    },
    []
  )

  // ---- 初始化地圖 (只執行一次) ----
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return

    const map = L.map(mapContainerRef.current, { center: [20, 0], zoom: 2 })
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; OpenStreetMap',
    }).addTo(map)

    mapInstanceRef.current = map
    mapReadyRef.current = true

    // ✅ 地圖剛初始化：如果 store 裡有 persisted 資料，馬上顯示 popup
    const { currentContext: ctx, currentProduct: prod, isPaused: paused } =
      useMapStore.getState()
    if (ctx && prod) {
      // 等地圖 tile 載入完再 flyTo，避免動畫卡頓
      setTimeout(() => {
        showPopupOnMap(ctx, prod, paused)
      }, 300)
    }

    // 頁面載入時檢查暫停倒計時是否需要恢復
    useMapStore.getState().checkAndResume()

    return () => {
      map.remove()
      mapInstanceRef.current = null
      mapReadyRef.current = false
    }
  }, [showPopupOnMap])

  // ---- 每 10 秒 random simulation ----
  useEffect(() => {
    let isMounted = true

    const runSimulation = async () => {
      // ⛔ 如果 store 暫停中，跳過
      if (useMapStore.getState().isPaused) return
      if (!mapInstanceRef.current || products.length === 0) return

      const pickedProduct = products[Math.floor(Math.random() * products.length)]

      const user = await MapService.fetchRandomUser()
      if (!user || !isMounted) return

      const { city, country } = user.location
      const coords = await MapService.resolveCoordinates(city, country)
      if (!coords || !isMounted) return

      // 再次確認沒被暫停（async 期間狀態可能改變）
      if (useMapStore.getState().isPaused) return

      const [lat, lng] = coords 
      const mapProduct = toMapProduct(pickedProduct)

      // 寫入 store（包含書的資料）
      console.log('[LeafletMap] updateContext:', { city, country, lat, lng }, mapProduct)
      useMapStore.getState().updateContext({ city, country, lat, lng }, mapProduct)
    }

    // 立即執行一次，然後設 Interval
    runSimulation()
    const intervalId = setInterval(runSimulation, 10_000)

    return () => {
      isMounted = false
      clearInterval(intervalId)
    }
  }, [products])

  // ---- 監聽 store 的 currentContext / currentProduct 變化 → 更新地圖 popup ----
  useEffect(() => {
    console.log('[LeafletMap] store changed:', { currentContext, currentProduct, isPaused, mapReady: mapReadyRef.current })
    if (!currentContext || !currentProduct) return
    if (!mapReadyRef.current) return

    showPopupOnMap(currentContext, currentProduct, isPaused)
  }, [currentContext, currentProduct, isPaused, showPopupOnMap])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
      {/* ✅ 狀態顯示區塊：顯示書名 + 圖片 + 地點 */}
      <div
        style={{
          padding: '12px',
          background: isPaused ? '#e8f5e9' : '#f8f9fa',
          border: `1px solid ${isPaused ? '#a5d6a7' : '#e9ecef'}`,
          borderRadius: '8px',
          fontSize: '14px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <span>{!isRandom ? '🎉 Real Purchase:' : '🛒 Current Store Context:'}</span>
        {currentContext && currentProduct ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <img
              src={currentProduct.imageUrl}
              alt={currentProduct.title}
              style={{ width: 24, height: 32, objectFit: 'cover', borderRadius: 3 }}
            />
            <div>
              <strong style={{ color: !isRandom ? '#1b5e20' : '#2e7d32' }}>
                {currentProduct.title}
              </strong>
              <span style={{ color: '#666', marginLeft: 8, fontSize: 13 }}>
                {currentContext.city}, {currentContext.country}
              </span>
            </div>
          </div>
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
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        }}
      />
    </div>
  )
}

export default LeafletMap