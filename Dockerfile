FROM node:20-alpine

WORKDIR /app

# Copy server package files and install dependencies
COPY server/package*.json ./
RUN npm install --production

# Copy server source
COPY server/ .

# HF Spaces requires port 7860
ENV PORT=7860
EXPOSE 7860

CMD ["node", "index.js"]
