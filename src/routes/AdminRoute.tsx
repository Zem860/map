// routes/AdminRoute.tsx
import { Navigate } from "react-router-dom"
import type { ReactElement } from "react"

const getCookie = (name: string) => {
  return document.cookie.replace(
    new RegExp(`(?:(?:^|.*;\\s*)${name}\\s*=\\s*([^;]*).*$)|^.*$`),
    "$1",
  )
}

export default function AdminRoute({ children }: { children: ReactElement }) {
  const hexToken = getCookie("hexToken")
//   const role = localStorage.getItem("role") // 你如果目前是教學存 role，就先保留

  if (!hexToken) return <Navigate to="/login" replace />
//   if (role !== "admin") return <Navigate to="/login" replace />

  return children
}
