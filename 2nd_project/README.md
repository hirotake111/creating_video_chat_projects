# 2nd project

## Development set up

### Server (Express.js)

```bash
# Build development Docker image
IMAGE=video_dev
docker build -t $IMAGE -f ./Dockerfile-dev .
# Run development server
docker-compose up -d video_dev
```

### Client (Next.js)

```bash
cd client
yarn dev
```

## Deploy production

### Server (Express.js)

```bash
# Build development Docker image
IMAGE=<your docker image name>
docker build -t $IMAGE .
# Run production server (example)
docker run -p 3000:3000 $IMAGE
```

### Client (Next.js)

Simply [create a new Next.js project on Vercel](https://vercel.com/docs/concepts/projects/overview#creating-a-project)

(Root Directory should be **"2nd_project/client"**)
