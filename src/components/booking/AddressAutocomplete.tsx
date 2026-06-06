'use client';

import { useRef } from 'react';
import { StandaloneSearchBox } from '@react-google-maps/api';
import { useGoogleMapsLoader } from '@/lib/googleMaps';

interface AddressAutocompleteProps {
  label: string;
  value: string;
  placeholder?: string;
  error?: string;
  onChange: (value: string) => void;
  onSelect: (address: string, placeId: string) => void;
}

function LocationPinIcon() {
  return (
    <svg aria-hidden="true" className="h-[15px] w-[15px]" viewBox="0 0 16 16" fill="none">
      <path d="M8 14s4.5-4 4.5-7.5a4.5 4.5 0 1 0-9 0C3.5 10 8 14 8 14Z" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M8 8.1a1.6 1.6 0 1 0 0-3.2 1.6 1.6 0 0 0 0 3.2Z" stroke="currentColor" strokeWidth="1.4" />
    </svg>
  );
}

/**
 * Address autocomplete input with a Google Maps fallback.
 *
 * This component is responsible for the presentation of place lookup logic
 * and isolates the dependency on the Google Maps API from the rest of the form.
 * That makes testing and future replacement easier.
 */
export default function AddressAutocomplete({
  label,
  value,
  placeholder,
  error,
  onChange,
  onSelect
}: AddressAutocompleteProps) {
  const searchBoxRef = useRef<any>(null);
  const { isLoaded, loadError } = useGoogleMapsLoader();

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
        <span className="pointer-events-none absolute left-3 top-1/2 z-10 -translate-y-1/2 text-[#d3b44d]">
          <LocationPinIcon />
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
