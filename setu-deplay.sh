#!/bin/bash
set -e

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Função para logs coloridos
log_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

log_step() {
    echo -e "${BLUE}[STEP]${NC} $1"
}

# Configurações - Ajuste conforme seu ambiente
SERVIDOR="${SERVIDOR:-seu-servidor.com}"
USUARIO="${USUARIO:-seu-usuario}"
CAMINHO_REMOTO="${CAMINHO_REMOTO:-/caminho/para/projeto-n8n}"
COMPOSE_PROJECT_NAME="${COMPOSE_PROJECT_NAME:-projeto-n8n}"
SSH_KEY="${SSH_KEY:-~/.ssh/id_rsa}"

# Validação inicial
log_step "Validating environment..."

# Verifica se estamos no diretório correto (contém package.json)
if [ ! -f "package.json" ]; then
    log_error "package.json not found. Please run this script from the custom node directory."
    exit 1
fi

# Verifica se o rimraf está instalado globalmente
log_step "Checking for rimraf..."
if ! npm list -g rimraf >/dev/null 2>&1; then
    log_info "Installing rimraf globally..."
    npm install -g rimraf
fi

# Obtém o nome do pacote do package.json
log_step "Getting package name from package.json..."
PACKAGE_NAME=$(node -p "require('./package.json').name")

if [ -z "$PACKAGE_NAME" ]; then
    log_error "Could not determine package name from package.json."
    exit 1
fi

# Define os diretórios
LOCAL_DIR="$(pwd)/dist"
VOLUME_NAME="${COMPOSE_PROJECT_NAME}_n8n_storage"
CONTAINER_PATH="/home/node/.n8n/custom/nodes/$PACKAGE_NAME"

log_info "Detected package name: '$PACKAGE_NAME'"
log_info "Local directory: '$LOCAL_DIR'"
log_info "Container path: '$CONTAINER_PATH'"
log_info "Target server: '$SERVIDOR'"

# Confirma se o usuário quer continuar
echo ""
read -p "Continue with deployment? (y/N): " -n 1 -r
echo ""
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    log_warning "Deployment cancelled by user."
    exit 0
fi

# Build do projeto
log_step "Building the node..."
if [ -f "pnpm-lock.yaml" ]; then
    pnpm run build
elif [ -f "yarn.lock" ]; then
    yarn build
else
    npm run build
fi

if [ ! -d "$LOCAL_DIR" ]; then
    log_error "Build directory '$LOCAL_DIR' not found. Build may have failed."
    exit 1
fi

# Cria um tarball temporário para transferência
log_step "Creating deployment package..."
TEMP_DIR=$(mktemp -d)
TARBALL="$TEMP_DIR/node-deploy.tar.gz"

# Cria o tarball com os arquivos dist
tar -czf "$TARBALL" -C "$LOCAL_DIR" .

log_info "Package created: $(du -h "$TARBALL" | cut -f1)"

# Função para executar comandos no servidor
execute_remote() {
    ssh -i "$SSH_KEY" "$USUARIO@$SERVIDOR" "$1"
}

# Função para copiar arquivos para o servidor
copy_to_server() {
    scp -i "$SSH_KEY" "$1" "$USUARIO@$SERVIDOR:$2"
}

# Copia o tarball para o servidor
log_step "Copying package to server..."
copy_to_server "$TARBALL" "/tmp/node-deploy.tar.gz"

# Script para executar no servidor
REMOTE_SCRIPT="
set -e

# Cores para output remoto
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

log_remote() {
    echo -e \"\${GREEN}[REMOTE]\${NC} \$1\"
}

log_remote 'Starting deployment on server...'

# Navega para o diretório do projeto
cd '$CAMINHO_REMOTO'

# Verifica se o docker-compose existe
if [ ! -f 'docker-compose.yml' ]; then
    echo -e \"\${RED}[ERROR]\${NC} docker-compose.yml not found in $CAMINHO_REMOTO\"
    exit 1
fi

# Cria backup do estado atual
log_remote 'Creating backup of current state...'
BACKUP_DIR=\"./backups/\$(date +%Y%m%d_%H%M%S)\"
mkdir -p \"\$BACKUP_DIR\"

# Backup do volume via container temporário
log_remote 'Backing up current nodes...'
docker run --rm -v \"${VOLUME_NAME}:/data\" -v \"\$(pwd)/\$BACKUP_DIR:/backup\" busybox tar -czf \"/backup/nodes-backup.tar.gz\" -C /data/home/node/.n8n/custom/nodes . 2>/dev/null || log_remote 'No existing nodes to backup'

# Limpa container temporário anterior, se existir
log_remote 'Cleaning up any existing temporary container...'
docker rm -f deploy-temp-prod >/dev/null 2>&1 || true

# Cria container temporário
log_remote 'Creating temporary container...'
docker run -dit --name deploy-temp-prod -v \"${VOLUME_NAME}:/data\" busybox

# Cria diretório no container se não existir
log_remote 'Ensuring directory structure...'
docker exec deploy-temp-prod mkdir -p \"/data/home/node/.n8n/custom/nodes/$PACKAGE_NAME\"

# Remove versão anterior do nó
log_remote 'Removing previous version of node...'
docker exec deploy-temp-prod rm -rf \"/data/home/node/.n8n/custom/nodes/$PACKAGE_NAME\" 2>/dev/null || true
docker exec deploy-temp-prod mkdir -p \"/data/home/node/.n8n/custom/nodes/$PACKAGE_NAME\"

# Extrai e copia os novos arquivos
log_remote 'Extracting and copying new files...'
docker cp /tmp/node-deploy.tar.gz deploy-temp-prod:/tmp/
docker exec deploy-temp-prod tar -xzf /tmp/node-deploy.tar.gz -C \"/data/home/node/.n8n/custom/nodes/$PACKAGE_NAME\"

# Remove container temporário
log_remote 'Cleaning up temporary container...'
docker rm -f deploy-temp-prod

# Verifica se os arquivos foram copiados
log_remote 'Verifying file structure...'
docker run --rm -v \"${VOLUME_NAME}:/data\" busybox ls -la \"/data/home/node/.n8n/custom/nodes/$PACKAGE_NAME\"

# Reinicia os serviços do n8n
log_remote 'Restarting n8n services...'
docker-compose restart n8n n8n-worker-1 n8n-worker-2

# Aguarda um pouco para os serviços iniciarem
log_remote 'Waiting for services to start...'
sleep 15

# Verifica se os serviços estão rodando
log_remote 'Checking service status...'
docker-compose ps

# Cleanup
rm -f /tmp/node-deploy.tar.gz

log_remote 'Deployment completed successfully!'
"

# Executa o script no servidor
log_step "Executing deployment on server..."
execute_remote "$REMOTE_SCRIPT"

# Cleanup local
log_step "Cleaning up local files..."
rm -rf "$TEMP_DIR"

# Mostra os logs finais
log_step "Showing n8n logs (Press Ctrl+C to exit)..."
echo ""
log_info "Deployment completed successfully!"
log_info "Checking n8n logs for any issues..."

# Mostra logs do n8n por alguns segundos
execute_remote "cd '$CAMINHO_REMOTO' && docker-compose logs --tail=50 n8n"

echo ""
log_info "✅ Deployment finished!"
log_info "🌐 Your custom node '$PACKAGE_NAME' should now be available in n8n"
log_info "🔍 Check the n8n interface to verify the node is loaded correctly"

# Opcional: Abrir logs em tempo real
echo ""
read -p "Do you want to monitor n8n logs in real-time? (y/N): " -n 1 -r
echo ""
if [[ $REPLY =~ ^[Yy]$ ]]; then
    log_info "Monitoring logs (Press Ctrl+C to exit)..."
    execute_remote "cd '$CAMINHO_REMOTO' && docker-compose logs -f n8n"
fi
