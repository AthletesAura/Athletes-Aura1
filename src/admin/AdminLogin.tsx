import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, AlertCircle, ArrowLeft, ShieldCheck, CheckCircle } from 'lucide-react';
import { auth } from '../firebase.ts';
import { signInAnonymously } from 'firebase/auth';
import { StorageService } from '../services/storage.ts';
import { motion, AnimatePresence } from 'motion/react';

type LoginMode = 'login' | 'forgot' | 'reset';

export const AdminLogin: React.FC = () => {
  const [mode, setMode] = useState<LoginMode>('login');
  const [password, setPassword] = useState('');
  const [securityPhrase, setSecurityPhrase] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    try {
      const isValid = await StorageService.verifyPassword(password);
      if (!isValid) {
        setError('Invalid password.');
        setIsLoading(false);
        return;
      }

      await signInAnonymously(auth);
      sessionStorage.setItem('admin_session', 'true');
      navigate('/admin');
    } catch (err: any) {
      console.error('Login error:', err);
      setError(`Login failed: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyPhrase = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    const isValid = await StorageService.verifySecurityPhrase(securityPhrase);
    if (isValid) {
      setMode('reset');
    } else {
      setError('Incorrect security phrase. If you haven\'t set one, please contact support.');
    }
    setIsLoading(false);
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setIsLoading(true);
    try {
      await StorageService.updatePassword(newPassword);
      setSuccess('Password reset successfully! You can now log in.');
      setMode('login');
      setPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setSecurityPhrase('');
      setTimeout(() => setSuccess(''), 5000);
    } catch {
      setError('Failed to reset password.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-white rounded-3xl shadow-2xl overflow-hidden"
      >
        <div className="p-8">
          <div className="text-center mb-8">
            <div className="bg-secondary rounded-full p-4 inline-block mb-4 shadow-lg">
              <Lock className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-3xl font-black text-gray-900 tracking-tighter uppercase">
              Admin <span className="text-secondary">Portal</span>
            </h2>
            <p className="text-gray-500 mt-2 text-sm font-bold uppercase tracking-widest">Restricted Access</p>
          </div>

          {error && (
            <motion.div 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-xl mb-6 flex items-start text-sm"
            >
              <AlertCircle className="h-5 w-5 mr-3 shrink-0 mt-0.5" />
              <span className="font-medium">{error}</span>
            </motion.div>
          )}

          {success && (
            <motion.div 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-green-50 border-l-4 border-green-500 text-green-700 p-4 rounded-xl mb-6 flex items-start text-sm"
            >
              <CheckCircle className="h-5 w-5 mr-3 shrink-0 mt-0.5" />
              <span className="font-medium">{success}</span>
            </motion.div>
          )}

          <AnimatePresence mode="wait">
            {mode === 'login' && (
              <motion.form 
                key="login"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                onSubmit={handleLogin}
              >
                <div className="mb-6">
                  <label className="block text-gray-500 text-[10px] font-black uppercase tracking-widest mb-2" htmlFor="password">
                    Admin Password
                  </label>
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-5 py-4 bg-gray-50 border-2 border-gray-100 rounded-2xl focus:outline-none focus:border-black transition-all font-medium"
                    placeholder="••••••••"
                    required
                  />
                </div>
                <button
                  type="submit"
                  disabled={isLoading || !password}
                  className="w-full bg-black text-white py-4 rounded-2xl font-black uppercase tracking-widest hover:bg-gray-800 transition-all shadow-xl disabled:opacity-50 active:scale-[0.98]"
                >
                  {isLoading ? 'Authenticating...' : 'Sign In'}
                </button>
                <div className="mt-8 text-center pt-6 border-t border-gray-100">
                  <p className="text-xs text-gray-400 mb-2 uppercase tracking-widest font-bold">Having trouble?</p>
                  <button 
                    type="button"
                    onClick={() => { setMode('forgot'); setError(''); }}
                    className="text-sm font-black text-secondary hover:text-black transition-colors uppercase tracking-widest underline decoration-2 underline-offset-4"
                  >
                    Reset Admin Password
                  </button>
                </div>
              </motion.form>
            )}

            {mode === 'forgot' && (
              <motion.form 
                key="forgot"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                onSubmit={handleVerifyPhrase}
              >
                <div className="mb-6">
                  <div className="flex items-center gap-2 mb-4">
                    <ShieldCheck className="text-secondary" size={20} />
                    <h3 className="font-bold text-gray-900">Identity Verification</h3>
                  </div>
                  <p className="text-sm text-gray-500 mb-6 leading-relaxed">
                    Please enter your secret security phrase to reset your password.
                  </p>
                  <label className="block text-gray-500 text-[10px] font-black uppercase tracking-widest mb-2" htmlFor="phrase">
                    Security Phrase
                  </label>
                  <input
                    id="phrase"
                    type="text"
                    value={securityPhrase}
                    onChange={(e) => setSecurityPhrase(e.target.value)}
                    className="w-full px-5 py-4 bg-gray-50 border-2 border-gray-100 rounded-2xl focus:outline-none focus:border-black transition-all font-medium"
                    placeholder="Your secret phrase"
                    required
                  />
                </div>
                <button
                  type="submit"
                  disabled={isLoading || !securityPhrase}
                  className="w-full bg-black text-white py-4 rounded-2xl font-black uppercase tracking-widest hover:bg-gray-800 transition-all shadow-xl disabled:opacity-50 active:scale-[0.98]"
                >
                  {isLoading ? 'Verifying...' : 'Verify Identity'}
                </button>
                <button 
                  type="button"
                  onClick={() => { setMode('login'); setError(''); }}
                  className="mt-6 w-full flex items-center justify-center gap-2 text-xs font-bold text-gray-400 hover:text-black transition-colors uppercase tracking-wider"
                >
                  <ArrowLeft size={14} /> Back to Login
                </button>
              </motion.form>
            )}

            {mode === 'reset' && (
              <motion.form 
                key="reset"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                onSubmit={handleResetPassword}
              >
                <div className="space-y-4 mb-6">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle className="text-green-500" size={20} />
                    <h3 className="font-bold text-gray-900">Set New Password</h3>
                  </div>
                  <div>
                    <label className="block text-gray-500 text-[10px] font-black uppercase tracking-widest mb-2">
                      New Password
                    </label>
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full px-5 py-4 bg-gray-50 border-2 border-gray-100 rounded-2xl focus:outline-none focus:border-black transition-all font-medium"
                      placeholder="At least 6 characters"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-gray-500 text-[10px] font-black uppercase tracking-widest mb-2">
                      Confirm New Password
                    </label>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full px-5 py-4 bg-gray-50 border-2 border-gray-100 rounded-2xl focus:outline-none focus:border-black transition-all font-medium"
                      placeholder="Repeat new password"
                      required
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={isLoading || !newPassword || !confirmPassword}
                  className="w-full bg-black text-white py-4 rounded-2xl font-black uppercase tracking-widest hover:bg-gray-800 transition-all shadow-xl disabled:opacity-50 active:scale-[0.98]"
                >
                  {isLoading ? 'Updating...' : 'Update Password'}
                </button>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};
