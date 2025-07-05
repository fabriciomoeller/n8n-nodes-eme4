#!/bin/bash
# Script para configuração inicial do ambiente de deploy

set -e

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

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

echo "🚀 N8N Custom Node Deploy Setup"
echo "================================"
echo ""

# Verifica se já existe configuração
if [ -f ".env.deploy" ]; then
    log_warning "Configuration file .env.deploy already exists"
    read -p "Do you want to recreate it? (y/N): " -n 1 -r
    echo ""
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        log_info "Setup cancelled. Using existing configuration."
        exit 0
    fi
fi

# Coleta informações do usuário
log_step "Collecting deployment configuration..."

read -p "Server hostname or IP: " SERVIDOR
read -p "SSH username: " USUARIO
read -p "Remote project path: " CAMINHO_REMOTO
read -p "Docker compose project name (default: projeto-n8n): " COMPOSE_PROJECT_NAME
COMPOSE_PROJECT_NAME=${COMPOSE_PROJECT_NAME:-projeto-n8n}

read -p "SSH key path (default: ~/.ssh/id_rsa): " SSH_KEY
SSH_KEY=${SSH_KEY:-~/.ssh/id_rsa}

# Cria arquivo de configuração
log_step "Creating configuration file..."

cat > .env.deploy << EOF
# Configuração para Deploy de Nós Customizados N8N
# Gerado automaticamente em $(date)

# Configurações do servidor
SERVIDOR=$SERVIDOR
USUARIO=$USUARIO
CAMINHO_REMOTO=$CAMINHO_REMOTO

# Nome do projeto docker-compose (usado para nomes de volumes)
COMPOSE_PROJECT_NAME=$COMPOSE_PROJECT_NAME

# Chave SSH para acesso ao servidor
SSH_KEY=$SSH_KEY

# Configurações opcionais
BACKUP_RETENTION_DAYS=7
DEPLOYMENT_TIMEOUT=300

# Configurações de notificação (opcional)
SLACK_WEBHOOK_URL=
TEAMS_WEBHOOK_URL=
EMAIL_NOTIFICATION=false
EOF

log_info "Configuration file created: .env.deploy"

# Testa conectividade SSH
log_step "Testing SSH connectivity..."
if ssh -i "$SSH_KEY" -o BatchMode=yes -o ConnectTimeout=10 "$USUARIO@$SERVIDOR" exit 2>/dev/null; then
    log_info "✅ SSH connection successful"
else
    log_error "❌ SSH connection failed"
    log_warning "Please check your SSH key and server configuration"
    
    echo ""
    echo "Common solutions:"
    echo "1. Copy your SSH key to the server:"
    echo "   ssh-copy-id -i $SSH_KEY $USUARIO@$SERVIDOR"
    echo ""
    echo "2. Or add your key to the server manually:"
    echo "   ssh $USUARIO@$SERVIDOR 'mkdir -p ~/.ssh && cat >> ~/.ssh/authorized_keys' < ${SSH_KEY}.pub"
    echo ""
fi

# Verifica se o diretório remoto existe
log_step "Checking remote directory..."
if ssh -i "$SSH_KEY" -o BatchMode=yes "$USUARIO@$SERVIDOR" "test -d '$CAMINHO_REMOTO'" 2>/dev/null; then
    log_info "✅ Remote directory exists"
    
    # Verifica se existe docker-compose.yml
    if ssh -i "$SSH_KEY" "$USUARIO@$SERVIDOR" "test -f '$CAMINHO_REMOTO/docker-compose.yml'" 2>/dev/null; then
        log_info "✅ docker-compose.yml found"
    else
        log_warning "⚠️  docker-compose.yml not found in remote directory"
    fi
else
    log_error "❌ Remote directory does not exist: $CAMINHO_REMOTO"
    log_warning "Please create the directory or check the path"
fi

# Verifica se o Docker está rodando no servidor
log_step "Checking Docker on server..."
if ssh -i "$SSH_KEY" "$USUARIO@$SERVIDOR" "docker --version" >/dev/null 2>&1; then
    log_info "✅ Docker is available"
    
    # Verifica docker-compose
    if ssh -i "$SSH_KEY" "$USUARIO@$SERVIDOR" "docker-compose --version" >/dev/null 2>&1; then
        log_info "✅ docker-compose is available"
    else
        log_warning "⚠️  docker-compose not found, checking for docker compose..."
        if ssh -i "$SSH_KEY" "$USUARIO@$SERVIDOR" "docker compose version" >/dev/null 2>&1; then
            log_info "✅ docker compose (v2) is available"
        else
            log_error "❌ Neither docker-compose nor docker compose found"
        fi
    fi
else
    log_error "❌ Docker is not available on the server"
fi

# Cria scripts auxiliares
log_step "Creating helper scripts..."

# Script para fazer deploy
cat > deploy.sh << 'EOF'
#!/bin/bash
# Load configuration
if [ -f ".env.deploy" ]; then
    source .env.deploy
else
    echo "Error: .env.deploy file not found. Run setup.sh first."
    exit 1
fi

# Execute the deployment script with loaded configuration
export SERVIDOR USUARIO CAMINHO_REMOTO COMPOSE_PROJECT_NAME SSH_KEY
exec ./deploy-production.sh
EOF

chmod +x deploy.sh

# Script para verificar status
cat > check-status.sh << 'EOF'
#!/bin/bash
# Load configuration
if [ -f ".env.deploy" ]; then
    source .env.deploy
else
    echo "Error: .env.deploy file not found. Run setup.sh first."
    exit 1
fi

echo "Checking N8N status on $SERVIDOR..."
ssh -i "$SSH_KEY" "$USUARIO@$SERVIDOR" "cd '$CAMINHO_REMOTO' && docker-compose ps"
EOF

chmod +x check-status.sh

# Script para logs
cat > logs.sh << 'EOF'
#!/bin/bash
# Load configuration
if [ -f ".env.deploy" ]; then
    source .env.deploy
else
    echo "Error: .env.deploy file not found. Run setup.sh first."
    exit 1
fi

echo "Showing N8N logs from $SERVIDOR..."
ssh -i "$SSH_KEY" "$USUARIO@$SERVIDOR" "cd '$CAMINHO_REMOTO' && docker-compose logs -f n8n"
EOF

chmod +x logs.sh

log_info "Helper scripts created:"
log_info "  ./deploy.sh - Deploy your custom nodes"
log_info "  ./check-status.sh - Check N8N status"
log_info "  ./logs.sh - View N8N logs"

echo ""
log_info "🎉 Setup completed successfully!"
echo ""
echo "Next steps:"
echo "1. Test the connection: ./check-status.sh"
echo "2. Deploy your nodes: ./deploy.sh"
echo "3. Monitor logs: ./logs.sh"
echo ""
echo "Configuration saved in .env.deploy"
echo "You can edit this file to adjust settings as needed."
