import { ref, Ref } from 'vue'
import { debouncedWatch, set } from '@vueuse/core'
import { Loader } from '@googlemaps/js-api-loader'

const loader = new Loader({ apiKey: import.meta.env.VITE_GOOGLE_API_KEY })

const DEFAULT_MAP_OPTIONS: google.maps.MapOptions = {
  center: { lat: 47.629568, lng: -122.359954 },
  zoom: 12,
  panControl: false,
  zoomControl: false,
  mapTypeControl: false,
  fullscreenControl: false,
  streetViewControl: false,
  gestureHandling: 'none',
}

export function useGoogleMaps(mapElementRef: Readonly<Ref<HTMLElement>>, addressRef: Ref<string>) {
  const googleApiRef = ref<typeof google>()
  const mapInstance = ref<google.maps.Map>()
  const geocoderInstance = ref<google.maps.Geocoder>()

  function isGoogleApiLoaded(googleApi: typeof google | undefined): googleApi is typeof google {
    return googleApi !== undefined
  }

  function initMap() {
    const googleApi = googleApiRef.value
    if (mapInstance.value || !isGoogleApiLoaded(googleApi)) return

    set(mapInstance, new googleApi.maps.Map(mapElementRef.value, DEFAULT_MAP_OPTIONS))
    set(geocoderInstance, new googleApi.maps.Geocoder())
  }

  function destroyMap() {
    const googleApi = googleApiRef.value
    if (!mapInstance.value || !isGoogleApiLoaded(googleApi)) return

    set(mapInstance, null)
  }

  function moveMapCenter(latLng: google.maps.LatLng) {
    const googleApi = googleApiRef.value
    if (!mapInstance.value || !isGoogleApiLoaded(googleApi)) return
    mapInstance.value.panTo(latLng)
  }

  loader
    .load()
    .then(google => set(googleApiRef, google))

  debouncedWatch(
    addressRef,
    async(address) => {
      if (address && geocoderInstance.value) {
        const { results } = await geocoderInstance.value.geocode({ address })
        if (results[0]) moveMapCenter(results[0].geometry.location)
      }
    },
    { debounce: 500 },
  )

  return {
    initMap,
    destroyMap,
    mapInstance,
  }
}
