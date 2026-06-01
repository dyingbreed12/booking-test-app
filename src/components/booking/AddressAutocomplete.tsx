'use client';

import { useRef } from 'react';
import { StandaloneSearchBox, useJsApiLoader } from '@react-google-maps/api';

interface AddressAutocompleteProps {
  label: string;
  value: string;
  placeholder?: string;
  error?: string;
  onChange: (value: string) => void;
  onSelect: (address: string, placeId: string) => void;
}

export default function AddressAutocomplete({
  label,
  value,
  placeholder,
  error,
  onChange,
  onSelect
}: AddressAutocompleteProps) {
  const searchBoxRef = useRef<any>(null);
  const { isLoaded, loadError } = useJsApiLoader({
    id: 'google-maps-script',
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
    libraries: ['places'],
    version: 'weekly'
  });

  const handleLoad = (ref: any) => {
    searchBoxRef.current = ref;
  };

  const handlePlacesChanged = () => {
    const places = searchBoxRef.current?.getPlaces();
    const place = places?.[0];
    if (place) {
      onSelect(place.formatted_address || place.name || '', place.place_id || '');
    }
  };

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-slate-800">{label}</label>
      <div className="relative">
        {isLoaded && !loadError ? (
          <StandaloneSearchBox onLoad={handleLoad} onPlacesChanged={handlePlacesChanged}>
            <input
              type="text"
              value={value}
              onChange={(event) => onChange(event.target.value)}
              placeholder={placeholder}
              className={`w-full rounded-2xl border px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/20 ${error ? 'border-red-300' : 'border-slate-200'}`}
            />
          </StandaloneSearchBox>
        ) : (
          <input
            type="text"
            value={value}
            onChange={(event) => onChange(event.target.value)}
            placeholder={placeholder}
            className={`w-full rounded-2xl border px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/20 ${error ? 'border-red-300' : 'border-slate-200'}`}
          />
        )}
      </div>
      {error ? <p className="text-xs text-red-600">{error}</p> : null}
    </div>
  );
}
