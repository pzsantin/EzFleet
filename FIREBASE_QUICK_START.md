# Firebase Integration - Quick Start (5 minutos)

## ⚡ TL;DR - Faça isso rápido!

### 1️⃣ Crie um projeto Firebase

👉 [Ir para Firebase Console](https://console.firebase.google.com/)

- Clique "Criar projeto"
- Digite um nome
- Termine o setup

### 2️⃣ Pegue suas credenciais

Na Firebase Console:
1. Settings ⚙️ (canto superior esquerdo)
2. Project settings → Seu app web
3. Copie a configuração (objeto JavaScript com `apiKey`, `projectId`, etc)

### 3️⃣ Crie `.env.local` na raiz do projeto

```
VITE_FIREBASE_API_KEY=sua_chave_aqui
VITE_FIREBASE_AUTH_DOMAIN=seu_dominio_aqui
VITE_FIREBASE_PROJECT_ID=seu_project_aqui
VITE_FIREBASE_STORAGE_BUCKET=seu_bucket_aqui
VITE_FIREBASE_MESSAGING_SENDER_ID=seu_id_aqui
VITE_FIREBASE_APP_ID=seu_app_id_aqui
```

### 4️⃣ Ative o Firestore Database

Na Firebase Console:
1. Firestore Database (menu esquerdo)
2. Criar banco de dados
3. Modo teste (para desenvolvimento)
4. Escolha região

### 5️⃣ Ative a Autenticação

Na Firebase Console:
1. Authentication (menu esquerdo)
2. Começar → Email/Senha
3. Ativar e Salvar

### 6️⃣ Configure as regras de segurança

Na aba "Rules" do Firestore, cole:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      match /{document=**} {
        allow read, write: if request.auth.uid == userId;
      }
    }
  }
}
```

Clique Publicar.

### 7️⃣ Instale dependências

```bash
npm install
```

### 8️⃣ Pronto! Teste agora

```bash
npm run dev
```

Vá para http://localhost:5173 e teste:
- Faça login
- Adicione um veículo
- Vá para Firebase Console → Firestore
- Veja seus dados em `users/{seu_id}/vehicles/`

---

## 🎯 O que foi integrado?

✅ **VehiclesPage** - Salva/carrega veículos do Firebase
✅ **MissionsPage** - Salva/carrega missões do Firebase
✅ **NewMissionPage** - Cria missões no Firebase
✅ **MissionDetailPage** - Exibe/deleta missões do Firebase

## 💾 Estrutura de dados

```
Firestore:
users/
  └─ {userId}/
     ├─ vehicles/
     │  ├─ {id1}: { name, plate, type, ... }
     │  └─ {id2}: { name, plate, type, ... }
     │
     └─ missions/
        ├─ {id1}: { name, vehicleId, points, ... }
        └─ {id2}: { name, vehicleId, points, ... }
```

## 🐛 Erros comuns?

| Erro | Solução |
|------|---------|
| "FIREBASE_API_KEY is not defined" | Verifique seu `.env.local` |
| "Permission denied" | Configure as regras de segurança |
| Dados não carregam | Aguarde alguns segundos após login |
| Erro ao salvar | Verifique se o Firestore DB foi criado |

## 📚 Documentação completa

- **Setup detalhado**: [FIREBASE_SETUP.md](FIREBASE_SETUP.md)
- **Como usar o hook**: [FIREBASE_HOOK_GUIDE.md](FIREBASE_HOOK_GUIDE.md)
- **Arquitetura completa**: [FIREBASE_INTEGRATION_SUMMARY.md](FIREBASE_INTEGRATION_SUMMARY.md)

---

**Pronto em 5 minutos?** ✅ Você conseguiu! 🎉