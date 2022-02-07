# Server

### Build Docker image for server

```bash
IMAGE="video_1st_server"
# development
docker build -t $IMAGE -f Dockerfile-dev .
# production
docker build -t $IMAGE .
```

### Start development environment

```bash
# run WebSocket development server
docker-compose up    # -> ✨ Listening on port 3001 ✨
# run frontend development server
cd client && yarn start
```

### Client side command line

```bash
cd client
# install modules
yarn
# run dev server
yarn start
# transpile code
yarn build
```
