$imageName = "quark-backend"
$envFile = "backend/.env"

# 1. Stop and remove containers based on image
$containers = docker ps -a --filter "ancestor=$imageName" -q

if ($containers) {
    Write-Host "Stopping containers: $containers"
    docker stop $containers | Out-Null

    Write-Host "Removing containers: $containers"
    docker rm $containers | Out-Null
} else {
    Write-Host "No containers to stop/remove for image $imageName"
}

# 2. Build the image
Write-Host "Building image $imageName ..."
docker build -t $imageName -f backend/Dockerfile .

# 3. Run the container
Write-Host "Running new container ..."
docker run -p 8080:8080 --env-file $envFile $imageName