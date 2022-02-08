# Server

### Development environment

```bash
IMAGE="video_1st_server:0.0.1"
REACT_APP_SERVER_URL=localhost:3001
# build image
docker build -t $IMAGE -f Dockerfile-dev .

# run WebSocket development server
docker-compose up    # -> ✨ Listening on port 3001 ✨


# run frontend development server
yarn dev:fe    # -> http://localhost:3000
```

### Production environment

```bash
IMAGE=<image name>

# build image
docker build -t $IMAGE .

# run production server
docker run -p 3000:3000 $IMAGE

# or, you can push it to your repo
docker push $IMAGE
```
