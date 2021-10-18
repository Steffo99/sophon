FROM node:16.11.1-bullseye
LABEL maintainer="Stefano Pigozzi <me@steffo.eu>"

# Set the base workdir
WORKDIR /usr/src/app

# Copy the yarn files
COPY package.json ./package.json
COPY yarn.lock    ./yarn.lock

# Install the package
RUN yarn install

# Copy the rest of the project into the container
COPY . .

# Start the serve server
ENTRYPOINT ["yarn", "run", "serve"]
