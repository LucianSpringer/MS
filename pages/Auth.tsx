import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Button from '../components/Button';
import { User, Mail, Lock, ArrowRight } from 'lucide-react';

const Auth: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const { login, register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (isLogin) {
      if (login(formData.email, formData.password)) {
        navigate('/dashboard');
      } else {
        setError('Email atau password salah.');
      }
    } else {
      if (!formData.name) {
        setError('Nama harus diisi');
        return;
      }
      if (register(formData.name, formData.email, formData.password)) {
        navigate('/dashboard');
      } else {
        setError('Email sudah terdaftar.');
      }
    }
  };

  return (
    <div className="pt-32 pb-20 min-h-screen bg-gray-50 dark:bg-black flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white dark:bg-darkSurface p-8 rounded-3xl shadow-2xl border border-gray-100 dark:border-gray-800 animate-fade-in-up">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-display font-bold text-gray-900 dark:text-white">
            {isLogin ? 'Selamat Datang' : 'Buat Akun'}
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mt-2">
            {isLogin ? 'Masuk untuk mengelola pesanan Anda' : 'Daftar untuk nikmati kemudahan order catering'}
          </p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-6 text-sm text-center border border-red-100">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div className="relative">
              <User className="absolute left-4 top-3.5 text-gray-400" size={20} />
              <input 
                type="text" 
                placeholder="Nama Lengkap" 
                className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl py-3 pl-12 pr-4 outline-none focus:ring-2 focus:ring-primary dark:text-white transition-all"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
              />
            </div>
          )}

          <div className="relative">
            <Mail className="absolute left-4 top-3.5 text-gray-400" size={20} />
            <input 
              type="email" 
              placeholder="Email Address" 
              className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl py-3 pl-12 pr-4 outline-none focus:ring-2 focus:ring-primary dark:text-white transition-all"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              required
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-4 top-3.5 text-gray-400" size={20} />
            <input 
              type="password" 
              placeholder="Password" 
              className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl py-3 pl-12 pr-4 outline-none focus:ring-2 focus:ring-primary dark:text-white transition-all"
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              required
            />
          </div>

          <Button fullWidth type="submit" className="mt-4">
            {isLogin ? 'Masuk Sekarang' : 'Daftar Akun'} <ArrowRight size={18} className="ml-2" />
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            {isLogin ? 'Belum punya akun? ' : 'Sudah punya akun? '}
            <button 
              onClick={() => { setIsLogin(!isLogin); setError(''); }} 
              className="text-primary font-bold hover:underline"
            >
              {isLogin ? 'Daftar disini' : 'Masuk disini'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Auth;
