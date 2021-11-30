import { ref, Ref } from 'vue'
import { debouncedWatch, set } from '@vueuse/core'
import { Loader } from '@googlemaps/js-api-loader'

const loader = new Loader({
  apiKey: import.meta.env.VITE_GOOGLE_API_KEY,
  version: 'weekly',
  libraries: ['places'],
})

const DEFAULT_MAP_OPTIONS: google.maps.MapOptions = {
  center: { lat: 47.629568, lng: -122.359954 },
  zoom: 12,

  mapTypeControl: false,
  fullscreenControl: false,
  streetViewControl: false,
}

export function useGoogleMaps(mapElementRef: Readonly<Ref<HTMLElement>>, addressRef: Ref<string>) {
  const googleApiRef = ref<typeof google>()
  const mapInstance = ref<google.maps.Map>()
  const mapMarkerInstance = ref<google.maps.Marker>()
  const hasErrorLoadingMap = ref(false)

  function isGoogleApiLoaded(googleApi: typeof google | undefined): googleApi is typeof google {
    return googleApi !== undefined
  }

  function createOrPlaceMarker(latLng: google.maps.LatLng) {
    const googleApi = googleApiRef.value
    if (!mapInstance.value || !isGoogleApiLoaded(googleApi)) return

    if (mapMarkerInstance.value)
      mapMarkerInstance.value.setPosition(latLng)

    else
      set(mapMarkerInstance, new googleApi.maps.Marker({ position: latLng, map: mapInstance.value }))
  }

  function initMap() {
    const googleApi = googleApiRef.value
    if (mapInstance.value || !isGoogleApiLoaded(googleApi)) return

    set(mapInstance, new googleApi.maps.Map(mapElementRef.value, DEFAULT_MAP_OPTIONS))
    mapInstance.value!.addListener('click', (click: google.maps.MapMouseEvent) => {
      if (click.latLng) createOrPlaceMarker(click.latLng)
    })
  }

  function destroyMap() {
    const googleApi = googleApiRef.value
    if (!mapInstance.value || !isGoogleApiLoaded(googleApi)) return

    set(mapInstance, null)
    set(mapMarkerInstance, null)
  }

  loader
    .load()
    .then(google => set(googleApiRef, google))
    .catch((e) => {
      // todo log this error
      set(hasErrorLoadingMap, true)
    })

  debouncedWatch(
    addressRef,
    () => {
      // move map center to new address
      // console.log(address)
      // if (!address) return
      // mapInstance.value?.setCenter
    },
    { debounce: 300 },
  )

  return {
    initMap,
    destroyMap,
    mapInstance,
    hasErrorLoadingMap,
  }
}
