import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { Hospital, User, Lock } from 'lucide-react';
import { login } from '../store/authSlice';
import { api } from '../lib/api';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const schema = yup.object().shape({
  email: yup.string().email('Geçerli bir e-posta girin').required('E-posta zorunludur'),
  password: yup.string().min(6, 'Şifre en az 6 karakter olmalıdır').required('Şifre zorunludur'),
});

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isAuthenticated && user) {
      if (user.role === 'secretary') navigate('/secretary');
      else if (user.role === 'er_doctor') navigate('/doctor/er');
      else if (user.role === 'clinic_doctor') navigate('/doctor/clinic');
    }
  }, [isAuthenticated, user, navigate]);

  const { register, handleSubmit, setError, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data) => {
    try {
      const response = await api.get('/users');
      const users = response.data;
      
      const matchedUser = users.find(
        u => u.email && u.email.toLowerCase() === data.email.toLowerCase() && u.password === data.password
      );
      
      if (matchedUser) {
        dispatch(login(matchedUser));
        if (matchedUser.role === 'secretary') navigate('/secretary');
        else if (matchedUser.role === 'er_doctor') navigate('/doctor/er');
        else if (matchedUser.role === 'clinic_doctor') navigate('/doctor/clinic');
      } else {
        setError('email', { type: 'manual', message: 'E-posta veya şifre hatalı' });
        setError('password', { type: 'manual', message: 'E-posta veya şifre hatalı' });
      }
    } catch (error) {
      console.error("Giriş hatası:", error);
      setError('email', { type: 'manual', message: 'Kullanıcı doğrulanamadı. Bilgileri kontrol edin.' });
    }
  };

  const handleMockLogin = (roleData) => {
    dispatch(login(roleData));
    if (roleData.role === 'secretary') navigate('/secretary');
    else if (roleData.role === 'er_doctor') navigate('/doctor/er');
    else if (roleData.role === 'clinic_doctor') navigate('/doctor/clinic');
  };

  return (
    <div className="login-card-wrapper">
      <Card className="w-full max-w-md shadow-xl border-slate-200">
        <CardHeader className="space-y-3 pb-6 text-center">
          <div className="mx-auto bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mb-2">
            <Hospital className="w-8 h-8 text-primary" />
          </div>
          <CardTitle className="login-title-text">Özel Yedikule Hastahanesi</CardTitle>
          <CardDescription className="login-subtitle-text">
            Sisteme giriş yapmak için bilgilerinizi girin.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="login-form-container">
            <div className="space-y-2">
              <Label htmlFor="email">E-posta</Label>
              <div className="relative">
                <User className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="ornek@yedikule.com" 
                  className="pl-9"
                  {...register('email')} 
                />
              </div>
              {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Şifre</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input 
                  id="password" 
                  type="password" 
                  placeholder="******" 
                  className="pl-9"
                  {...register('password')} 
                />
              </div>
              {errors.password && <p className="text-xs text-destructive">{errors.password.message}</p>}
            </div>

            <Button type="submit" className="w-full mt-2">
              Giriş Yap
            </Button>
          </form>

          <div className="login-mock-buttons-grid">
            <p className="text-xs text-center text-muted-foreground mb-2">Hızlı Giriş (Mock)</p>
            <Button 
              variant="outline" 
              className="login-mock-btn"
              onClick={() => handleMockLogin({ id: "1", role: "secretary", clinicId: null, name: "Zehra Yılmaz" })}
            >
              Sekreter Olarak Giriş
            </Button>
            <Button 
              variant="outline" 
              className="login-mock-btn"
              onClick={() => handleMockLogin({ id: "12", role: "er_doctor", clinicId: "er", name: "Dr. Hakan Öztürk" })}
            >
              Acil Doktoru Olarak Giriş
            </Button>
            <Button 
              variant="outline" 
              className="login-mock-btn"
              onClick={() => handleMockLogin({ id: "5", role: "clinic_doctor", clinicId: "c2", name: "Dr. Fatma Şahin" })}
            >
              Klinik Doktoru Olarak Giriş
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
