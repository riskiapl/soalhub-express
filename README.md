# SoalHub Express Backend

Backend API untuk layanan Soal Hub, dibangun menggunakan Node.js, Express.js, dan TypeScript. Proyek ini menggunakan standar modern ECMAScript Modules (ESM) untuk performa dan pengelolaan dependensi yang lebih baik.

## 🚀 Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js (v5.x)
- **Language**: TypeScript
- **Development Tools**: Nodemon, ts-node

## 🛠️ Prasyarat

Sebelum memulai, pastikan kamu sudah menginstal:

- Node.js (versi terbaru direkomendasikan)
- NPM (disertakan saat menginstal Node.js)

## 📦 Instalasi

1. Clone repositori ini:

   ```bash
   git clone https://github.com/username/soalhub-express.git
   cd soalhub-express
   ```

2. Instal dependensi:
   ```bash
   npm install
   ```

## ⌨️ Perintah (Scripts)

Gunakan perintah berikut untuk menjalankan atau membangun proyek:

| Perintah        | Deskripsi                                                               |
| --------------- | ----------------------------------------------------------------------- |
| `npm run dev`   | Menjalankan server dalam mode development dengan auto-reload (Nodemon). |
| `npm run build` | Mengompilasi kode TypeScript ke JavaScript di folder dist/.             |
| `npm start`     | Menjalankan aplikasi hasil build dari folder dist/index.js.             |

## 📂 Struktur Proyek

```
.
├── src/                # File sumber TypeScript
│   └── index.ts        # Entry point aplikasi
├── dist/               # Hasil kompilasi JavaScript (Generated)
├── package.json        # Konfigurasi npm dan dependensi
├── tsconfig.json       # Konfigurasi TypeScript
└── README.md
```

## 🔧 Konfigurasi TypeScript

Proyek ini menggunakan fitur verbatimModuleSyntax dan ES Modules. Jika kamu mengimpor tipe data dari Express, pastikan menggunakan type-only import:

```typescript
import express, { type Request, type Response } from "express";
```

## 📝 Catatan Pengembangan

- Aplikasi berjalan secara default di port 3000 (atau sesuaikan di index.ts).
- Karena menggunakan `"type": "module"`, pastikan semua konfigurasi library mendukung ESM.

---

**Author:** Riski Agung  
**License:** ISC
