import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Shield } from 'lucide-react';
import { useToast } from '../hooks/use-toast';
import { adminAuthAPI } from '../services/api';

const AdminLogin = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await adminAuthAPI.login(formData);
      localStorage.setItem('adminToken', response.token);
      localStorage.setItem('admin', JSON.stringify(response.admin));
      
      toast({
        title: 'Success',
        description: 'Logged in successfully!'
      });
      
      navigate('/admin/dashboard');
    } catch (error) {
      toast({
        title: 'Error',
        description: error.response?.data?.detail || 'Login failed',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-pink-600 rounded-lg flex items-center justify-center">
              <Shield className="w-7 h-7 text-white" />
            </div>
          </div>
          <CardTitle className="text-2xl">Admin Portal</CardTitle>
          <CardDescription>Sign in to access the admin dashboard</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="text"
                placeholder="admin"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
              />
            </div>
            <Button 
              type="submit" 
              className="w-full bg-red-600 hover:bg-red-700"
              disabled={loading}
            >
              {loading ? 'Signing in...' : 'Sign In as Admin'}
            </Button>
          </form>
          <div className="mt-4 text-center text-sm text-gray-500">
            <p>Default credentials: admin / admin123</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminLogin;