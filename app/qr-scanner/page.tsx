'use client';

/**
 * QR Scanner Page
 * 
 * This page demonstrates the QR code scanning functionality.
 * Users can scan QR codes using their device's camera.
 */

import { useState } from 'react';
import MobileContainer from '@/components/MobileContainer';
import QRScanner from '@/components/QRScanner';

export default function QRScannerPage() {
  const [scanResult, setScanResult] = useState<string | null>(null);
  const [scanError, setScanError] = useState<string | null>(null);

  const handleScanSuccess = (decodedText: string) => {
    console.log('QR Code scanned:', decodedText);
    setScanResult(decodedText);
    setScanError(null);
    // You can add navigation or other logic here
    // For example: router.push(`/result?data=${decodedText}`);
  };

  const handleScanError = (error: string) => {
    console.error('Scan error:', error);
    setScanError(error);
    setScanResult(null);
  };

  return (
    <MobileContainer>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6 text-center">
          QR Code Scanner
        </h1>
        
        <QRScanner 
          onScanSuccess={handleScanSuccess}
          onScanError={handleScanError}
        />
        
        {scanResult && (
          <div className="mt-4 p-4 bg-green-100 rounded-lg">
            <p className="font-semibold">Scanned:</p>
            <p>{scanResult}</p>
          </div>
        )}
        
        {scanError && (
          <div className="mt-4 p-4 bg-red-100 rounded-lg">
            <p className="font-semibold">Error:</p>
            <p>{scanError}</p>
          </div>
        )}
        
        <div className="mt-6 text-center">
          <a 
            href="/" 
            className="text-blue-600 hover:underline"
          >
            ← Back to Home
          </a>
        </div>
      </div>
    </MobileContainer>
  );
}

