# 🎮 OX (Tic‑Tac‑Toe) — React + Node.js + OAuth 2.0 + Prisma

## 👩‍💻 ผู้จัดทำ
- ผู้พัฒนา: Banphot Thiwato
- การทดสอบเขียนเกม XO

## 🚀 วิธีใช้งานย่อ
1) Backend: `cd backend && pnpm i && copy .env.example .env && pnpm prisma:generate && pnpm prisma:migrate --name init && pnpm dev`
2) Frontend: เปิดอีกหน้าต่าง `cd frontend && pnpm i && pnpm dev`
3) เปิดเว็บที่ http://localhost:5173 แล้ว Sign in with Google

## 🆕่ เพิ่มเติม
- เลือกผู้เริ่ม: `X` (ผู้เล่น) หรือ `O` (บอท)
- เลือกระดับความยากของบอท: `easy` (เดินสุ่ม) หรือ `hard` (Minimax)
