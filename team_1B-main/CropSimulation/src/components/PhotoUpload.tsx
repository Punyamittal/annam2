import React, { useState, useRef } from 'react';
import { Camera, Upload, X, Calendar } from 'lucide-react';

interface Photo {
  id: string;
  url: string;
  date: string;
  stage: string;
  notes: string;
}

interface PhotoUploadProps {
  currentDay: number;
  currentStage: { code: string; stage: any } | null;
}

const PhotoUpload: React.FC<PhotoUploadProps> = ({ currentDay, currentStage }) => {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [notes, setNotes] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const newPhoto: Photo = {
          id: Date.now().toString(),
          url: e.target?.result as string,
          date: new Date().toLocaleDateString(),
          stage: currentStage ? `BBCH ${currentStage.code}` : 'Unknown',
          notes: notes || 'No notes added'
        };
        setPhotos(prev => [newPhoto, ...prev]);
        setNotes('');
      };
      reader.readAsDataURL(file);
    }
  };

  const removePhoto = (photoId: string) => {
    setPhotos(prev => prev.filter(photo => photo.id !== photoId));
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h2 className="text-xl font-bold text-gray-800 mb-6">Photo Documentation</h2>
      
      {/* Upload Section */}
      <div className="mb-6">
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-green-400 transition-colors">
          <Camera className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 mb-4">Document your crop's progress</p>
          
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            className="hidden"
          />
          
          <button
            onClick={triggerFileInput}
            className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2 mx-auto"
          >
            <Upload className="w-4 h-4" />
            <span>Upload Photo</span>
          </button>
        </div>
        
        {/* Notes Input */}
        <div className="mt-4">
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Add notes about this photo..."
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
            rows={2}
          />
        </div>
      </div>

      {/* Photo Gallery */}
      <div className="space-y-4">
        {photos.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Camera className="w-12 h-12 mx-auto mb-2 text-gray-400" />
            <p>No photos uploaded yet</p>
            <p className="text-sm">Start documenting your crop's growth!</p>
          </div>
        ) : (
          photos.map((photo) => (
            <div key={photo.id} className="bg-gray-50 rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex items-start space-x-4">
                <img
                  src={photo.url}
                  alt="Crop documentation"
                  className="w-20 h-20 object-cover rounded-lg flex-shrink-0"
                />
                
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-600">{photo.date}</span>
                      <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs font-medium">
                        {photo.stage}
                      </span>
                    </div>
                    <button
                      onClick={() => removePhoto(photo.id)}
                      className="text-red-500 hover:text-red-700 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <p className="text-sm text-gray-700">{photo.notes}</p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Statistics */}
      {photos.length > 0 && (
        <div className="mt-6 pt-4 border-t border-gray-200">
          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <div className="text-lg font-bold text-green-600">{photos.length}</div>
              <div className="text-xs text-gray-600">Photos Taken</div>
            </div>
            <div>
              <div className="text-lg font-bold text-blue-600">Day {currentDay}</div>
              <div className="text-xs text-gray-600">Current Day</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PhotoUpload;