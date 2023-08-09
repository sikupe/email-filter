FROM node:latest as build
WORKDIR /app
COPY . /app
RUN cd /app
RUN npm i --development
RUN npm run build

FROM node:latest as prod
WORKDIR /app
COPY --from=build /app/dist /app/dist
COPY res /app/res
COPY package.json /app/package.json
RUN npm i --omit=dev
RUN useradd nonpriv
USER nonpriv
ENTRYPOINT ["node", "dist/main.js"]
