const measurementId = import.meta.env.VITE_GA_MEASUREMENT_ID

let initPromise = null

function ensureGtag() {
  if (!measurementId) {
    return Promise.resolve(false)
  }

  if (typeof window.gtag === 'function') {
    return Promise.resolve(true)
  }

  if (!initPromise) {
    initPromise = new Promise((resolve) => {
      window.dataLayer = window.dataLayer || []
      window.gtag = function gtag() {
        window.dataLayer.push(arguments)
      }
      window.gtag('js', new Date())

      const script = document.createElement('script')
      script.async = true
      script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`
      script.onload = () => {
        window.gtag('config', measurementId, { send_page_view: false })
        resolve(true)
      }
      script.onerror = () => resolve(false)
      document.head.appendChild(script)
    })
  }

  return initPromise
}

export function initAnalytics() {
  void ensureGtag()
}

export async function trackPageView(path) {
  const ready = await ensureGtag()
  if (!ready) {
    return
  }
  window.gtag('event', 'page_view', {
    page_path: path,
    page_title: document.title,
  })
}

export async function trackEvent(name, params = {}) {
  const ready = await ensureGtag()
  if (!ready) {
    return
  }
  window.gtag('event', name, params)
}
