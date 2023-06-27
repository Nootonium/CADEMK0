# syntax = docker/dockerfile:1

# Adjust NODE_VERSION as desired
ARG NODE_VERSION=18.16.0
FROM node:${NODE_VERSION}-slim as base

LABEL fly_launch_runtime="Node.js"

# Node.js app lives here
WORKDIR /app

# Throw-away build stage to reduce size of final image
FROM base as build

# Install packages needed to build node modules
RUN apt-get update -qq && \
    apt-get install -y python-is-python3 pkg-config build-essential 

# Install all dependencies
COPY --chown=node:node package-lock.json package.json ./
RUN npm ci 

# Copy application code
COPY --chown=node:node . .

# Transpile TypeScript to JavaScript
RUN npm run build

ENV NODE_ENV=production

# Remove development dependencies
RUN npm prune --production


# Final stage for app image
FROM base

# Copy node modules and built application from previous stage
COPY --from=build /app/node_modules /app/node_modules
COPY --from=build /app/dist /app/dist
COPY --from=build /app/package.json /app/package.json

# Start the server by default, this can be overwritten at runtime
EXPOSE 3000
CMD [ "npm", "run", "start" ]
