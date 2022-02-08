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
# Copy client codebase
COPY client /app/client
# Transpile TypeScript files into JavaScript
RUN yarn build:fe


#
# Production stage
#
FROM node:14.12.0
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
COPY --from=builder /app/build /app/dist
# Copy client assets from builder to production image
COPY --from=builder /app/client/build /app/dist/public
# Change user
USER user
# Expose port
EXPOSE 3000
# Set the start-up command
CMD [ "node", "dist/index.js" ]