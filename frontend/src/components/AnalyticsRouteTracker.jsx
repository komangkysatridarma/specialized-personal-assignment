import { useEffect } from 'react'
import { useLocation } from 'react-router'
import { trackPageView } from '../analytics'

function AnalyticsRouteTracker() {
  const location = useLocation()

  useEffect(() => {
    trackPageView(location.pathname + location.search)
  }, [location])

  return null
}

export default AnalyticsRouteTracker
