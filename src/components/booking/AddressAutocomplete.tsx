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
    <div>
      <div className="relative">
        <label className="absolute -top-2 left-3 z-10 bg-white px-1 text-[11px] leading-4 text-[#74758a]">{label}</label>
        <span className="pointer-events-none absolute left-3 top-1/2 z-10 h-[15px] w-[12px] -translate-y-1/2 text-[#d3b44d]">
          <span className="absolute left-[2px] top-0 h-[9px] w-[8px] rounded-full border-2 border-current" />
          <span className="absolute bottom-0 left-[4px] h-[7px] w-[4px] rotate-45 bg-current" />
          <span className="absolute left-[5px] top-[3px] h-[2px] w-[2px] rounded-full bg-current" />
        </span>
        {isLoaded && !loadError ? (
          <StandaloneSearchBox onLoad={handleLoad} onPlacesChanged={handlePlacesChanged}>
            <input
              type="text"
              value={value}
              onChange={(event) => onChange(event.target.value)}
              placeholder={placeholder}
              className={`h-[38px] w-full rounded-[4px] border bg-white py-2 pl-8 pr-8 text-[14px] text-[#272a42] outline-none transition placeholder:text-[#aeb0b8] focus:border-[#d3b44d] focus:ring-1 focus:ring-[#d3b44d]/30 ${error ? 'border-red-300' : 'border-[#cfd1d8]'}`}
            />
          </StandaloneSearchBox>
        ) : (
          <input
            type="text"
            value={value}
            onChange={(event) => onChange(event.target.value)}
            placeholder={placeholder}
            className={`h-[38px] w-full rounded-[4px] border bg-white py-2 pl-8 pr-8 text-[14px] text-[#272a42] outline-none transition placeholder:text-[#aeb0b8] focus:border-[#d3b44d] focus:ring-1 focus:ring-[#d3b44d]/30 ${error ? 'border-red-300' : 'border-[#cfd1d8]'}`}
          />
        )}
        <span className="pointer-events-none absolute right-3 top-1/2 z-10 -translate-y-1/2 text-[12px] text-[#7c7d82]">v</span>
      </div>
      {error ? <p className="text-xs text-red-600">{error}</p> : null}
    </div>
  );
}
