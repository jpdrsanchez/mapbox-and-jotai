import { useRef, useEffect } from 'react'
import mapboxgl, { Map } from 'mapbox-gl'

import 'mapbox-gl/dist/mapbox-gl.css';

import './App.css'
import { atom, useAtom } from 'jotai';

interface MapState {
  center: [number, number],
  zoom: number
}

const mapInfo = atom<MapState>({
  center: [-46.633308, -23.550520],
  zoom: 10.12
})

function App() {
  const mapRef = useRef<Map>(null)
  const mapContainerRef = useRef<HTMLDivElement>(null)
  
  const [map, setMap] = useAtom<MapState>(mapInfo)

  useEffect(() => {
    mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_API_KEY
    mapRef.current = new mapboxgl.Map({
      container: mapContainerRef.current as HTMLElement,
      center: map.center,
      zoom: map.zoom
    })

    mapRef.current.on('move', () => {
      console.log('render')

      if (!mapRef.current) return

      const mapCenter = mapRef.current.getCenter()
      const mapZoom = mapRef.current.getZoom()

      setMap(state => ({
        ...state,
        center: [mapCenter.lng, mapCenter.lat],
        zoom: mapZoom
      }))
    })

    return () => {
      mapRef.current?.remove()
    }
  }, [map.center, map.zoom, setMap])
 
  return (
    <>
      <div className="sidebar">
        Longitude: {map.center[0].toFixed(4)} | Latitude: {map.center[1].toFixed(4)} | Zoom: {map.zoom.toFixed(2)}
      </div>
      <div id='map-container' ref={mapContainerRef} />
    </>
  )
}

export default App
