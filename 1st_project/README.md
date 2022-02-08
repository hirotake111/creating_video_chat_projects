# Server

### Development environment

```bash
IMAGE="p2p_dev"
# build image
docker build -t $IMAGE -f Dockerfile-dev .

# run WebSocket development server
docker-compose up    # -> ✨ Listening on port 3001 ✨

# create client/.env.local and add the following:
# REACT_APP_SERVER_URL=http://localhost:3001

# run frontend development server
yarn dev:fe    # -> http://localhost:3000
```

### Production environment

You can just include "#BUILD" in your commit message and push it to your GitHub repo. Then GitHub Actions will create and push new one for you.

```bash
#
# Build image manually
#
IMAGE=<image name>

# build image
docker build -t $IMAGE .

# run production server
docker run -p 3000:3000 $IMAGE

# or, you can push it to your repo
docker push $IMAGE
```
