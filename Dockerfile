FROM node:18-alpine
RUN mkdir -p /home/node
WORKDIR /home/node
#OJO NO HAY QUE COPIAR NODE_MUDU
# copiamos el header del codigo
COPY package*.json /home/node/
# instalamos npm
RUN npm install

# copiamos todo el codigos
COPY . .

#Compilamos el codigo
RUN npm run build
# exponemos el puerto dentro del docker con el del servidor
EXPOSE 5003

# iniciamos el servicio
CMD  ["node","/home/node/dist/main.js"]
