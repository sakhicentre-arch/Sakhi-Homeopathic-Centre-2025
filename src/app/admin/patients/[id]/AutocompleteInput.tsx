'use client';

import { useState, useEffect } from 'react';

interface AutocompleteInputProps {
  label: string;
  value: string;
  onValueChange: (newValue: string) => void;
}

export default function AutocompleteInput({ label, value, onValueChange }: AutocompleteInputProps) {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (value.length < 2) {
      setSuggestions([]);
      setIsOpen(false);
      return;
    }
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/rubrics?query=${value}`);
        const data = await response.json();
        setSuggestions(data);
        setIsOpen(data.length > 0);
      } catch (error) {
        console.error('Failed to fetch suggestions:', error);
      }
    };
    const handler = setTimeout(() => { fetchData(); }, 300);
    return () => { clearTimeout(handler); };
  }, [value]);

  const handleSelect = (suggestion: string) => {
    onValueChange(suggestion);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <input
        type="text"
        value={value}
        onChange={(e) => onValueChange(e.target.value)}
        onFocus={() => { if (suggestions.length > 0) setIsOpen(true); }}
        onBlur={() => setTimeout(() => setIsOpen(false), 150)}
        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
        autoComplete="off"
      />
      {isOpen && (
        <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded-md shadow-lg mt-1 max-h-60 overflow-auto">
          {suggestions.map((suggestion, index) => (
            <li key={index} onMouseDown={() => handleSelect(suggestion)} className="px-4 py-2 cursor-pointer hover:bg-gray-100">
              {suggestion}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}