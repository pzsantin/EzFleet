import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/integrations/firebase/config';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Map, LogIn, UserPlus, Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        console.log('🔑 Tentando fazer login com:', email);
        const result = await signInWithEmailAndPassword(auth, email, password);
        console.log('🔑 Login bem-sucedido:', result.user.uid);
        toast.success('Login realizado!');
        // Pequeno delay para garantir que onAuthStateChanged disparou
        setTimeout(() => navigate('/'), 100);
      } else {
        console.log('🔑 Tentando criar conta com:', email);
        const result = await createUserWithEmailAndPassword(auth, email, password);
        console.log('🔑 Cadastro bem-sucedido:', result.user.uid);
        toast.success('Cadastro realizado!');
        // Pequeno delay para garantir que onAuthStateChanged disparou
        setTimeout(() => navigate('/'), 100);
      }
    } catch (error: any) {
      console.error('❌ Erro de autenticação:', error.code, error.message);
      // Firebase error messages
      let errorMessage = 'Erro na autenticação';
      if (error.code === 'auth/user-not-found') {
        errorMessage = 'Usuário não encontrado';
      } else if (error.code === 'auth/wrong-password') {
        errorMessage = 'Senha incorreta';
      } else if (error.code === 'auth/email-already-in-use') {
        errorMessage = 'Email já cadastrado';
      } else if (error.code === 'auth/weak-password') {
        errorMessage = 'Senha muito fraca (mínimo 6 caracteres)';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'Email inválido';
      }
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-sm space-y-8 animate-fade-in">
        {/* Logo */}
        <div className="text-center">
          <div className="inline-flex h-16 w-16 rounded-2xl bg-primary items-center justify-center mb-4">
            <Map className="h-8 w-8 text-primary-foreground" />
          </div>
          <h1 className="text-2xl font-bold">EzFleet</h1>
          <p className="text-sm text-muted-foreground mt-1">Gestão de Frota Inteligente</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-card rounded-lg border p-6 space-y-4" style={{ boxShadow: 'var(--shadow-elevated)' }}>
          <h2 className="font-semibold text-lg text-center">
            {isLogin ? 'Entrar' : 'Criar Conta'}
          </h2>

          <div className="space-y-2">
            <Label>Email</Label>
            <Input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="seu@email.com" required />
          </div>

          <div className="space-y-2">
            <Label>Senha</Label>
            <div className="relative">
              <Input 
                type={showPassword ? 'text' : 'password'} 
                value={password} 
                onChange={e => setPassword(e.target.value)} 
                placeholder="••••••••" 
                required 
                minLength={6} 
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <Button type="submit" className="w-full gap-2" disabled={loading}>
            {isLogin ? <LogIn className="h-4 w-4" /> : <UserPlus className="h-4 w-4" />}
            {loading ? 'Aguarde...' : isLogin ? 'Entrar' : 'Cadastrar'}
          </Button>

          <p className="text-center text-sm text-muted-foreground">
            {isLogin ? 'Não tem conta?' : 'Já tem conta?'}{' '}
            <button type="button" onClick={() => setIsLogin(!isLogin)} className="text-primary font-medium hover:underline">
              {isLogin ? 'Cadastre-se' : 'Faça login'}
            </button>
          </p>
        </form>
      </div>
    </div>
  );
};

export default AuthPage;
