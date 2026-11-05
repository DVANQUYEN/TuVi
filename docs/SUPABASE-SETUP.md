# Hướng dẫn Setup Supabase

Tài liệu này hướng dẫn tạo Supabase project và kết nối với website Sao Mệnh.

## 1. Tạo Supabase Project

1. Truy cập https://supabase.com
2. Sign up/Login
3. Click "New Project"
4. Điền thông tin:
   - Name: Sao Mệnh
   - Database Password: (lưu lại)
   - Region: Southeast Asia (Singapore)
5. Click "Create new project"

## 2. Lấy API Keys

1. Vào Project Settings → API
2. Copy:
   - Project URL → `NEXT_PUBLIC_SUPABASE_URL`
   - anon public key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - service_role key → `SUPABASE_SERVICE_ROLE_KEY`

> `SUPABASE_SERVICE_ROLE_KEY` chỉ được dùng ở server. Không đưa key này vào biến có tiền tố
> `NEXT_PUBLIC_` và không commit file `.env.local`.

## 3. Chạy Migration

### Cài đặt mới

1. Vào SQL Editor trong Supabase Dashboard
2. Copy nội dung từ `supabase/schema.sql`
3. Click "Run"

Hoặc dùng Supabase CLI:

```bash
supabase link --project-ref <your-project-ref>
supabase db push
```

Các file migration nằm trong `supabase/migrations/`.

### Cài đặt đã tồn tại (quan trọng)

Không chạy lại toàn bộ `supabase/schema.sql` trên database đã có dữ liệu: file này không
idempotent, các lệnh `CREATE TABLE`/`CREATE POLICY` có thể lỗi hoặc làm gián đoạn hệ thống.

Nếu website đã chạy trước khi có migration `003_current_charts.sql`, database có thể chưa có bảng
`public.current_charts`. Khi đó lá số hiện tại của người đã đăng nhập sẽ không được lưu hoặc khôi
phục sau khi đăng xuất/đăng nhập lại. Hãy áp dụng riêng migration này.

#### Cách 1: SQL Editor

1. Mở file `supabase/migrations/003_current_charts.sql`
2. Copy toàn bộ nội dung
3. Dán vào SQL Editor và bấm "Run"

#### Cách 2: Supabase CLI

```bash
supabase link --project-ref <your-project-ref>
supabase db push
```

`003_current_charts.sql` là idempotent nên có thể chạy lại an toàn.

#### Kiểm tra sau khi chạy

Chạy các câu lệnh sau trong SQL Editor:

```sql
-- Phải trả về public.current_charts (không phải null)
select to_regclass('public.current_charts') as current_charts_table;

-- Phải trả về true (RLS đã bật)
select relrowsecurity
from pg_class
where oid = 'public.current_charts'::regclass;

-- Phải có 4 policy cho select/insert/update/delete
select policyname, cmd
from pg_policies
where schemaname = 'public' and tablename = 'current_charts';
```

Nếu `current_charts_table` là `null`, migration chưa được áp dụng.

## 4. Cấu hình Environment Variables

Tạo file `.env.local` từ template:

```bash
copy .env.example .env.local
```

Điền các giá trị thực tế:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## 5. Cấu hình Authentication

Trong Supabase Dashboard → Authentication → Providers:

- Bật Email provider.
- Nếu muốn test đăng ký nhanh mà không cần xác nhận email, tắt "Confirm email" trong môi trường
  development.

## 6. Test

```bash
npm run dev
```

Truy cập http://localhost:3000/dang-nhap và test đăng ký/đăng nhập.

Sau khi đăng nhập:

- Hồ sơ lưu trên localStorage trước đó sẽ được migrate lên Supabase.
- Header hiển thị menu tài khoản với email và nút đăng xuất.
- Trang `/ho-so` có thể dùng dữ liệu Supabase cho các tính năng đồng bộ.

## 7. Kiểm tra dữ liệu

Trong Supabase Dashboard → Table Editor:

- `profiles`: được tạo tự động khi có user mới qua trigger `on_auth_user_created`.
- `charts`: hồ sơ lá số của từng user.
- `current_charts`: lá số hiện tại của mỗi user (một dòng/user, tách biệt với `charts`).
- `shares`: link chia sẻ công khai.

## Ghi chú bảo mật

- Row Level Security (RLS) đã được bật cho cả bốn bảng.
- Mỗi user chỉ đọc/ghi được `charts`, `profiles` và `current_charts` của mình.
- `shares` cho phép đọc công khai để phục vụ trang chia sẻ.
