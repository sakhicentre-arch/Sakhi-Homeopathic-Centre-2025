'use client';

// Define the types for our data for type safety
type Patient = { id: number; name: string; mobile: string | null; };
type Visit = { id: number; date: string | Date; symptoms: string | null; prescription: PrescriptionItem[] };
type PrescriptionItem = { id: number; remedy: { name: string; }; potency: string | null; dose: string | null; };

// Types for parsed consultation data
interface ParsedConsultation {
  chiefComplaint?: string;
  observations?: Record<string, string>;
  mind?: { anxiety?: string; fears?: string; };
  generals?: Record<string, string>;
}

// Helper function to format dates consistently
function formatDate(dateString: string | Date | null | undefined): string {
  if (!dateString) return 'No date';
  return new Date(dateString).toLocaleDateString('en-IN', {
    day: '2-digit', month: 'long', year: 'numeric',
  });
}

// Helper function to parse symptoms JSON
function parseSymptoms(symptoms: string | null): ParsedConsultation | null {
  if (!symptoms) return null;
  try {
    return JSON.parse(symptoms) as ParsedConsultation;
  } catch {
    return null;
  }
}

// Helper function to capitalize and format field names
function formatFieldName(field: string): string {
  return field
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, (str) => str.toUpperCase())
    .trim();
}

export default function PatientDetailView({ patient, visits, onWritePrescription }: { 
  patient: Patient; 
  visits: Visit[]; 
  onWritePrescription: (visit: Visit) => void;
}) {
  return (
    <div className="space-y-8">
      {/* Patient Information Card */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold text-gray-900">{patient.name}</h1>
        {patient.mobile && (
          <p className="text-gray-600 mt-2">Mobile: {patient.mobile}</p>
        )}
      </div>

      {/* Visit History Section */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Visit History</h2>
        <div className="space-y-4">
          {visits.length > 0 ? (
            visits.map((visit) => {
              const parsedData = parseSymptoms(visit.symptoms);
              
              return (
                <div key={visit.id} className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-lg font-semibold text-indigo-600">
                      Visit on {formatDate(visit.date)}
                    </h3>
                    <button 
                      onClick={() => onWritePrescription(visit)} 
                      className="text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-md transition-colors"
                    >
                      Write/Edit Prescription
                    </button>
                  </div>

                  {/* Consultation Details */}
                  {parsedData ? (
                    <div className="space-y-4">
                      {/* Chief Complaint */}
                      {parsedData.chiefComplaint && (
                        <div>
                          <h4 className="text-sm font-semibold text-gray-800 mb-1">Chief Complaint:</h4>
                          <p className="text-sm text-gray-700 pl-3 border-l-2 border-indigo-300">
                            {parsedData.chiefComplaint}
                          </p>
                        </div>
                      )}

                      {/* Observations */}
                      {parsedData.observations && Object.keys(parsedData.observations).length > 0 && (
                        <div>
                          <h4 className="text-sm font-semibold text-gray-800 mb-2">Observations:</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 pl-3 border-l-2 border-green-300">
                            {Object.entries(parsedData.observations).map(([key, value]) => 
                              value ? (
                                <div key={key} className="text-sm">
                                  <span className="font-medium text-gray-700">{formatFieldName(key)}:</span>
                                  <span className="text-gray-600 ml-1">{value}</span>
                                </div>
                              ) : null
                            )}
                          </div>
                        </div>
                      )}

                      {/* Mind */}
                      {parsedData.mind && (parsedData.mind.anxiety || parsedData.mind.fears) && (
                        <div>
                          <h4 className="text-sm font-semibold text-gray-800 mb-2">Mind:</h4>
                          <div className="space-y-1 pl-3 border-l-2 border-purple-300">
                            {parsedData.mind.anxiety && (
                              <div className="text-sm">
                                <span className="font-medium text-gray-700">Anxiety:</span>
                                <span className="text-gray-600 ml-1">{parsedData.mind.anxiety}</span>
                              </div>
                            )}
                            {parsedData.mind.fears && (
                              <div className="text-sm">
                                <span className="font-medium text-gray-700">Fears:</span>
                                <span className="text-gray-600 ml-1">{parsedData.mind.fears}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Generals */}
                      {parsedData.generals && Object.keys(parsedData.generals).length > 0 && (
                        <div>
                          <h4 className="text-sm font-semibold text-gray-800 mb-2">Generals:</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 pl-3 border-l-2 border-amber-300">
                            {Object.entries(parsedData.generals).map(([key, value]) => 
                              value ? (
                                <div key={key} className="text-sm">
                                  <span className="font-medium text-gray-700">{formatFieldName(key)}:</span>
                                  <span className="text-gray-600 ml-1">{value}</span>
                                </div>
                              ) : null
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500">No consultation details recorded.</p>
                  )}

                  {/* Prescription */}
                  {visit.prescription && visit.prescription.length > 0 && (
                    <div className="mt-6 pt-4 border-t border-gray-200">
                      <h4 className="text-sm font-semibold text-gray-800 mb-2">Prescription:</h4>
                      <ul className="space-y-1 pl-3 border-l-2 border-blue-300">
                        {visit.prescription.map(item => (
                          <li key={item.id} className="text-sm text-gray-700">
                            <span className="font-medium">{item.remedy.name}</span>
                            {item.potency && <span className="text-gray-600"> {item.potency}</span>}
                            {item.dose && <span className="text-gray-600"> - {item.dose}</span>}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            <div className="bg-white rounded-lg shadow-md p-6 text-center text-sm text-gray-500">
              No visit history found.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}