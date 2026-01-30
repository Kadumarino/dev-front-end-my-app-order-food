# 🚀 Configuração do GitHub Pages

## ✅ O que foi configurado

1. **Workflow do GitHub Actions** ([.github/workflows/pages.yml](.github/workflows/pages.yml))
   - Build automático do projeto React
   - Deploy automático no GitHub Pages
   - Trigger em push para branches `master` ou `main`

2. **Vite Config** ([cardapio-react/vite.config.ts](cardapio-react/vite.config.ts))
   - Base path configurado para produção
   - Build otimizado

## 📝 Passos para ativar o GitHub Pages

### 1. Fazer push do código

```bash
git add .
git commit -m "Configure GitHub Pages deployment"
git push origin master
```

### 2. Configurar no GitHub

1. Acesse seu repositório no GitHub
2. Vá em **Settings** > **Pages**
3. Em **Source**, selecione:
   - **GitHub Actions** (não "Deploy from a branch")
4. Salve as configurações

### 3. Aguardar o Deploy

- O workflow será executado automaticamente
- Acompanhe em: **Actions** tab no GitHub
- Após conclusão, seu site estará disponível em:
  ```
  https://SEU-USUARIO.github.io/dev-front-end-my-app-order-food/
  ```

## 🔧 Estrutura de Deploy

```
┌─────────────────────────┐
│  Push para master/main  │
└────────────┬────────────┘
             │
             ▼
┌─────────────────────────┐
│  GitHub Actions Trigger │
└────────────┬────────────┘
             │
             ▼
┌─────────────────────────┐
│  Install Dependencies   │
│  (npm ci)               │
└────────────┬────────────┘
             │
             ▼
┌─────────────────────────┐
│  Build React App        │
│  (npm run build)        │
└────────────┬────────────┘
             │
             ▼
┌─────────────────────────┐
│  Deploy to GitHub Pages │
└────────────┬────────────┘
             │
             ▼
┌─────────────────────────┐
│  Site Live! 🎉          │
└─────────────────────────┘
```

## 🐛 Solução de Problemas

### Build falha
- Verifique se todas as dependências estão no `package.json`
- Execute `npm run build` localmente para testar

### 404 em recursos
- Verifique se o `base` no `vite.config.ts` está correto
- Deve ser: `/NOME-DO-REPOSITORIO/`

### Página não carrega
- Certifique-se que **GitHub Actions** está selecionado como source
- Verifique se o workflow completou com sucesso na aba Actions

## 🔄 Re-deploy

Para fazer um novo deploy, basta fazer push para master/main:

```bash
git add .
git commit -m "Update content"
git push origin master
```

O deploy acontecerá automaticamente!

## 📚 Recursos

- [GitHub Pages Documentation](https://docs.github.com/pages)
- [Vite Deployment Guide](https://vitejs.dev/guide/static-deploy.html)
- [GitHub Actions](https://docs.github.com/actions)
