// app/unauthorized/page.tsx
'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState, useCallback } from 'react';
import { 
  ShieldAlert, 
  ArrowLeft, 
  Home, 
  Lock, 
  Clock, 
  Fingerprint,
  AlertTriangle,
  XCircle,
  LogIn,
  Mail,
  ChevronDown,
  Shield,
  Eye,
  EyeOff
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Types
interface SecurityEvent {
  id: string;
  timestamp: string;
  event: string;
  severity: 'critical' | 'warning' | 'info';
  ip?: string;
}

interface PermissionMatrix {
  resource: string;
  userAccess: boolean;
  requiredRole: string;
  userRole: string;
}

export default function UnauthorizedPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [countdown, setCountdown] = useState(30);
  const [isPaused, setIsPaused] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [showLogs, setShowLogs] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const from = searchParams.get('from') || '/dashboard';
  const required = searchParams.get('required') || 'admin';
  const userRole = searchParams.get('role') || 'guest';
  const sessionId = searchParams.get('sid') || 'unknown';

  // Mock security data
  const securityEvents: SecurityEvent[] = [
    {
      id: 'evt_001',
      timestamp: new Date(Date.now() - 120000).toISOString(),
      event: 'Unauthorized access attempt detected',
      severity: 'critical',
      ip: '192.168.1.***'
    },
    {
      id: 'evt_002',
      timestamp: new Date(Date.now() - 60000).toISOString(),
      event: 'Permission validation failed',
      severity: 'warning',
      ip: '192.168.1.***'
    },
    {
      id: 'evt_003',
      timestamp: new Date().toISOString(),
      event: 'Security checkpoint triggered',
      severity: 'info'
    }
  ];

  const permissionMatrix: PermissionMatrix[] = [
    { resource: 'View Dashboard', userAccess: true, requiredRole: 'user', userRole },
    { resource: 'View Bookings', userAccess: true, requiredRole: 'user', userRole },
    { resource: 'Manage Users', userAccess: false, requiredRole: 'admin', userRole },
    { resource: 'System Settings', userAccess: false, requiredRole: 'admin', userRole },
    { resource: 'Audit Logs', userAccess: false, requiredRole: 'superadmin', userRole },
  ];

  // Mouse tracking for spotlight effect
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Countdown timer
  useEffect(() => {
    if (countdown > 0 && !isPaused) {
      const timer = setTimeout(() => setCountdown(c => c - 1), 1000);
      return () => clearTimeout(timer);
    } else if (countdown === 0 && !isPaused) {
      router.push('/');
    }
  }, [countdown, isPaused, router]);

  const formatTime = useCallback((isoString: string) => {
    return new Date(isoString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  }, []);

  const getSeverityColor = (severity: SecurityEvent['severity']) => {
    switch (severity) {
      case 'critical': return 'text-red-400 bg-red-500/10 border-red-500/20';
      case 'warning': return 'text-amber-400 bg-amber-500/10 border-amber-500/20';
      case 'info': return 'text-blue-400 bg-blue-500/10 border-blue-500/20';
    }
  };

  const getSeverityDot = (severity: SecurityEvent['severity']) => {
    switch (severity) {
      case 'critical': return 'bg-red-500';
      case 'warning': return 'bg-amber-500';
      case 'info': return 'bg-blue-500';
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white relative overflow-hidden selection:bg-indigo-500/30">
      {/* Animated Background */}
      <div className="absolute inset-0">
        {/* Grid pattern */}
        <div 
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                             linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
            backgroundSize: '60px 60px'
          }}
        />
        
        {/* Spotlight effect following mouse */}
        <div 
          className="absolute w-[600px] h-[600px] rounded-full pointer-events-none transition-all duration-300 ease-out"
          style={{
            background: 'radial-gradient(circle, rgba(99,102,241,0.08) 0%, transparent 70%)',
            left: mousePosition.x - 300,
            top: mousePosition.y - 300,
          }}
        />

        {/* Floating orbs */}
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full blur-3xl opacity-20"
            style={{
              width: 200 + i * 100,
              height: 200 + i * 100,
              background: i % 2 === 0 ? 'rgba(99,102,241,0.5)' : 'rgba(239,68,68,0.3)',
              left: `${10 + i * 20}%`,
              top: `${20 + (i % 3) * 25}%`,
            }}
            animate={{
              x: [0, 30, -20, 0],
              y: [0, -40, 20, 0],
              scale: [1, 1.1, 0.9, 1],
            }}
            transition={{
              duration: 8 + i * 2,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 1.5,
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="max-w-lg w-full"
        >
          {/* Main Card */}
          <div className="bg-slate-900/60 backdrop-blur-2xl rounded-3xl border border-slate-800/60 shadow-2xl shadow-black/50 overflow-hidden">
            
            {/* Header with animated shield */}
            <div className="relative p-8 pb-6 text-center border-b border-slate-800/50">
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.2 }}
                className="relative inline-block mb-6"
              >
                <div className="absolute inset-0 bg-red-500/20 blur-2xl rounded-full scale-150" />
                <div className="relative w-20 h-20 bg-gradient-to-br from-red-500/20 to-orange-500/20 rounded-2xl flex items-center justify-center border border-red-500/30">
                  <ShieldAlert className="w-10 h-10 text-red-400" strokeWidth={1.5} />
                </div>
                {/* Pulse rings */}
                {[...Array(3)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute inset-0 rounded-2xl border border-red-500/20"
                    animate={{ scale: [1, 1.5, 1.5], opacity: [0.5, 0, 0] }}
                    transition={{ duration: 2, repeat: Infinity, delay: i * 0.6 }}
                  />
                ))}
              </motion.div>

              <motion.h1 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-3xl font-bold bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent mb-2"
              >
                Access Denied
              </motion.h1>
              
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-slate-400"
              >
                Your credentials don't meet the requirements for this resource
              </motion.p>
            </div>

            <div className="p-8 space-y-6">
              {/* Permission Matrix */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="space-y-3"
              >
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-slate-400 font-medium">Permission Check</span>
                  <span className="text-xs text-slate-500 bg-slate-800/50 px-2 py-1 rounded-full">
                    {userRole}
                  </span>
                </div>
                
                <div className="space-y-2">
                  {permissionMatrix.map((perm, idx) => (
                    <motion.div
                      key={perm.resource}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.6 + idx * 0.1 }}
                      className={`flex items-center justify-between p-3 rounded-xl border ${
                        perm.userAccess 
                          ? 'bg-emerald-500/5 border-emerald-500/20' 
                          : 'bg-red-500/5 border-red-500/20'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-2 h-2 rounded-full ${perm.userAccess ? 'bg-emerald-400' : 'bg-red-400'}`} />
                        <span className="text-sm text-slate-300">{perm.resource}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-slate-500">{perm.requiredRole}</span>
                        {perm.userAccess ? (
                          <Shield className="w-4 h-4 text-emerald-400" />
                        ) : (
                          <XCircle className="w-4 h-4 text-red-400" />
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Collapsible Details */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
              >
                <button
                  onClick={() => setShowDetails(!showDetails)}
                  className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-800/30 border border-slate-800 hover:bg-slate-800/50 transition-all group"
                >
                  <div className="flex items-center gap-2 text-sm text-slate-300">
                    <Fingerprint className="w-4 h-4 text-indigo-400" />
                    <span>Request Details</span>
                  </div>
                  <motion.div
                    animate={{ rotate: showDetails ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <ChevronDown className="w-4 h-4 text-slate-500 group-hover:text-slate-300" />
                  </motion.div>
                </button>

                <AnimatePresence>
                  {showDetails && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="mt-2 p-4 bg-slate-800/20 rounded-xl border border-slate-800/50 space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-slate-500">Requested Path</span>
                          <span className="text-slate-300 font-mono text-xs">{from}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">Required Role</span>
                          <span className="text-amber-400 font-medium">{required}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">Your Role</span>
                          <span className="text-slate-300">{userRole}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">Session ID</span>
                          <span className="text-slate-400 font-mono text-xs">{sessionId}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">Timestamp</span>
                          <span className="text-slate-400 text-xs">{new Date().toISOString()}</span>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>

              {/* Security Logs Toggle */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.9 }}
              >
                <button
                  onClick={() => setShowLogs(!showLogs)}
                  className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-800/30 border border-slate-800 hover:bg-slate-800/50 transition-all group"
                >
                  <div className="flex items-center gap-2 text-sm text-slate-300">
                    <AlertTriangle className="w-4 h-4 text-amber-400" />
                    <span>Security Events</span>
                    <span className="text-xs bg-red-500/20 text-red-400 px-1.5 py-0.5 rounded-full">
                      {securityEvents.length}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {showLogs ? (
                      <EyeOff className="w-4 h-4 text-slate-500" />
                    ) : (
                      <Eye className="w-4 h-4 text-slate-500" />
                    )}
                  </div>
                </button>

                <AnimatePresence>
                  {showLogs && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="mt-2 space-y-2">
                        {securityEvents.map((event, idx) => (
                          <motion.div
                            key={event.id}
                            initial={{ x: -20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: idx * 0.1 }}
                            className={`p-3 rounded-xl border text-xs ${getSeverityColor(event.severity)}`}
                          >
                            <div className="flex items-start justify-between mb-1">
                              <div className="flex items-center gap-2">
                                <div className={`w-1.5 h-1.5 rounded-full ${getSeverityDot(event.severity)}`} />
                                <span className="font-medium uppercase tracking-wider">{event.severity}</span>
                              </div>
                              <span className="opacity-70 font-mono">{formatTime(event.timestamp)}</span>
                            </div>
                            <p className="ml-3.5">{event.event}</p>
                            {event.ip && (
                              <p className="ml-3.5 mt-1 opacity-60 font-mono text-[10px]">IP: {event.ip}</p>
                            )}
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>

              {/* Countdown Timer */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
                className="relative"
              >
                <div 
                  className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 cursor-pointer hover:border-indigo-500/40 transition-colors"
                  onClick={() => setIsPaused(!isPaused)}
                >
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <Clock className="w-5 h-5 text-indigo-400" />
                      {!isPaused && (
                        <span className="absolute -top-1 -right-1 w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-indigo-300">
                        {isPaused ? 'Redirect Paused' : 'Auto-redirecting'}
                      </p>
                      <p className="text-xs text-indigo-400/60">
                        Click to {isPaused ? 'resume' : 'pause'}
                      </p>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <span className="text-2xl font-bold font-mono text-indigo-300">
                      {countdown.toString().padStart(2, '0')}
                    </span>
                    <span className="text-xs text-indigo-400/60 ml-1">s</span>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="absolute bottom-0 left-4 right-4 h-0.5 bg-slate-800 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-indigo-500 to-purple-500"
                    initial={{ width: '100%' }}
                    animate={{ width: `${(countdown / 30) * 100}%` }}
                    transition={{ duration: 1, ease: "linear" }}
                  />
                </div>
              </motion.div>

              {/* Action Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.1 }}
                className="grid grid-cols-2 gap-3"
              >
                <button
                  onClick={() => router.back()}
                  className="group flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-slate-800/50 border border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white hover:border-slate-600 transition-all active:scale-[0.98]"
                >
                  <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                  <span className="font-medium">Go Back</span>
                </button>

                <button
                  onClick={() => router.push('/')}
                  className="group flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-500 hover:to-purple-500 transition-all shadow-lg shadow-indigo-500/25 active:scale-[0.98]"
                >
                  <Home className="w-4 h-4" />
                  <span className="font-medium">Home</span>
                </button>
              </motion.div>

              {/* Secondary Actions */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2 }}
                className="flex items-center justify-center gap-4 pt-2"
              >
                <button
                  onClick={() => router.push('/login')}
                  className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-indigo-400 transition-colors"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  Switch Account
                </button>
                <span className="text-slate-700">•</span>
                <button
                  onClick={() => window.location.href = 'mailto:support@example.com'}
                  className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-indigo-400 transition-colors"
                >
                  <Mail className="w-3.5 h-3.5" />
                  Contact Support
                </button>
              </motion.div>
            </div>

            {/* Footer */}
            <div className="px-8 py-4 bg-slate-950/30 border-t border-slate-800/50 flex items-center justify-between text-[10px] text-slate-600 font-mono">
              <div className="flex items-center gap-2">
                <Lock className="w-3 h-3" />
                <span>HTTP 403 Forbidden</span>
              </div>
              <span>ID: {Math.random().toString(36).substr(2, 9).toUpperCase()}</span>
            </div>
          </div>

          {/* Bottom hint */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.4 }}
            className="text-center text-xs text-slate-600 mt-6"
          >
            Protected by advanced access control • All attempts are logged
          </motion.p>
        </motion.div>
      </div>
    </div>
  );
}