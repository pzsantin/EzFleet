# Configuração do Firebase

Este guia explica como integrar Firebase ao seu projeto Fleet Mapper Pro para salvar veículos e missões.

## 🚀 Passo 1: Criar um projeto Firebase

1. Acesse [Firebase Console](https://console.firebase.google.com/)
2. Clique em **"Criar projeto"**
3. Digite um nome para seu projeto (ex: `fleet-mapper-pro`)
4. Siga as etapas e crie o projeto

## 🔑 Passo 2: Obter as credenciais

1. No Firebase Console, selecione seu projeto
2. Clique no ícone de **engrenagem** (Configurações) no canto superior esquerdo
3. Vá para **"Configurações do projeto"**
4. Role para baixo até a seção **"Seus aplicativos"**
5. Clique em **"Web"** (se não houver nenhum, clique em **"Adicionar app"**)
6. Copie a configuração Firebase que aparecerá (um objeto JavaScript)

Você verá algo como:

```javascript
{
  "apiKey": "AIzaSyD...",
  "authDomain": "seu-projeto.firebaseapp.com",
  "projectId": "seu-projeto",
  "storageBucket": "seu-projeto.appspot.com",
  "messagingSenderId": "123456789",
  "appId": "1:123456789:web:abc..."
}
```

## 🔐 Passo 3: Configurar as variáveis de ambiente

1. Na raiz do seu projeto, crie/edite um arquivo `.env.local`:

```bash
VITE_FIREBASE_API_KEY=AIzaSyD...
VITE_FIREBASE_AUTH_DOMAIN=seu-projeto.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=seu-projeto
VITE_FIREBASE_STORAGE_BUCKET=seu-projeto.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abc...
```

**⚠️ IMPORTANTE**: Adicione `.env.local` ao seu `.gitignore` para não expor suas credenciais!

## 🔒 Passo 4: Configurar o Firestore Database

1. No Firebase Console, vá para **"Firestore Database"** (no menu lateral)
2. Clique em **"Criar banco de dados"**
3. Selecione **"Iniciar no modo de teste"** (apenas para desenvolvimento)
4. Escolha a localização mais próxima
5. Clique em **"Criar"**

### Regras de segurança (para produção)

Após criar o banco, vá para a aba **"Regras"** e substitua por:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Usuários podem acessar apenas seus próprios dados
    match /users/{userId} {
      match /{document=**} {
        allow read, write: if request.auth.uid == userId;
      }
    }
  }
}
```

## 🆔 Passo 5: Ativar Autenticação

1. No Firebase Console, vá para **"Authentication"** (no menu lateral)
2. Clique em **"Começar"**
3. Selecione **"Email/Senha"**
4. Ative a opção e clique em **"Salvar"**

## 📦 Passo 6: Instalar dependências

```bash
npm install
# ou
bun install
```

(Firebase já foi adicionado ao `package.json`)

## ✅ Pronto!

Seu projeto agora está configurado para:

- ✅ **Salvar veículos** por usuário no Firestore
- ✅ **Salvar missões** por usuário no Firestore
- ✅ **Carregar dados** automaticamente ao fazer login
- ✅ **Atualizar e deletar** dados em tempo real

## 🧪 Testando a integração

1. Inicie o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```

2. Faça login com sua conta
3. Tente adicionar um novo veículo
4. Vá para o Firebase Console e verifique que os dados foram salvos em:
   ```
   users/{userId}/vehicles/{vehicleId}
   users/{userId}/missions/{missionId}
   ```

## 🚨 Troubleshooting

### Erro: "FIREBASE_API_KEY is not defined"
- Verifique se as variáveis de ambiente estão corretas em `.env.local`
- Reinicie o servidor de desenvolvimento

### Erro: "Permission denied" ao salvar dados
- Verifique as regras de segurança do Firestore
- Certifique-se de que o usuário está autenticado

### Dados não aparecem
- Verifique o console do navegador para erros
- Verifique se o Firestore Database está criado
- Aguarde alguns segundos após fazer login (carregamento dos dados)

## 📚 Documentação útil

- [Firebase Documentation](https://firebase.google.com/docs)
- [Firestore Security Rules](https://firebase.google.com/docs/firestore/security/get-started)
- [Firebase Authentication](https://firebase.google.com/docs/auth)

---

**Dúvidas?** Consulte a documentação oficial do Firebase ou o código nos seguintes arquivos:

- Configuração: `src/integrations/firebase/config.ts`
- Serviços: `src/integrations/firebase/firebaseService.ts`
- Hook: `src/hooks/useFirebase.ts`
