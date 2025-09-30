'use client';

import { useReducer, useState, FormEvent } from 'react';
import AutocompleteInput from './AutocompleteInput';

// --- STATE LOGIC ---
interface CaseState {
  chiefComplaint: string;
  observations: { [key: string]: string };
  mind: { anxiety: string; fears: string; };
  generals: { [key: string]: string };
}

const initialState: CaseState = {
  chiefComplaint: '',
  observations: {
    entry: '', punctuality: '', sittingPosture: '', behaviorConduct: '',
    senses: '', communication: '', movement: '', gestures: '',
    faceType: '', hair: '', constitution: '',
  },
  mind: { anxiety: '', fears: '' },
  generals: {
    appetite: '', thirst: '', thermal: 'Ambithermal', desire: '',
    aversion: '', sleep: '', dream: '',
  },
};

type FormAction = { field: string; value: string };

// --- FIX: Robust Reducer to Prevent State Corruption ---
function formReducer(state: CaseState, action: FormAction): CaseState {
  const { field, value } = action;
  
  // Handle nested fields like "mind.anxiety"
  if (field.includes('.')) {
    const [section, subField] = field.split('.') as [keyof CaseState, string];
    const sectionState = state[section];

    // Ensure the section exists and is an object before updating
    if (section in state && typeof sectionState === 'object' && sectionState !== null) {
      return {
        ...state,
        [section]: {
          ...(sectionState as object),
          [subField]: value,
        },
      };
    }
    // If the field is malformed (e.g., "invalid.field"), ignore the update to prevent corruption
    return state;
  }

  // Handle top-level fields like "chiefComplaint"
  if (field in state) {
    return { ...state, [field]: value };
  }

  // Ignore unknown fields
  return state;
}
// --- END OF STATE LOGIC ---

// Dropdown options
const thermalOptions = ['Chilly', 'Hot', 'Ambithermal'];
const thirstOptions = ['Thirsty', 'Thirstless', 'Thirsty for large quantities', 'Thirsty for small sips'];

// Fully defined TabButton component
const TabButton = ({ title, activeTab, setActiveTab }: { title: string; activeTab: string; setActiveTab: (title: string) => void; }) => (
  <button
    type="button"
    onClick={() => setActiveTab(title)}
    className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
      activeTab === title
        ? 'bg-indigo-600 text-white shadow'
        : 'text-gray-600 bg-gray-100 hover:bg-gray-200'
    }`}
  >
    {title}
  </button>
);

// --- PROPS UPDATED ---
export default function ConsultationForm({ patientId, onSaveSuccess, onCancel }: { patientId: string; onSaveSuccess: () => void; onCancel: () => void; }) {
  const [state, dispatch] = useReducer(formReducer, initialState);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [activeTab, setActiveTab] = useState('Observations');

  const handleChange = (field: string, value: string) => {
    dispatch({ field, value });
  };
  
  const handleTextAreaChange = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLSelectElement>) => {
    dispatch({ field: e.target.name, value: e.target.value });
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setIsLoading(true);
    setMessage('');
    try {
      // Combine all consultation data
      const consultationData = {
        patientId: Number(patientId),
        clinicId: 1, // Default clinic ID from seed data
        symptoms: JSON.stringify({
          chiefComplaint: state.chiefComplaint,
          observations: state.observations,
          mind: state.mind,
          generals: state.generals,
        }),
        diagnosis: '', // Can be filled later
        fee: 0, // Can be updated later
      };

      const response = await fetch('/api/consultations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(consultationData),
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Failed to save consultation');
      }
      
      setMessage('Consultation saved successfully!');
      
      // Call the parent's function to refresh data and close modal
      onSaveSuccess();

    } catch (error: any) {
      console.error('Consultation save error:', error);
      setMessage(`Error: ${error.message || 'Could not save consultation'}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mt-6">
      <h2 className="text-2xl font-bold mb-6">New Consultation</h2>
      <form className="space-y-6" onSubmit={handleSubmit}>
        {/* Chief Complaint - Always visible at top */}
        <div>
          <label htmlFor="chiefComplaint" className="block text-sm font-medium text-gray-700">Chief Complaint</label>
          <textarea 
            id="chiefComplaint" 
            name="chiefComplaint" 
            value={state.chiefComplaint} 
            onChange={handleTextAreaChange} 
            rows={3} 
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Describe the main complaint..."
          />
        </div>

        <div className="flex space-x-2 border-b border-gray-200 pb-4">
          <TabButton title="Observations" activeTab={activeTab} setActiveTab={setActiveTab} />
          <TabButton title="Generals" activeTab={activeTab} setActiveTab={setActiveTab} />
          <TabButton title="Mind" activeTab={activeTab} setActiveTab={setActiveTab} />
        </div>

        <div className="pt-4 min-h-[400px]">
          {activeTab === 'Observations' && (
            <fieldset className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-fadeIn">
              {Object.keys(initialState.observations).map(key => (
                 <div key={key}>
                  <label htmlFor={`observations.${key}`} className="block text-sm font-medium text-gray-700 capitalize">{key.replace(/([A-Z])/g, ' $1')}</label>
                  <textarea id={`observations.${key}`} name={`observations.${key}`} value={state.observations[key as keyof typeof state.observations]} onChange={handleTextAreaChange} rows={2} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm" />
                </div>
              ))}
            </fieldset>
          )}

          {activeTab === 'Generals' && (
             <fieldset className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-fadeIn">
                <div>
                  <label htmlFor="generals.thermal" className="block text-sm font-medium text-gray-700">Thermal Preference</label>
                  <select id="generals.thermal" name="generals.thermal" value={state.generals.thermal} onChange={handleTextAreaChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm">
                    {thermalOptions.map(option => <option key={option} value={option}>{option}</option>)}
                  </select>
                </div>
                <div>
                  <label htmlFor="generals.thirst" className="block text-sm font-medium text-gray-700">Thirst</label>
                  <select id="generals.thirst" name="generals.thirst" value={state.generals.thirst} onChange={handleTextAreaChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm">
                    <option value="">Select...</option>
                    {thirstOptions.map(option => <option key={option} value={option}>{option}</option>)}
                  </select>
                </div>
                {['appetite', 'desire', 'aversion', 'sleep', 'dream'].map(key => (
                  <div key={key}>
                    <label htmlFor={`generals.${key}`} className="block text-sm font-medium text-gray-700 capitalize">{key}</label>
                    <textarea id={`generals.${key}`} name={`generals.${key}`} value={state.generals[key as keyof typeof state.generals]} onChange={handleTextAreaChange} rows={2} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"/>
                  </div>
                ))}
            </fieldset>
          )}

          {activeTab === 'Mind' && (
            <fieldset className="space-y-4 animate-fadeIn">
              <AutocompleteInput
                label="Anxiety"
                value={state.mind.anxiety}
                onValueChange={(newValue) => handleChange('mind.anxiety', newValue)}
              />
              <AutocompleteInput
                label="Fears"
                value={state.mind.fears}
                onValueChange={(newValue) => handleChange('mind.fears', newValue)}
              />
            </fieldset>
          )}
        </div>
        
        <div className="flex justify-end items-center gap-4 pt-4">
          <button type="button" onClick={onCancel} className="py-2 px-4 rounded-md text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200">
            Cancel
          </button>
          <button type="submit" disabled={isLoading} className="py-2 px-4 rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300">
            {isLoading ? 'Saving...' : 'Save Consultation'}
          </button>
        </div>

        {message && <p className={`text-sm mt-2 text-center ${message.startsWith('Error') ? 'text-red-600' : 'text-green-600'}`}>{message}</p>}
      </form>
    </div>
  );
}