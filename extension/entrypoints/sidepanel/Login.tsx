import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAtom } from 'jotai';
import axios from 'axios';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../../components/ui/card';
import { loginMutationAtom } from './atoms/auth';
import { normalizeBaseUrl } from '../../services/api';

export default function Login() {
  const [baseUrl, setBaseUrl] = useState(localStorage.getItem('baseUrl') || '');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [{ mutateAsync, isPending }] = useAtom(loginMutationAtom);
  const navigate = useNavigate();

  const handleLogin = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');

    try {
      const formattedBaseUrl = normalizeBaseUrl(baseUrl);

      if (!formattedBaseUrl) {
        setError('Base URL invalida');
        return;
      }

      setBaseUrl(formattedBaseUrl);

      const data = await mutateAsync({
        baseUrl: formattedBaseUrl,
        email,
        password,
      });

      if (!data?.token) {
        throw new Error('Token nao recebido do servidor');
      }

      localStorage.setItem('token', data.token);
      navigate('/links');
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const message = err.response?.data?.error || err.response?.data?.message || err.message;
        setError(message || 'Falha ao realizar login');
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Ocorreu um erro inesperado');
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background p-4">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Login</CardTitle>
          <CardDescription>
            Entre com suas credenciais e URL do servidor.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleLogin}>
          <CardContent className="grid gap-4">
             {error && (
              <div className="p-3 text-sm text-destructive bg-destructive/10 rounded-md">
                {error}
              </div>
            )}
            <div className="grid gap-2">
              <label htmlFor="baseUrl" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Base URL do Backend</label>
              <Input 
                id="baseUrl" 
                type="url" 
                placeholder="https://api.meubackend.com" 
                required 
                value={baseUrl}
                onChange={(e) => setBaseUrl(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <label htmlFor="email" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Email</label>
              <Input 
                id="email" 
                type="email" 
                placeholder="m@example.com" 
                required 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <label htmlFor="password" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Senha</label>
              <Input 
                id="password" 
                type="password" 
                required 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full" type="submit" disabled={isPending}>
              {isPending ? 'Entrando...' : 'Entrar'}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
