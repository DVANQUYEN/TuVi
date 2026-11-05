# Sao Mệnh - Website Tử Vi Đẩu Số Việt Nam

Sao Mệnh là engine và website Tử Vi Đẩu Số (Zi Wei Dou Shu) chất lượng production dành cho thị trường Việt Nam. Dự án được xây dựng theo hướng engine-first: lõi tính toán là TypeScript thuần túy, không phụ thuộc framework, có thể chạy trên cả client và server.

## Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) với App Router
- **Ngôn ngữ**: TypeScript (strict mode)
- **Styling**: Tailwind CSS
- **Engine tử vi**: [iztro](https://github.com/SylarLong/iztro) v2.6.4
- **Validation**: Zod
- **Date/time**: dayjs
- **Testing**: Vitest + React Testing Library + jsdom
- **Linting**: ESLint 9 (flat config) + typescript-eslint
- **Formatting**: Prettier

## Cài đặt và chạy

### Yêu cầu

- Node.js >= 20
- npm >= 10

### Cài đặt dependencies

```bash
npm install
```

### Chạy development server

```bash
npm run dev
```

Mở [http://localhost:3000](http://localhost:3000) để xem kết quả.

### Build production

```bash
npm run build
```

## Scripts available

| Script                  | Mô tả                                  |
| ----------------------- | -------------------------------------- |
| `npm run dev`           | Chạy Next.js dev server                |
| `npm run build`         | Build ứng dụng production              |
| `npm run start`         | Chạy production server sau khi build   |
| `npm run lint`          | Chạy ESLint kiểm tra toàn bộ project   |
| `npm run lint:fix`      | Tự động fix lỗi ESLint có thể sửa được |
| `npm run format`        | Format code bằng Prettier              |
| `npm run format:check`  | Kiểm tra code đã được format chưa      |
| `npm run test`          | Chạy Vitest ở watch mode               |
| `npm run test:run`      | Chạy Vitest một lần                    |
| `npm run test:ui`       | Mở Vitest UI                           |
| `npm run test:coverage` | Chạy Vitest với coverage report        |
| `npm run typecheck`     | Kiểm tra TypeScript (không emit file)  |

## Cấu trúc thư mục

```
E:\Tuvi\
├── app/                          # Next.js App Router
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css
├── lib/
│   └── ziwei/                    # Engine tử vi (PURE TypeScript)
│       ├── index.ts              # Public barrel export
│       ├── types/                # TypeScript interfaces
│       ├── config/               # Hệ thống cấu hình
│       ├── data/                 # Bảng dữ liệu tĩnh
│       ├── utils/                # Hàm toán học
│       ├── adapters/             # 4 lớp adapter
│       ├── engine/               # ChartEngine implementation
│       └── __tests__/            # Tests
├── components/                   # React components
├── tests/                        # Integration/E2E tests
│   └── setup.ts                  # Vitest setup
├── docs/                         # Tài liệu
└── public/                       # Static assets
```

## Tài liệu tham khảo

- [docs/DECISIONS.md](./docs/DECISIONS.md) - Các quyết định kiến trúc trong quá trình phát triển
- [docs/FINAL-DECISIONS.md](./docs/FINAL-DECISIONS.md) - Quyết định cuối cùng và lý do

## Lưu ý

- Không sử dụng các tính năng chỉ chạy được trên Vercel để đảm bảo tương thích với Cloudflare Pages.
- Không commit secrets hoặc file `.env`. Project chỉ cung cấp `.env.example` làm template.
- Engine `lib/ziwei/` là pure TypeScript, không chứa logic UI hay framework-specific.
