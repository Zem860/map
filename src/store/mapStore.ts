import { create } from "zustand"

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
  clearConfirmed: () => void
}

// ---- Service Layer ----
const coordsCache: Record<string, [number, number]> = {}

async function resolveCoordinates(city: string, country: string): Promise<[number, number] | null> {
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

    if (item?.latitude && item?.longitude) {
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
    const res = await fetch("https://randomuser.me/api/?inc=location,name&noinfo")
    const data = await res.json()
    return data.results?.[0]
  } catch (err) {
    console.error("RandomUser API Error:", err)
    return null
  }
}

// ---- 暫停時長 (ms) ----
const PAUSE_DURATION = 15_000

// ✅ 永遠只保留一個 timer，避免 confirmPayment 連點時 timer 疊加
let resumeTimer: ReturnType<typeof setTimeout> | null = null
const clearResumeTimer = () => {
  if (resumeTimer) {
    clearTimeout(resumeTimer)
    resumeTimer = null
  }
}

export const useMapStore = create<MapStore>((set, get) => ({
  currentContext: null,
  currentProduct: null,
  isPaused: false,
  isRandom: true,
  pauseUntil: null,
  confirmedContext: null,
  confirmedProduct: null,

  updateContext: (ctx, product) => {
    // 如果暫停中，不允許 random 覆蓋
    if (get().isPaused) return
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
    clearResumeTimer()

    set({
      confirmedContext: ctx,
      confirmedProduct: product,
      currentContext: ctx,
      currentProduct: product,
      isPaused: true,
      isRandom: false,
      pauseUntil,
    })

    // 3. 倒計時後自動恢復（單一 timer）
    resumeTimer = setTimeout(() => {
      get().resumeRandom()
    }, PAUSE_DURATION)
  },

  resumeRandom: () => {
    clearResumeTimer()
    set({
      isPaused: false,
      isRandom: true,
      pauseUntil: null,
      confirmedContext: null,
      confirmedProduct: null,
    })
  },

  clearConfirmed: () => {
    set({ confirmedContext: null, confirmedProduct: null })
  },
}))

// ---- 匯出 Service 給 LeafletMap simulation 用 ----
export const MapService = {
  fetchRandomUser,
  resolveCoordinates,
}
