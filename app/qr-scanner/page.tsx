/**
 * QR Scanner Page
 * 
 * This page demonstrates the QR code scanning functionality.
 * Users can scan QR codes using their device's camera.
 */

import MobileContainer from '@/components/MobileContainer';
import QRScanner from '@/components/QRScanner';

export default function QRScannerPage() {
  const handleScanSuccess = (decodedText: string) => {
    console.log('QR Code scanned:', decodedText);
    // You can add navigation or other logic here
    // For example: router.push(`/result?data=${decodedText}`);
  };

  const handleScanError = (error: string) => {
    console.error('Scan error:', error);
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

