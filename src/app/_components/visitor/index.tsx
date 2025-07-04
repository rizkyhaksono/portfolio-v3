'use client';

import { useEffect, useState } from 'react';
import { FiMonitor, FiSmartphone, FiTablet, FiGlobe, FiClock, FiEye } from 'react-icons/fi';

interface VisitorInfo {
  ip: string;
  userAgent: string;
  browser: string;
  os: string;
  deviceType: string;
  language: string;
  referer: string;
  timestamp: string;
}

interface VisitorInfoProps {
  initialData?: VisitorInfo;
}

export default function VisitorInfo({ initialData }: VisitorInfoProps) {
  const [visitorInfo, setVisitorInfo] = useState<VisitorInfo | null>(initialData || null);
  const [isVisible, setIsVisible] = useState(true);
  const [screenInfo, setScreenInfo] = useState<{
    width: number;
    height: number;
    colorDepth: number;
  } | null>(null);

  useEffect(() => {
    // Get client-side screen info
    if (typeof window !== 'undefined') {
      setScreenInfo({
        width: window.screen.width,
        height: window.screen.height,
        colorDepth: window.screen.colorDepth,
      });
    }

    // If no initial data, fetch from API
    if (!initialData) {
      fetch('/api/visitor-info')
        .then(res => res.json())
        .then(data => setVisitorInfo(data))
        .catch(console.error);
    }
  }, [initialData]);

  if (!isVisible || !visitorInfo) return null;

  const getDeviceIcon = () => {
    switch (visitorInfo.deviceType.toLowerCase()) {
      case 'mobile': return <FiSmartphone className="w-4 h-4 text-blue-400" />;
      case 'tablet': return <FiTablet className="w-4 h-4 text-green-400" />;
      default: return <FiMonitor className="w-4 h-4 text-purple-400" />;
    }
  };

  const formatIP = (ip: string) => {
    // Clean up localhost IP formats
    if (ip === '::ffff:127.0.0.1' || ip === '::1' || ip === '127.0.0.1') {
      return 'localhost';
    }
    return ip;
  };

  const formatBrowser = (browser: string, userAgent: string) => {
    if (browser === 'Unknown' && userAgent === 'node') {
      return 'Server (Development)';
    }
    return browser;
  };

  const formatOS = (os: string, userAgent: string) => {
    if (os === 'Unknown' && userAgent === 'node') {
      return 'Development Environment';
    }
    return os;
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 bg-gray-900/95 backdrop-blur-sm text-white rounded-lg shadow-2xl max-w-sm border border-gray-700">
      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <FiEye className="w-4 h-4 text-emerald-400" />
            <h3 className="text-sm font-semibold">Visitor Info</h3>
          </div>
          <button
            onClick={() => setIsVisible(false)}
            className="text-gray-400 hover:text-white text-xl leading-none transition-colors"
          >
            ×
          </button>
        </div>

        <div className="space-y-2.5 text-xs">
          <div className="flex items-center gap-2">
            <FiGlobe className="w-3 h-3 text-emerald-400" />
            <span className="text-gray-300 min-w-[60px]">IP:</span>
            <span className="font-mono text-white bg-gray-800 px-2 py-1 rounded text-[10px]">
              {formatIP(visitorInfo.ip)}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {getDeviceIcon()}
            <span className="text-gray-300 min-w-[60px]">Device:</span>
            <span className="text-white">{visitorInfo.deviceType}</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="w-3 h-3 text-orange-400">🌐</span>
            <span className="text-gray-300 min-w-[60px]">Browser:</span>
            <span className="text-white">{formatBrowser(visitorInfo.browser, visitorInfo.userAgent)}</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="w-3 h-3 text-cyan-400">💻</span>
            <span className="text-gray-300 min-w-[60px]">OS:</span>
            <span className="text-white">{formatOS(visitorInfo.os, visitorInfo.userAgent)}</span>
          </div>

          {screenInfo && (
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 text-yellow-400">📱</span>
              <span className="text-gray-300 min-w-[60px]">Screen:</span>
              <span className="text-white">{screenInfo.width}×{screenInfo.height}</span>
            </div>
          )}

          <div className="flex items-center gap-2">
            <span className="w-3 h-3 text-pink-400">🌍</span>
            <span className="text-gray-300 min-w-[60px]">Language:</span>
            <span className="text-white">{visitorInfo.language === '*' ? 'All' : visitorInfo.language}</span>
          </div>

          <div className="flex items-center gap-2">
            <FiClock className="w-3 h-3 text-gray-400" />
            <span className="text-gray-300 min-w-[60px]">Visit:</span>
            <span className="text-white">
              {new Date(visitorInfo.timestamp).toLocaleTimeString()}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="w-3 h-3 text-indigo-400">🔗</span>
            <span className="text-gray-300 min-w-[60px]">Source:</span>
            <span className="text-white text-[10px]">{visitorInfo.referer}</span>
          </div>
        </div>

        {visitorInfo.userAgent === 'node' && (
          <div className="mt-3 p-2 bg-yellow-500/20 border border-yellow-500/30 rounded text-[10px] text-yellow-200">
            <span className="font-medium">Development Mode:</span> This is server-side rendering data
          </div>
        )}
      </div>
    </div>
  );
}