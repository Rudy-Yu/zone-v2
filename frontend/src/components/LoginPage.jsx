import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { useToast } from '../hooks/use-toast';

const LoginPage = ({ onLogin }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [credentials, setCredentials] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Simulate login process
    setTimeout(() => {
      if (credentials.email && credentials.password) {
        const userData = {
          name: 'John Doe',
          email: credentials.email,
          role: 'Admin',
          company: 'PT. Sample Company'
        };
        onLogin(userData);
        toast({
          title: "Login Berhasil",
          description: "Selamat datang di Zone!",
        });
      } else {
        toast({
          title: "Login Gagal",
          description: "Email dan password harus diisi",
          variant: "destructive"
        });
      }
      setLoading(false);
    }, 1000);
  };

  const handleGoogleLogin = () => {
    toast({
      title: "Google Login",
      description: "Fitur Google login akan segera tersedia",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 flex items-center justify-center p-4">
      {/* Background Illustration */}
      <div className="absolute left-0 top-1/2 transform -translate-y-1/2 hidden lg:block">
        <div className="w-96 h-96 bg-gradient-to-br from-red-100 to-red-200 rounded-full opacity-20"></div>
        <div className="absolute top-20 left-20 w-64 h-64 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full opacity-30"></div>
      </div>

      <div className="w-full max-w-6xl mx-auto flex items-center justify-center lg:justify-between gap-12">
        {/* Left Side - Illustration */}
        <div className="hidden lg:flex flex-col items-center flex-1 max-w-lg">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">
              Memperlancor proses<br />
              penjualan offline dan online
            </h1>
          </div>
          
          {/* Illustration Area */}
          <div className="relative w-full h-96 bg-gradient-to-br from-red-50 to-blue-50 rounded-2xl p-8 flex items-center justify-center">
            {/* Mock dashboard illustration */}
            <div className="w-full h-full bg-white rounded-xl shadow-lg p-4 space-y-4">
              <div className="flex justify-between items-center">
                <div className="w-20 h-4 bg-red-500 rounded"></div>
                <div className="flex gap-2">
                  <div className="w-6 h-6 bg-gray-200 rounded-full"></div>
                  <div className="w-6 h-6 bg-gray-200 rounded-full"></div>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="h-16 bg-blue-100 rounded"></div>
                <div className="h-16 bg-green-100 rounded"></div>
                <div className="h-16 bg-yellow-100 rounded"></div>
              </div>
              <div className="h-32 bg-gray-50 rounded flex items-end justify-around p-4">
                <div className="w-8 h-16 bg-red-300 rounded"></div>
                <div className="w-8 h-20 bg-red-400 rounded"></div>
                <div className="w-8 h-12 bg-red-300 rounded"></div>
                <div className="w-8 h-24 bg-red-500 rounded"></div>
              </div>
            </div>
            
            {/* Floating elements */}
            <div className="absolute -top-4 -right-4 w-8 h-8 bg-red-500 rounded-full"></div>
            <div className="absolute -bottom-4 -left-4 w-6 h-6 bg-blue-500 rounded-full"></div>
          </div>

          {/* Partner logos */}
          <div className="flex items-center gap-8 mt-8">
            <div className="text-sm text-gray-600 font-medium">CPSSOFT</div>
            <div className="w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-sm">TOP</span>
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="flex-1 max-w-md">
          <Card className="shadow-xl border-0">
            <CardHeader className="text-center pb-4">
              {/* Language Selector */}
              <div className="flex justify-end mb-4">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <div className="w-4 h-3 bg-red-500"></div>
                  <span>Bahasa</span>
                </div>
              </div>

              {/* Logo */}
              <div className="flex items-center justify-center gap-2 mb-6">
                <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-sm">A</span>
                </div>
                <span className="text-2xl font-semibold text-gray-800">Zone</span>
              </div>

              <CardTitle className="text-xl font-semibold text-gray-800">
                Masuk Akun Zone
              </CardTitle>
              <CardDescription className="text-gray-600">
                Selamat datang kembali
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email atau No Handphone</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Masukkan email atau no handphone"
                    value={credentials.email}
                    onChange={(e) => setCredentials(prev => ({ ...prev, email: e.target.value }))}
                    className="h-12"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Masukkan password"
                      value={credentials.password}
                      onChange={(e) => setCredentials(prev => ({ ...prev, password: e.target.value }))}
                      className="h-12 pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  <div className="text-right">
                    <button type="button" className="text-sm text-red-600 hover:text-red-700">
                      Lupa Password?
                    </button>
                  </div>
                </div>

                <Button 
                  type="submit" 
                  className="w-full h-12 bg-red-500 hover:bg-red-600 text-white font-medium"
                  disabled={loading}
                >
                  {loading ? "Masuk..." : "Masuk"}
                </Button>
              </form>

              <div className="text-center text-sm text-gray-600">
                atau masuk dengan
              </div>

              <Button
                variant="outline"
                onClick={handleGoogleLogin}
                className="w-full h-12 border-gray-300 hover:bg-gray-50"
              >
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Google
              </Button>

              <div className="text-center text-sm text-gray-600">
                Belum memiliki akun Zone?{' '}
                <button className="text-red-600 hover:text-red-700 font-medium">
                  Daftar Sekarang
                </button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;