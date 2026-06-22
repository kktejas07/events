"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { Html5Qrcode, Html5QrcodeScannerState, Html5QrcodeSupportedFormats } from "html5-qrcode";
import { Camera, CameraOff, Zap, ZapOff, RefreshCw, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const BARCODE_FORMATS: Html5QrcodeSupportedFormats[] = [
  Html5QrcodeSupportedFormats.QR_CODE,
  Html5QrcodeSupportedFormats.CODE_128,
  Html5QrcodeSupportedFormats.CODE_39,
  Html5QrcodeSupportedFormats.EAN_13,
  Html5QrcodeSupportedFormats.EAN_8,
  Html5QrcodeSupportedFormats.UPC_A,
  Html5QrcodeSupportedFormats.UPC_E,
  Html5QrcodeSupportedFormats.ITF,
  Html5QrcodeSupportedFormats.CODABAR,
];

interface ScanResult {
  barcode: string;
  format: string;
}

interface Props {
  onScan: (barcode: string) => Promise<boolean>;
  onClose?: () => void;
}

export default function CameraScanner({ onScan, onClose }: Props) {
  const videoContainerRef = useRef<HTMLDivElement>(null);
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const [scanning, setScanning] = useState(false);
  const [torchOn, setTorchOn] = useState(false);
  const [lastResult, setLastResult] = useState<ScanResult | null>(null);
  const [verifying, setVerifying] = useState(false);
  const [verifyResult, setVerifyResult] = useState<boolean | null>(null);
  const [error, setError] = useState<string | null>(null);

  const startScanner = useCallback(async () => {
    if (!videoContainerRef.current) return;

    try {
      const scanner = new Html5Qrcode("scanner-viewport", {
        formatsToSupport: BARCODE_FORMATS,
        verbose: false,
      });
      scannerRef.current = scanner;

      const cameras = await Html5Qrcode.getCameras();
      if (!cameras.length) {
        setError("No camera detected on this device");
        return;
      }

      const rearCamera = cameras.find((c) =>
        c.label.toLowerCase().includes("back") || c.label.toLowerCase().includes("environment")
      );
      const cameraId = rearCamera?.id || cameras[0].id;

      await scanner.start(
        cameraId,
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
          aspectRatio: 1,
        },
        async (decodedText, decodedResult) => {
          if (verifying) return;
          const barcode = decodedText.replace(/\s/g, "");
          const formatName = decodedResult?.result?.format?.formatName || "unknown";
          setLastResult({ barcode, format: formatName });
          setVerifying(true);
          setVerifyResult(null);

          try {
            const ok = await onScan(barcode);
            setVerifyResult(ok);
            if (ok) {
              await scanner.pause(true);
              setTimeout(() => {
                if (scannerRef.current?.getState() === Html5QrcodeScannerState.PAUSED) {
                  scanner.resume();
                }
              }, 2000);
            }
          } catch {
            setVerifyResult(false);
          }
          setVerifying(false);
        },
        () => {}
      );

      setScanning(true);
      setError(null);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Camera access failed";
      if (msg.includes("NotAllowed") || msg.includes("Permission")) {
        setError("Camera permission denied. Grant camera access in your browser settings.");
      } else {
        setError(msg);
      }
    }
  }, [onScan, verifying]);

  const stopScanner = useCallback(async () => {
    if (scannerRef.current) {
      try {
        await scannerRef.current.stop();
      } catch {}
      scannerRef.current = null;
    }
    setScanning(false);
    setTorchOn(false);
    setLastResult(null);
    setVerifyResult(null);
  }, []);

  const toggleTorch = useCallback(async () => {
    if (!scannerRef.current) return;
    try {
      await scannerRef.current.applyVideoConstraints({
        advanced: [{ torch: !torchOn } as MediaTrackConstraintSet],
      } as MediaTrackConstraints);
      setTorchOn(!torchOn);
    } catch {
      // torch not supported on this device
    }
  }, [torchOn]);

  useEffect(() => {
    return () => {
      if (scannerRef.current) {
        scannerRef.current.stop().catch(() => {});
      }
    };
  }, []);

  return (
    <div className="flex flex-col items-center gap-4">
      {error && (
        <div className="w-full rounded-lg border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-300">
          <div className="flex items-center justify-between">
            <span>{error}</span>
            <button onClick={() => setError(null)} className="text-red-400 hover:text-red-300">
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      <div
        ref={videoContainerRef}
        className="relative w-full overflow-hidden rounded-lg border border-white/10 bg-black"
      >
        <div id="scanner-viewport" className="w-full" style={{ minHeight: 300 }} />

        {scanning && (
          <>
            <div className="pointer-events-none absolute inset-0">
              <div className="absolute inset-0 border-2 border-purple-500/50" />
              <div className="absolute inset-4 border border-purple-400/20" />
              <div className="scan-line absolute left-4 right-4 top-1/2 h-0.5 animate-pulse bg-gradient-to-r from-transparent via-purple-400 to-transparent" />
            </div>

            {lastResult && verifyResult !== null && (
              <div
                className={`absolute inset-x-0 bottom-0 p-3 text-center text-sm font-medium ${
                  verifyResult
                    ? "bg-green-500/90 text-white"
                    : "bg-red-500/90 text-white"
                }`}
              >
                {verifyResult
                  ? `Scanned — Valid`
                  : `Invalid ticket`}
              </div>
            )}

            {verifying && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                <RefreshCw className="h-8 w-8 animate-spin text-white" />
              </div>
            )}
          </>
        )}

        {!scanning && !error && (
          <div className="flex flex-col items-center justify-center gap-3 py-12">
            <Camera className="h-12 w-12 text-gray-600" />
            <p className="text-sm text-gray-500">
              Tap &quot;Start Scanner&quot; to begin
            </p>
          </div>
        )}
      </div>

      <div className="flex gap-2">
        {!scanning ? (
          <Button
            onClick={startScanner}
            className="gap-2 bg-gradient-to-r from-purple-600 to-cyan-600 text-white"
          >
            <Camera className="h-4 w-4" />
            Start Scanner
          </Button>
        ) : (
          <>
            <Button
              onClick={stopScanner}
              variant="outline"
              className="gap-2 border-white/10 bg-white/[0.03] text-white hover:bg-white/10"
            >
              <CameraOff className="h-4 w-4" />
              Stop Scanner
            </Button>
            <Button
              onClick={toggleTorch}
              variant="outline"
              className="gap-2 border-white/10 bg-white/[0.03] text-white hover:bg-white/10"
            >
              {torchOn ? (
                <Zap className="h-4 w-4 text-yellow-400" />
              ) : (
                <ZapOff className="h-4 w-4" />
              )}
              Flash
            </Button>
          </>
        )}
        {onClose && (
          <Button
            onClick={onClose}
            variant="outline"
            className="gap-2 border-white/10 bg-white/[0.03] text-white hover:bg-white/10"
          >
            <X className="h-4 w-4" />
            Close
          </Button>
        )}
      </div>

      {lastResult && (
        <div className="text-center text-sm text-gray-400">
          Last scanned: <span className="font-mono text-purple-400">{lastResult.barcode}</span>
          <span className="ml-2 text-gray-600">({lastResult.format})</span>
        </div>
      )}
    </div>
  );
}
