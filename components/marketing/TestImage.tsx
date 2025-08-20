'use client';

import { useState } from 'react';

export default function TestImage() {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  
  const testImage = "/images/edificio/original_79516B40-7BA9-4F4E-4F7D-7BA4C0A2A938-mg0578.jpg";
  
  return (
    <div className="p-8 bg-white dark:bg-gray-900 rounded-lg shadow-lg">
      <h2 className="text-xl font-bold mb-4">Test de Imagen</h2>
      
      <div className="space-y-4">
        <div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
            Ruta: {testImage}
          </p>
          
          <div className="relative w-64 h-48 bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden">
            <img
              src={testImage}
              alt="Test de imagen del edificio"
              className="w-full h-full object-cover"
              onLoad={() => setImageLoaded(true)}
              onError={() => setImageError(true)}
            />
            
            {imageLoaded && (
              <div className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded text-xs">
                ✅ Cargada
              </div>
            )}
            
            {imageError && (
              <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded text-xs">
                ❌ Error
              </div>
            )}
          </div>
        </div>
        
        <div className="text-sm">
          <p>Estado: {imageLoaded ? 'Cargada correctamente' : imageError ? 'Error al cargar' : 'Cargando...'}</p>
        </div>
      </div>
    </div>
  );
}
