import { create } from "zustand"
import { persist } from "zustand/middleware"

export type StoreContext = {
  city: string
  country: string
  lat: number
  lng: number
}

export type MapProduct = {
  title: string
  imageUrl: string
  author: string
}

type MapStore = {
  // ---- state ----
  currentContext: StoreContext | null
  currentProduct: MapProduct | null
  isPaused: boolean
  // true = 隨機模式, false = 正在顯示真實購買
  isRandom: boolean
  pauseUntil: number | null
  confirmedContext: StoreContext | null
  confirmedProduct: MapProduct | null

  // ---- actions ----
  updateContext: (ctx: StoreContext, product: MapProduct) => void
  confirmPayment: (city: string, country: string, product: MapProduct) => Promise<void>
  resumeRandom: () => void
  checkAndResume: () => void
  clearConfirmed: () => void
}

// ---- Service Layer ----
const coordsCache: Record<string, [number, number]> = {}

async function resolveCoordinates(
  city: string,
  country: string
): Promise<[number, number] | null> {
  const key = `${city}-${country}`.toLowerCase()
  if (coordsCache[key]) return coordsCache[key]

  try {
    const query = `${city}, ${country}`
    const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
      query
    )}&count=1&language=en&format=json`

    const res = await fetch(url)
    const data = await res.json()
    const item = data.results?.[0]

    if (item && item.latitude && item.longitude) {
      const coords: [number, number] = [item.latitude, item.longitude]
      coordsCache[key] = coords
      return coords
    }
  } catch (err) {
    console.warn("Geocoding Error:", err)
  }
  return null
}

async function fetchRandomUser() {
  try {
    const res = await fetch(
      "https://randomuser.me/api/?inc=location,name&noinfo"
    )
    const data = await res.json()
    return data.results?.[0]
  } catch (err) {
    console.error("RandomUser API Error:", err)
    return null
  }
}

// ---- 暫停時長 (ms) ----
const PAUSE_DURATION = 15_000

export const useMapStore = create<MapStore>()(
  persist(
    (set, get) => ({
      currentContext: null,
      currentProduct: null,
      isPaused: false,
      isRandom: true,
      pauseUntil: null,
      confirmedContext: null,
      confirmedProduct: null,

      updateContext: (ctx, product) => {
        const { isPaused } = get()
        // 如果暫停中，不允許 random 覆蓋
        if (isPaused) return
        set({ currentContext: ctx, currentProduct: product, isRandom: true })
      },

      confirmPayment: async (city, country, product) => {
        // 1. 解析座標
        const coords = await resolveCoordinates(city, country)
        if (!coords) {
          console.warn("無法解析 payment 地址座標:", city, country)
          return
        }

        const [lat, lng] = coords
        const ctx: StoreContext = { city, country, lat, lng }

        // 2. 寫入 confirmed + current，並暫停 random
        const pauseUntil = Date.now() + PAUSE_DURATION
        set({
          confirmedContext: ctx,
          confirmedProduct: product,
          currentContext: ctx,
          currentProduct: product,
          isPaused: true,
          isRandom: false,
          pauseUntil,
        })

        // 3. 倒計時後自動恢復
        setTimeout(() => {
          get().resumeRandom()
        }, PAUSE_DURATION)
      },

      resumeRandom: () => {
        set({
          isPaused: false,
          isRandom: true,
          pauseUntil: null,
          confirmedContext: null,
          confirmedProduct: null,
        })
      },

      // 頁面載入時呼叫：檢查 persist 回來的 pauseUntil 是否還沒到期
      checkAndResume: () => {
        const { isPaused, pauseUntil } = get()
        if (!isPaused || !pauseUntil) return

        const remaining = pauseUntil - Date.now()
        if (remaining <= 0) {
          // 已過期，直接恢復
          console.log('[mapStore] pause expired, resuming random')
          get().resumeRandom()
        } else {
          // 還沒到期，設定 timer 等時間到再恢復
          console.log('[mapStore] pause still active, resuming in', remaining, 'ms')
          setTimeout(() => {
            console.log('[mapStore] pause timer fired, resuming random')
            get().resumeRandom()
          }, remaining)
        }
      },

      clearConfirmed: () => {
        set({ confirmedContext: null, confirmedProduct: null })
      },
    }),
    {
      name: "map-store",
      // 只 persist 需要跨頁面保留的 state
      partialize: (state) => ({
        currentContext: state.currentContext,
        currentProduct: state.currentProduct,
        isPaused: state.isPaused,
        isRandom: state.isRandom,
        pauseUntil: state.pauseUntil,
        confirmedContext: state.confirmedContext,
        confirmedProduct: state.confirmedProduct,
      }),
    }
  )
)

// ---- 匯出 Service 給 LeafletMap simulation 用 ----
export const MapService = {
  fetchRandomUser,
  resolveCoordinates,
}