# Server

### Build Docker image for server

```bash
IMAGE="video_1st_server"
# development
docker build -t $IMAGE -f Dockerfile-dev .
# production
docker build -t $IMAGE .
```

### Client side command line

```bash
cd client
# install modules
yarn
# run dev server
yarn dev
# transpile code
yarn build
```
