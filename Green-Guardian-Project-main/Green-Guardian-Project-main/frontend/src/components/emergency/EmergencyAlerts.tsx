import React, { useState, useEffect } from 'react';

interface Alert {
  id: string;
  type: 'pollution' | 'flood' | 'fire' | 'storm' | 'heatwave' | 'other';
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  location: string;
  startTime: string;
  endTime?: string;
  isActive: boolean;
  affectedAreas: string[];
  safetyInstructions: string[];
  evacuationRoutes?: {
    name: string;
    description: string;
    mapUrl: string;
  }[];
  emergencyContacts: {
    name: string;
    phone: string;
    type: 'police' | 'fire' | 'medical' | 'disaster' | 'other';
  }[];
}

interface EmergencyAlertsProps {
  location?: {
    lat: number;
    lng: number;
    name: string;
  };
}

const EmergencyAlerts: React.FC<EmergencyAlertsProps> = ({ location }) => {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null);
  const [showContactDialog, setShowContactDialog] = useState<boolean>(false);
  const [selectedContact, setSelectedContact] = useState<{name: string, phone: string} | null>(null);

  useEffect(() => {
    if (location) {
      fetchAlerts(location);
    }
  }, [location]);

  const fetchAlerts = async (location: {lat: number, lng: number, name: string}) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // In a real implementation, you would fetch alerts from an API
      // For demo purposes, we'll simulate an API call with mock data
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Generate mock alerts based on location
      const mockAlerts: Alert[] = [
        {
          id: '1',
          type: 'pollution',
          severity: 'high',
          title: 'Severe Air Pollution Alert',
          description: 'Air quality index has reached hazardous levels due to industrial emissions and weather conditions. Vulnerable populations should take precautions.',
          location: location.name,
          startTime: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
          isActive: true,
          affectedAreas: ['Downtown', 'Industrial Zone', 'Eastern Suburbs'],
          safetyInstructions: [
            'Stay indoors with windows closed',
            'Use air purifiers if available',
            'Wear N95 masks if going outside is necessary',
            'Avoid outdoor exercise',
            'Keep hydrated'
          ],
          emergencyContacts: [
            {
              name: 'Environmental Protection Agency',
              phone: '1800-123-4567',
              type: 'other'
            },
            {
              name: 'Health Department Hotline',
              phone: '1800-765-4321',
              type: 'medical'
            },
            {
              name: 'Emergency Services',
              phone: '112',
              type: 'other'
            }
          ]
        },
        {
          id: '2',
          type: 'flood',
          severity: 'medium',
          title: 'Flash Flood Warning',
          description: 'Heavy rainfall may cause flash flooding in low-lying areas. Residents should be prepared for possible evacuation.',
          location: location.name,
          startTime: new Date(Date.now() - 7200000).toISOString(), // 2 hours ago
          endTime: new Date(Date.now() + 18000000).toISOString(), // 5 hours from now
          isActive: true,
          affectedAreas: ['Riverside', 'Valley Area', 'Downtown'],
          safetyInstructions: [
            'Move to higher ground',
            'Avoid walking or driving through flood waters',
            'Prepare emergency supplies',
            'Follow evacuation orders if issued',
            'Disconnect electrical appliances'
          ],
          evacuationRoutes: [
            {
              name: 'Northern Route',
              description: 'Exit via Highway 101 North to Highland Shelter',
              mapUrl: 'https://maps.google.com/?q=evacuation+center'
            },
            {
              name: 'Eastern Route',
              description: 'Take Main Street East to Community College Shelter',
              mapUrl: 'https://maps.google.com/?q=community+college+shelter'
            }
          ],
          emergencyContacts: [
            {
              name: 'Flood Control District',
              phone: '1800-555-7890',
              type: 'disaster'
            },
            {
              name: 'Emergency Services',
              phone: '112',
              type: 'other'
            },
            {
              name: 'Coast Guard',
              phone: '1800-999-0000',
              type: 'other'
            }
          ]
        },
        {
          id: '3',
          type: 'heatwave',
          severity: 'medium',
          title: 'Heat Advisory',
          description: 'Extreme temperatures expected over the next 3 days. Take precautions to prevent heat-related illnesses.',
          location: location.name,
          startTime: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
          endTime: new Date(Date.now() + 172800000).toISOString(), // 2 days from now
          isActive: true,
          affectedAreas: ['Entire City', 'Surrounding Counties'],
          safetyInstructions: [
            'Stay in air-conditioned areas',
            'Drink plenty of fluids',
            'Wear lightweight clothing',
            'Check on vulnerable neighbors',
            'Never leave children or pets in vehicles'
          ],
          emergencyContacts: [
            {
              name: 'Health Department',
              phone: '1800-222-3333',
              type: 'medical'
            },
            {
              name: 'Emergency Services',
              phone: '112',
              type: 'other'
            }
          ]
        }
      ];
      
      setAlerts(mockAlerts);
    } catch (err) {
      console.error('Error fetching alerts:', err);
      setError('Failed to fetch emergency alerts. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'low':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'high':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'critical':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'pollution':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
          </svg>
        );
      case 'flood':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
        );
      case 'fire':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z" />
          </svg>
        );
      case 'storm':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        );
      case 'heatwave':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
        );
      default:
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        );
    }
  };

  const getContactTypeIcon = (type: string) => {
    switch (type) {
      case 'police':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
        );
      case 'fire':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
          </svg>
        );
      case 'medical':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        );
      case 'disaster':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      default:
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
          </svg>
        );
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  const handleContactClick = (name: string, phone: string) => {
    setSelectedContact({ name, phone });
    setShowContactDialog(true);
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="bg-red-600 text-white p-4">
        <h2 className="text-xl font-medium">Emergency Alerts</h2>
        <p className="text-sm opacity-90">
          {location ? `Current alerts for ${location.name}` : 'Select a location to view alerts'}
        </p>
      </div>
      
      <div className="p-4">
        {!location ? (
          <div className="text-center py-8">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <p className="text-gray-600">Select a location to view emergency alerts</p>
          </div>
        ) : isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading emergency alerts...</p>
          </div>
        ) : error ? (
          <div className="bg-red-50 p-4 rounded-lg text-red-700">
            <p>{error}</p>
          </div>
        ) : alerts.length === 0 ? (
          <div className="text-center py-8 bg-green-50 rounded-lg">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-green-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-green-700 font-medium">No active alerts for this area</p>
            <p className="text-sm text-gray-600 mt-2">The area is currently safe from environmental emergencies</p>
          </div>
        ) : (
          <div>
            {selectedAlert ? (
              <div>
                <button
                  className="flex items-center text-blue-600 mb-4 hover:text-blue-800"
                  onClick={() => setSelectedAlert(null)}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                  </svg>
                  Back to all alerts
                </button>
                
                <div className={`p-4 rounded-lg border ${getSeverityColor(selectedAlert.severity)}`}>
                  <div className="flex items-center mb-2">
                    <div className="mr-2">
                      {getTypeIcon(selectedAlert.type)}
                    </div>
                    <h3 className="text-lg font-medium">{selectedAlert.title}</h3>
                  </div>
                  
                  <div className="mb-4">
                    <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getSeverityColor(selectedAlert.severity)}`}>
                      {selectedAlert.severity.toUpperCase()} SEVERITY
                    </span>
                  </div>
                  
                  <p className="text-gray-700 mb-4">{selectedAlert.description}</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-1">Affected Areas</h4>
                      <ul className="list-disc pl-5 text-sm">
                        {selectedAlert.affectedAreas.map((area, index) => (
                          <li key={index}>{area}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-1">Alert Timeline</h4>
                      <p className="text-sm">
                        <span className="font-medium">Started:</span> {formatDate(selectedAlert.startTime)}
                      </p>
                      {selectedAlert.endTime && (
                        <p className="text-sm">
                          <span className="font-medium">Expected End:</span> {formatDate(selectedAlert.endTime)}
                        </p>
                      )}
                    </div>
                  </div>
                  
                  <div className="mb-6">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Safety Instructions</h4>
                    <ul className="bg-white rounded-lg border border-gray-200 p-3 space-y-1">
                      {selectedAlert.safetyInstructions.map((instruction, index) => (
                        <li key={index} className="flex items-start">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600 mr-2 flex-shrink-0 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          <span>{instruction}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  {selectedAlert.evacuationRoutes && (
                    <div className="mb-6">
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Evacuation Routes</h4>
                      <div className="space-y-3">
                        {selectedAlert.evacuationRoutes.map((route, index) => (
                          <div key={index} className="bg-white rounded-lg border border-gray-200 p-3">
                            <h5 className="font-medium">{route.name}</h5>
                            <p className="text-sm text-gray-600 mb-2">{route.description}</p>
                            <a 
                              href={route.mapUrl} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-blue-600 text-sm flex items-center hover:text-blue-800"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                              </svg>
                              View on Map
                            </a>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Emergency Contacts</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {selectedAlert.emergencyContacts.map((contact, index) => (
                        <div key={index} className="bg-white rounded-lg border border-gray-200 p-3 flex justify-between items-center">
                          <div className="flex items-center">
                            <div className="mr-2 text-gray-600">
                              {getContactTypeIcon(contact.type)}
                            </div>
                            <div>
                              <div className="font-medium">{contact.name}</div>
                              <div className="text-sm text-gray-600">{contact.phone}</div>
                            </div>
                          </div>
                          <button
                            className="bg-green-600 text-white p-2 rounded-full hover:bg-green-700"
                            onClick={() => handleContactClick(contact.name, contact.phone)}
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                            </svg>
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {alerts.map(alert => (
                  <div 
                    key={alert.id} 
                    className={`p-4 rounded-lg border cursor-pointer hover:shadow-md transition-shadow ${getSeverityColor(alert.severity)}`}
                    onClick={() => setSelectedAlert(alert)}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex items-center">
                        <div className="mr-3">
                          {getTypeIcon(alert.type)}
                        </div>
                        <div>
                          <h3 className="font-medium">{alert.title}</h3>
                          <p className="text-sm">{alert.description.substring(0, 100)}...</p>
                        </div>
                      </div>
                      <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getSeverityColor(alert.severity)}`}>
                        {alert.severity.toUpperCase()}
                      </span>
                    </div>
                    <div className="mt-2 flex justify-between items-center">
                      <div className="text-xs text-gray-600">
                        Started: {formatDate(alert.startTime)}
                      </div>
                      <button
                        className="text-blue-600 text-sm hover:text-blue-800"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedAlert(alert);
                        }}
                      >
                        View Details →
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
      
      {/* Emergency Contact Dialog */}
      {showContactDialog && selectedContact && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm mx-4">
            <h3 className="text-lg font-medium mb-4">Contact {selectedContact.name}</h3>
            <p className="mb-6">
              You are about to call the emergency number: <br />
              <span className="font-bold text-lg">{selectedContact.phone}</span>
            </p>
            <div className="flex justify-between">
              <button
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                onClick={() => setShowContactDialog(false)}
              >
                Cancel
              </button>
              <a
                href={`tel:${selectedContact.phone}`}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                onClick={() => setShowContactDialog(false)}
              >
                Call Now
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmergencyAlerts;
