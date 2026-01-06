/**
 * QRScanner Component
 * 
 * This component uses html5-qrcode library to scan QR codes
 * using the device's camera. It works on both mobile and desktop browsers.
 * 
 * Features:
 * - Camera access for QR code scanning
 * - Start/Stop scanning controls
 * - Displays scanned QR code result
 * - Error handling for camera permissions
 */

'use client';

import { useEffect, useRef, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { Camera, CameraOff, CheckCircle2, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface QRScannerProps {
  onScanSuccess?: (decodedText: string) => void;
  onScanError?: (error: string) => void;
}

export default function QRScanner({ 
  onScanSuccess, 
  onScanError 
}: QRScannerProps) {
  const [isScanning, setIsScanning] = useState(false);
  const [scannedResult, setScannedResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Track scanning state with ref to avoid dependency issues
  const isScanningRef = useRef(false);

  // Initialize scanner
  useEffect(() => {
    if (containerRef.current && !scannerRef.current) {
      scannerRef.current = new Html5Qrcode(containerRef.current.id);
    }

    return () => {
      // Cleanup: stop scanning when component unmounts
      if (scannerRef.current && isScanningRef.current) {
        scannerRef.current
          .stop()
          .catch((err) => console.error('Error stopping scanner:', err));
      }
    };
  }, []);

  // Start scanning function
  const startScanning = async () => {
    if (!scannerRef.current) return;

    try {
      setError(null);
      
      // Start the camera and QR code scanning
      await scannerRef.current.start(
        { facingMode: 'environment' }, // Use back camera on mobile
        {
          fps: 10, // Frames per second
          qrbox: { width: 250, height: 250 }, // Scanning area size
        },
        (decodedText) => {
          // Success callback - QR code scanned
          setScannedResult(decodedText);
          setIsScanning(false);
          
          // Stop scanning after successful scan
          scannerRef.current?.stop().catch(console.error);
          
          // Call the success callback if provided
          if (onScanSuccess) {
            onScanSuccess(decodedText);
          }
        },
        () => {
          // Error callback - ignore common scanning errors
          // (these happen frequently while scanning)
          // Parameter is required by html5-qrcode API but intentionally unused
        }
      );
      
      setIsScanning(true);
      isScanningRef.current = true;
    } catch (err: unknown) {
      // Handle camera permission errors
      const errorMessage = err instanceof Error 
        ? err.message 
        : 'Unable to access camera. Please check permissions.';
      
      setError(errorMessage);
      setIsScanning(false);
      isScanningRef.current = false;
      
      if (onScanError) {
        onScanError(errorMessage);
      }
    }
  };

  // Stop scanning function
  const stopScanning = async () => {
    if (!scannerRef.current) return;

    try {
      await scannerRef.current.stop();
      setIsScanning(false);
      isScanningRef.current = false;
      setError(null);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error 
        ? err.message 
        : 'Error stopping scanner';
      console.error('Error stopping scanner:', err);
      setError(errorMessage);
    }
  };

  return (
    <div className="w-full p-4">
      {/* Scanner container */}
      <div 
        id="qr-reader" 
        ref={containerRef}
        className="w-full rounded-lg overflow-hidden bg-gray-900 mb-4"
        style={{ minHeight: '300px' }}
      />

      {/* Control buttons */}
      <div className="flex gap-4 mb-4">
        {!isScanning ? (
          <motion.button
            onClick={startScanning}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
          >
            <Camera size={20} />
            Start Scanning
          </motion.button>
        ) : (
          <motion.button
            onClick={stopScanning}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex-1 bg-red-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
          >
            <CameraOff size={20} />
            Stop Scanning
          </motion.button>
        )}
      </div>

      {/* Error message */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4 flex items-start gap-2"
          >
            <AlertCircle size={20} className="mt-0.5 shrink-0" />
            <div>
              <p className="font-medium">Error:</p>
              <p className="text-sm">{error}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Scanned result */}
      <AnimatePresence>
        {scannedResult && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg flex items-start gap-2"
          >
            <CheckCircle2 size={20} className="mt-0.5 shrink-0" />
            <div className="flex-1">
              <p className="font-medium mb-2">Scanned QR Code:</p>
              <p className="text-sm break-all">{scannedResult}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

