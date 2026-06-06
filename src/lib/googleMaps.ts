import { useEffect, useRef, useState } from 'react';
import { useJsApiLoader } from '@react-google-maps/api';

const GOOGLE_LIBRARIES = ['places'] as const;
const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? '';

export function useGoogleMapsLoader() {
  return useJsApiLoader({
    id: 'google-maps-script',
    googleMapsApiKey: GOOGLE_MAPS_API_KEY,
    libraries: [...GOOGLE_LIBRARIES],
    version: 'weekly'
  });
}

export function useDistanceMatrix(originPlaceId?: string, destinationPlaceId?: string) {
  const { isLoaded, loadError } = useGoogleMapsLoader();
  const [distanceText, setDistanceText] = useState<string | null>(null);
  const [durationText, setDurationText] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const requestIdRef = useRef(0);

  useEffect(() => {
    if (!isLoaded || loadError || !originPlaceId || !destinationPlaceId) {
      setDistanceText(null);
      setDurationText(null);
      setError(loadError ? 'Unable to load Google Maps' : null);
      setLoading(false);
      return;
    }

    requestIdRef.current += 1;
    const requestId = requestIdRef.current;
    setLoading(true);
    setError(null);

    const service = new window.google.maps.DistanceMatrixService();
    service.getDistanceMatrix(
      {
        origins: [{ placeId: originPlaceId }],
        destinations: [{ placeId: destinationPlaceId }],
        travelMode: window.google.maps.TravelMode.DRIVING,
        unitSystem: window.google.maps.UnitSystem.METRIC
      },
      (response, status) => {
        if (requestIdRef.current !== requestId) return;
        setLoading(false);

        if (status === 'OK' && response?.rows?.[0]?.elements?.[0]) {
          const element = response.rows[0].elements[0];
          setDistanceText(element.distance?.text ?? null);
          setDurationText(element.duration?.text ?? null);
          setError(null);
          return;
        }

        setDistanceText(null);
        setDurationText(null);
        setError('Unable to calculate distance at this time.');
      }
    );
  }, [isLoaded, loadError, originPlaceId, destinationPlaceId]);

  return { distanceText, durationText, error, loading, isLoaded, loadError };
}
