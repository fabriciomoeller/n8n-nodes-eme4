#!/bin/bash
set -e

# Verifica se o rimraf está instalado globalmente
echo "Checking for rimraf..."
if ! npm list -g rimraf >/dev/null 2>&1; then
    echo "Installing rimraf globally..."
    npm install -g rimraf
fi

# Obtém o nome do pacote do package.json
echo "Getting package name from package.json..."
PACKAGE_NAME=$(node -p "require('./package.json').name")

if [ -z "$PACKAGE_NAME" ]; then
    echo "Error: Could not determine package name from package.json."
    exit 1
fi

# Define os diretórios
LOCAL_DIR="$(pwd)/dist"
VOLUME_NAME="self-hosted-ai-starter-kit_n8n_storage"
CONTAINER_PATH="/custom/$PACKAGE_NAME"

echo "Detected package name: '$PACKAGE_NAME'"
echo "Local directory: '$LOCAL_DIR'"
echo "Container path: '$CONTAINER_PATH'"

# Build do projeto
echo "Building the node..."
pnpm run build

# Limpa container temporário anterior, se existir
echo "Cleaning up any existing temporary container..."
docker rm -f deploy-temp1 >/dev/null 2>&1 || true

# Cria container temporário
echo "Creating temporary container..."
docker run -dit --name deploy-temp1 -v "$VOLUME_NAME:/data" busybox

# Copia os arquivos para o volume
echo "Copying files into volume..."
docker cp "$LOCAL_DIR/." "deploy-temp1:/data$CONTAINER_PATH"

# Remove container temporário
echo "Cleaning up container..."
docker rm -f deploy-temp1

# Reinicia o container n8n
echo "Restarting n8n..."
docker container restart n8n

# Mostra os logs
echo "Deployment complete."
echo "Showing n8n logs (Press Ctrl+C to exit)..."
docker logs -f n8n
