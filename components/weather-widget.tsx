/**
 * Input: react
 * Output: WeatherWidget (default)
 * Pos: UI层-页眉天气挂件（IP 定位 → Open-Meteo 实时天气，localStorage 缓存 30 分钟，失败静默隐藏）
 *
 * 本注释在文件修改时自动更新
 */

'use client'

import { useEffect, useState } from 'react'

const CACHE_KEY = 'weather-widget-v1'
const CACHE_TTL_MS = 30 * 60 * 1000
// IP 定位失败时的回退位置；更换默认城市只需改这里
const FALLBACK_LOCATION = { city: '北京', latitude: 39.9042, longitude: 116.4074 }

type IconKey = 'sun' | 'cloud' | 'fog' | 'rain' | 'snow' | 'thunder'

interface Weather {
  temperature: number
  code: number
  city: string
}

// 线条图标（与 theme-toggle 同风格，stroke 2 / round），按 WMO weather code 分组
const ICON_PATHS: Record<IconKey, string> = {
  sun: 'M8 12a4 4 0 1 0 8 0a4 4 0 1 0-8 0m-5 0h1m8-9v1m8 8h1m-9 8v1M5.6 5.6l.7.7m12.1-.7l-.7.7m0 11.4l.7.7m-12.1-.7l-.7.7',
  cloud:
    'M6.657 18c-2.572 0-4.657-2.007-4.657-4.483 0-2.475 2.085-4.482 4.657-4.482.393-1.762 1.794-3.2 3.675-3.773 1.88-.572 3.956-.193 5.444 1 1.488 1.19 2.162 3.007 1.77 4.769h.99c1.913 0 3.464 1.56 3.464 3.486 0 1.927-1.551 3.487-3.465 3.487h-11.878',
  fog: 'M5 5h3m4 0h9m-18 5h11m4 0h1m-16 5h5m4 0h7m-17 5h9m4 0h3',
  rain: 'M7 18a4.6 4.4 0 0 1 0 -9a5 4.5 0 0 1 11 2h1a3.5 3.5 0 0 1 0 7M11 13v2m0 3v2m4 -5v2m0 3v2',
  snow: 'M7 18a4.6 4.4 0 0 1 0 -9a5 4.5 0 0 1 11 2h1a3.5 3.5 0 0 1 0 7M11 15v.01m0 3v.01m0 3v.01m4 -4v.01m0 3v.01',
  thunder: 'M7 18a4.6 4.4 0 0 1 0 -9a5 4.5 0 0 1 11 2h1a3.5 3.5 0 0 1 0 7M13 14l-2 4h3l-2 4',
}

// WMO weather interpretation codes → 图标 + 中文描述
function classifyWeather(code: number): { icon: IconKey; label: string } {
  if (code <= 1) return { icon: 'sun', label: '晴' }
  if (code === 2) return { icon: 'cloud', label: '多云' }
  if (code === 3) return { icon: 'cloud', label: '阴' }
  if (code === 45 || code === 48) return { icon: 'fog', label: '雾' }
  if (code >= 51 && code <= 57) return { icon: 'rain', label: '毛毛雨' }
  if (code >= 61 && code <= 67) return { icon: 'rain', label: '雨' }
  if (code >= 71 && code <= 77) return { icon: 'snow', label: '雪' }
  if (code >= 80 && code <= 82) return { icon: 'rain', label: '阵雨' }
  if (code === 85 || code === 86) return { icon: 'snow', label: '阵雪' }
  if (code >= 95) return { icon: 'thunder', label: '雷暴' }
  return { icon: 'cloud', label: '多云' }
}

function readCache(): Weather | null {
  try {
    const raw = window.localStorage.getItem(CACHE_KEY)
    if (!raw) return null
    const entry = JSON.parse(raw) as { timestamp?: number; weather?: Weather }
    if (
      typeof entry?.timestamp !== 'number' ||
      Date.now() - entry.timestamp >= CACHE_TTL_MS ||
      typeof entry.weather?.temperature !== 'number' ||
      typeof entry.weather?.code !== 'number' ||
      typeof entry.weather?.city !== 'string'
    ) {
      return null
    }
    return entry.weather
  } catch {
    return null
  }
}

function writeCache(weather: Weather) {
  try {
    window.localStorage.setItem(CACHE_KEY, JSON.stringify({ timestamp: Date.now(), weather }))
  } catch {
    // localStorage 不可用（隐私模式等）时跳过缓存
  }
}

async function locateByIp(signal: AbortSignal) {
  const res = await fetch('https://get.geojs.io/v1/ip/geo.json', { signal })
  if (!res.ok) throw new Error(`geojs ${res.status}`)
  const data = await res.json()
  const latitude = Number.parseFloat(data?.latitude)
  const longitude = Number.parseFloat(data?.longitude)
  if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
    throw new Error('geojs: no coordinates')
  }
  return {
    city: typeof data?.city === 'string' && data.city !== '' ? data.city : FALLBACK_LOCATION.city,
    latitude,
    longitude,
  }
}

async function fetchWeather(signal: AbortSignal): Promise<Weather | null> {
  const cached = readCache()
  if (cached) return cached

  const location = await locateByIp(signal).catch(() => FALLBACK_LOCATION)
  const params = new URLSearchParams({
    latitude: String(location.latitude),
    longitude: String(location.longitude),
    current: 'temperature_2m,weather_code',
  })
  const res = await fetch(`https://api.open-meteo.com/v1/forecast?${params}`, { signal })
  if (!res.ok) return null
  const data = await res.json()
  const temperature = data?.current?.temperature_2m
  const code = data?.current?.weather_code
  if (typeof temperature !== 'number' || typeof code !== 'number') return null

  const weather: Weather = { temperature: Math.round(temperature), code, city: location.city }
  writeCache(weather)
  return weather
}

export default function WeatherWidget() {
  const [weather, setWeather] = useState<Weather | null>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const controller = new AbortController()
    fetchWeather(controller.signal)
      .then(result => {
        if (result) setWeather(result)
      })
      .catch(() => {
        // 静默失败：定位/天气接口异常时不渲染，不影响页面其余部分
      })
    return () => controller.abort()
  }, [])

  useEffect(() => {
    if (!weather) return
    const frame = window.requestAnimationFrame(() => setVisible(true))
    return () => window.cancelAnimationFrame(frame)
  }, [weather])

  if (!weather) return null

  const { icon, label } = classifyWeather(weather.code)

  return (
    <span
      title={`${weather.city} · ${label} ${weather.temperature}°C`}
      className={`flex cursor-default select-none items-center gap-1.5 font-mono text-xs text-neutral-500 transition-opacity duration-500 ease-out dark:text-neutral-400 ss:hidden ${
        visible ? 'opacity-100' : 'opacity-0'
      }`}
    >
      <svg
        aria-hidden="true"
        className="size-4"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d={ICON_PATHS[icon]} />
      </svg>
      <span className="tabular-nums">{weather.temperature}°C</span>
    </span>
  )
}
