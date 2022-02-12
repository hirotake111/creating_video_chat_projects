FROM node:14.17.6 AS builder

#
# Build stage
#
WORKDIR /app
# Copy json files
COPY *.json /app/
# Install dev modules
RUN yarn install
# Copy codebase
COPY src /app/src
# Transpile TypeScript files into JavaScript
RUN yarn build


#
# Production stage
#
FROM node:14.17.6
# Mark as production
ENV NODE_ENV=production
WORKDIR /app
# Add user
RUN groupadd -r user && useradd --no-log-init -r -g user user
# Copy files
COPY package*.json ./
# Install modules
RUN yarn install --production
# Copy files from builder image to production image
COPY --from=builder /app/dist /app/dist
# COPY prisma /app/prisma
# Change user
USER user
# Expose port
EXPOSE 3000
# Set the start-up command
CMD [ "node", "dist/index.js" ]
