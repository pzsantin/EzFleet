# Integração Firebase - Resumo

## 📊 Arquitetura da Integração

```
┌─────────────────────────────────────────────────────────────────┐
│                    COMPONENTS / PAGES                           │
│  ├─ VehiclesPage.tsx                                            │
│  ├─ MissionsPage.tsx                                            │
│  ├─ NewMissionPage.tsx                                          │
│  └─ MissionDetailPage.tsx                                       │
└────────────────┬────────────────────────────────────────────────┘
                 │
                 └──► useFirebase Hook ◄──────┐
                      (src/hooks/useFirebase.ts)
                      │
                      ├─ vehicles (state)
                      ├─ missions (state)
                      ├─ loading (state)
                      ├─ error (state)
                      ├─ addVehicle()
                      ├─ updateVehicle()
                      ├─ deleteVehicle()
                      ├─ addMission()
                      ├─ updateMission()
                      └─ deleteMission()
                      │
                      └──► Firebase Services ◄──────┐
                           (src/integrations/firebase/firebaseService.ts)
                           │
                           ├─ getVehicles()
                           ├─ addVehicle()
                           ├─ updateVehicle()
                           ├─ deleteVehicle()
                           ├─ getMissions()
                           ├─ addMission()
                           ├─ updateMission()
                           └─ deleteMission()
                           │
                           └──► Firebase Config ◄──────┐
                                (src/integrations/firebase/config.ts)
                                │
                                ├─ Firebase App
                                ├─ Firebase Auth
                                └─ Firestore DB
                                       │
                                       └──► Cloud Firestore
                                            (Banco de dados)
```

## 📁 Estrutura de Dados no Firestore

```
root/
├─ users/
│  └─ {userId}/                 # ID do usuário autenticado
│     ├─ vehicles/
│     │  └─ {vehicleId}/        # Cada veículo do usuário
│     │     ├─ name: "Hilux"
│     │     ├─ plate: "ABC-1234"
│     │     ├─ type: "SUV"
│     │     ├─ fuelType: "Diesel"
│     │     ├─ avgConsumption: 10.5
│     │     ├─ status: "active"
│     │     ├─ totalKm: 45230
│     │     ├─ missions: 12
│     │     ├─ createdAt: Timestamp
│     │     └─ updatedAt: Timestamp
│     │
│     └─ missions/
│        └─ {missionId}/        # Cada missão do usuário
│           ├─ name: "Patrulha"
│           ├─ vehicleId: "..."
│           ├─ vehicleName: "Hilux"
│           ├─ points: [
│           │    { lat, lng, label, order },
│           │    ...
│           │  ]
│           ├─ status: "planned"
│           ├─ distanceKm: 45.2
│           ├─ durationMinutes: 120
│           ├─ fuelConsumed: 4.3
│           ├─ avgSpeed: 22.6
│           ├─ notes: "..."
│           ├─ createdAt: Timestamp
│           ├─ completedAt: Timestamp (opcional)
│           └─ updatedAt: Timestamp
```

## 🔄 Fluxo de Dados

### 1. Adicionar Veículo
```
Component (VehiclesPage)
    ↓
addVehicle(vehicleData)
    ↓
useFirebase Hook
    ↓
firebaseService.addVehicle()
    ↓
Firestore: users/{userId}/vehicles/{newId}
    ↓
Hook atualiza estado local
    ↓
Component renderiza com novo veículo
```

### 2. Carregar Veículos (ao inicializar)
```
useFirebase Hook (useEffect)
    ↓
firebaseService.getVehicles(userId)
    ↓
Firestore: busca collection users/{userId}/vehicles/
    ↓
Hook atualiza estado: setVehicles()
    ↓
Component renderiza lista
```

### 3. Criar Missão
```
Component (NewMissionPage)
    ↓
addMission(missionData)
    ↓
useFirebase Hook
    ↓
firebaseService.addMission()
    ↓
Firestore: users/{userId}/missions/{newId}
    ↓
Hook atualiza estado local
    ↓
Component navega para /missions
```

## ✅ Checklist de Configuração

- [ ] Instalar Firebase: `npm install firebase`
- [ ] Criar projeto no Firebase Console
- [ ] Habilitar Firestore Database
- [ ] Habilitar Authentication (Email/Password)
- [ ] Obter credenciais API
- [ ] Criar arquivo `.env.local` com credenciais
- [ ] Configurar regras de segurança do Firestore
- [ ] Testar login/cadastro
- [ ] Adicionar um veículo e verificar no Firestore
- [ ] Criar uma missão e verificar no Firestore

## 🎯 Arquivos Criados/Modificados

### ✨ Arquivos Criados:
- `src/integrations/firebase/config.ts` - Configuração do Firebase
- `src/integrations/firebase/firebaseService.ts` - Serviços CRUD
- `src/hooks/useFirebase.ts` - Hook customizado
- `FIREBASE_SETUP.md` - Guia de configuração
- `FIREBASE_HOOK_GUIDE.md` - Guia de uso do hook
- `.env.example` - Variáveis de ambiente

### 📝 Arquivos Modificados:
- `package.json` - Adicionado Firebase SDK
- `src/pages/VehiclesPage.tsx` - Integrado com Firebase
- `src/pages/MissionsPage.tsx` - Integrado com Firebase
- `src/pages/NewMissionPage.tsx` - Integrado com Firebase
- `src/pages/MissionDetailPage.tsx` - Integrado com Firebase

## 🚀 Próximos Passos

1. **Configure o Firebase** seguindo `FIREBASE_SETUP.md`
2. **Instale as dependências**: `npm install`
3. **Teste a integração**: `npm run dev`
4. **Consulte o guia de uso**: `FIREBASE_HOOK_GUIDE.md`

## 🔐 Segurança

### Regras do Firestore (importante!)

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

Isso garante que cada usuário só possa acessar seus próprios dados.

## 📞 Suporte

Se encontrar erros:

1. Verifique se as variáveis de `.env.local` estão corretas
2. Verifique o console do navegador (F12)
3. Verifique se o Firestore Database foi criado
4. Verifique as regras de segurança do Firestore
5. Consulte a documentação oficial do Firebase

---

**Status**: ✅ Integração completa e pronta para usar!
