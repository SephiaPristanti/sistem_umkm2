#!/bin/bash

# Deployment script for Si-UMKM application
set -e

echo "🚀 Starting deployment process..."

# Configuration
IMAGE_NAME="si-umkm"
CONTAINER_NAME="si-umkm-app"
PORT="3000"
NETWORK_NAME="si-umkm-network"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Functions
log_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    log_error "Docker is not running. Please start Docker and try again."
    exit 1
fi

# Create network if it doesn't exist
if ! docker network ls | grep -q $NETWORK_NAME; then
    log_info "Creating Docker network: $NETWORK_NAME"
    docker network create $NETWORK_NAME
fi

# Stop and remove existing container
if docker ps -a | grep -q $CONTAINER_NAME; then
    log_info "Stopping existing container: $CONTAINER_NAME"
    docker stop $CONTAINER_NAME
    docker rm $CONTAINER_NAME
fi

# Remove old image
if docker images | grep -q $IMAGE_NAME; then
    log_info "Removing old image: $IMAGE_NAME"
    docker rmi $IMAGE_NAME || true
fi

# Build new image
log_info "Building Docker image: $IMAGE_NAME"
docker build -t $IMAGE_NAME .

# Run new container
log_info "Starting new container: $CONTAINER_NAME"
docker run -d \
    --name $CONTAINER_NAME \
    --network $NETWORK_NAME \
    -p $PORT:$PORT \
    --env-file .env.production \
    --restart unless-stopped \
    --health-cmd="curl -f http://localhost:$PORT/api/health || exit 1" \
    --health-interval=30s \
    --health-timeout=3s \
    --health-retries=3 \
    $IMAGE_NAME

# Wait for container to be healthy
log_info "Waiting for container to be healthy..."
timeout=60
counter=0
while [ $counter -lt $timeout ]; do
    if docker inspect --format='{{.State.Health.Status}}' $CONTAINER_NAME | grep -q "healthy"; then
        log_info "Container is healthy!"
        break
    fi
    sleep 2
    counter=$((counter + 2))
done

if [ $counter -ge $timeout ]; then
    log_error "Container failed to become healthy within $timeout seconds"
    docker logs $CONTAINER_NAME
    exit 1
fi

# Clean up unused images
log_info "Cleaning up unused Docker images..."
docker image prune -f

log_info "✅ Deployment completed successfully!"
log_info "Application is running at: http://localhost:$PORT"
