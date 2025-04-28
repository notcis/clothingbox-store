# Next.js + Prisma + MySQL + TypeScript: สรุปการใช้งานและคำสั่งสำคัญ

---

## 1. การติดตั้งเบื้องต้น

- ติดตั้ง Next.js + TypeScript:
  ```bash
  npx create-next-app@latest my-app --typescript
  cd my-app
  ```
- ติดตั้ง Prisma:
  ```bash
  npm install -D prisma @prisma/client
  ```
- เริ่มต้น Prisma:
  ```bash
  npx prisma init
  ```
  จะได้ไฟล์ `.env` และโฟลเดอร์ `prisma/`

## 2. การเชื่อมต่อ MySQL Database

ในไฟล์ `.env`:

```env
DATABASE_URL="mysql://username:password@host:port/dbname"
```

**ปัญหาที่เจอ:**

- ถ้า user ไม่มีสิทธิ์สร้าง shadow database จะ migrate ไม่ได้ ต้องแก้สิทธิ์ หรือสร้าง shadow database เอง
- หากถูกปฏิเสธการเข้าถึง (access denied) ให้ใช้ `GRANT` สิทธิ์ใหม่ให้ user

## 3. การตั้งค่า Prisma Client (TypeScript)

ใน `lib/prisma.ts`:

```typescript
import { PrismaClient } from "@prisma/client";

declare global {
  var prisma: PrismaClient | undefined;
}

export const prisma = global.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  global.prisma = prisma;
}

export default prisma;
```

## 4. ความแตกต่างระหว่างคำสั่ง Prisma

| คำสั่ง                               | ทำอะไร                                             | หมายเหตุ                         |
| :----------------------------------- | :------------------------------------------------- | :------------------------------- |
| `npx prisma migrate dev --name init` | สร้าง migration ไฟล์ และอัปเดตฐานข้อมูล            | เก็บประวัติ, ใช้ shadow database |
| `npx prisma db push`                 | Sync schema ไปฐานข้อมูลทันทีโดยไม่มีไฟล์ migration | เร็ว, ง่าย แต่ rollback ไม่ได้   |
| `npx prisma generate`                | สร้าง Prisma Client ใหม่จาก schema.prisma          | ต้องใช้หลังเปลี่ยน schema        |

## 5. การใช้งาน Prisma Client

ตัวอย่างการดึงข้อมูลใน Next.js App Router:

```typescript
import { prisma } from "@/lib/prisma";

export default async function UsersPage() {
  const users = await prisma.user.findMany();

  return (
    <div>
      <h1>Users</h1>
      <ul>
        {users.map((user) => (
          <li key={user.id}>
            {user.name} ({user.email})
          </li>
        ))}
      </ul>
    </div>
  );
}
```

## 6. หมายเหตุเพิ่มเติม

- ใน Development สามารถใช้ `npx prisma db push` เพื่อความรวดเร็ว
- ใน Production ต้องใช้ `migrate dev` + `migrate deploy`
- อย่าเปิดเผย `DATABASE_URL` แบบ plain text ต่อสาธารณะ

---

**สรุป:**

- ถ้าอยากได้ migration เก็บประวัติ -> `npx prisma migrate dev`
- ถ้าอยาก sync schema แบบเร็ว -> `npx prisma db push`
- เปลี่ยน schema เสร็จ ต้อง `npx prisma generate` ทุกครั้ง

**จบไฟล์** 🚀

เก็บ images เป็น JSON string
images: JSON.stringify([
"https://example.com/galaxys24-front.jpg",
"https://example.com/galaxys24-back.jpg",
"https://example.com/galaxys24-side.jpg",
]),

แปลงกลับเป็น Array
JSON.parse(product.images)

prisma seed data
npx tsx ./db/seed
