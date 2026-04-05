# Stage 1: Build
FROM node:20-alpine AS builder
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy source dan prisma schema
COPY . .

# Generate Prisma Client (Penting: agar folder src/generated/prisma terisi)
RUN npx prisma generate

# Build aplikasi menggunakan tsup (seperti yang kita buat tadi)
RUN npm run build

# Stage 2: Run
FROM node:20-alpine
WORKDIR /app

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
# Kita butuh folder generated prisma terbawa ke runtime
COPY --from=builder /app/src/generated ./src/generated
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/prisma.config.ts ./prisma.config.ts

EXPOSE 3000
CMD ["node", "dist/index.js"]