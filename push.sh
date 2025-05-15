#!/bin/bash

# Carrega variáveis do .env
COMMIT_MESSAGE="init"
VERSION_TYPE=""
DEPLOY_PROD=false

# Parse dos argumentos
for arg in "$@"; do
  case $arg in
    --commit=*)
      COMMIT_MESSAGE="${arg#*=}"
      shift
      ;;
    --version=*)
      VERSION_TYPE="${arg#*=}"
      shift
      ;;
    --prod)
      DEPLOY_PROD=true
      shift
      ;;
    *)
      ;;
  esac
done

# Se foi passado um tipo de versão, atualiza o package.json
if [[ "$VERSION_TYPE" =~ ^(patch|minor|major)$ ]]; then
  echo "Atualizando versão ($VERSION_TYPE)..."
  npm version $VERSION_TYPE --no-git-tag-version
fi

# Commit e push
git add .
git commit -m "$COMMIT_MESSAGE"
git push

# Se for deploy de produção
if [ "$DEPLOY_PROD" = true ]; then
  echo "Fazendo deploy de produção..."
  fly deploy
fi

# Se foi passado um tipo de versão, envia tags
if [[ "$VERSION_TYPE" =~ ^(patch|minor|major)$ ]]; then
  echo "Enviando tag da nova versão..."
  git push --tags
fi



# Apenas commit normal
# bash push.sh --commit="ajuste no layout"

# Commit com incremento de versão patch 0.0.1
# bash push.sh --commit="nova funcionalidade" --version=patch

# Commit com incremento minor 0.1.0
# bash push.sh --commit="vários ajustes" --version=minor

# Commit com incremento 1.0.0
# bash push.sh --commit="vários ajustes" --version=major

# Commit e enviar para o fly
# bash push.sh --commit="deploy v1" --version=minor --prod