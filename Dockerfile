FROM mcr.microsoft.com/playwright:focal
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install
COPY screenshooter.ts ./
ENV SCREENSHOT_URL=http://host.docker.internal:3000
CMD ["yarn", "ts-node", "screenshooter.ts"]
