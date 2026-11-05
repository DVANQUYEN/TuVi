# ? Quy?t �?nh Cu?i C�ng - S?n S�ng Cho Giai �o?n A

**Ng�y ch?t:** 03/11/2026  
**Tr?ng th�i:** ? �� DUY?T - S?n s�ng implement  
**T�i li?u tham kh?o:**

- `DECISIONS.md` - Chi ti?t 7 quy?t d?nh
- `BRIGHTNESS-COMPARISON.md` - So s�nh 103 � l?ch
- `ARCHITECTURE.md` - Ki?n tr�c chi ti?t (dang t?o)

---

## T�m T?t 7 Quy?t �?nh Cu?i C�ng

| #   | H?ng m?c          | Quy?t d?nh                                            | Ngu?n                   |
| --- | ----------------- | ----------------------------------------------------- | ----------------------- |
| 1   | Tru?ng ph�i       | **Nam ph�i** (m?c d?nh), cho ch?n Trung Ch�u/B?c ph�i | Ph? bi?n VN             |
| 2   | Gi? T�            | **23:00 = ng�y h�m sau**, ch? hi?n khi 23:00-01:00    | lasotuvi.ai.vn, Vienaoc |
| 3   | Th�ng nhu?n       | **Chia d�i 15/15**, c� c?nh b�o                       | Vienaoc, OpenFate       |
| 4   | Nam Can Chi       | **M�ng 1 T?t**, cho ch?n L?p Xu�n                     | T�n Bi�n, Vienaoc       |
| 5   | Tu?n/Tri?t        | **Kh�ng ph�n bi?t ch�nh/ph�**, hi?n th? c? 2 cung     | �ang nghi�n c?u         |
| 6   | �? s�ng           | **D�ng b?ng T�n Bi�n 1956 (5 m?c)** cho c? data & UI  | T�n Bi�n, tr. 33-38     |
| 7   | Gi? m?t tr?i th?t | **M?c d?nh T?T**, cho ch?n trong advanced             | lasotuvi.ai.vn          |

---

## ? Quy?t �?nh Quan Tr?ng: B?ng �? S�ng

### V?n d?

- iztro c� 7 m?c, T? Vi Vi?t Nam (T�n Bi�n) c� 5 m?c
- 103/168 � l?ch nhau (61%)
- M?t s? sao l?ch to�n b?: Thi�n Co (12/12), T? Vi (10/12), Th?t S�t (10/12)

### Quy?t d?nh cu?i c�ng

**D�ng b?ng T? Vi �?u S? T�n Bi�n (1956) - 5 m?c cho c? Data v� UI**

**L� do:**

1. ? Ngu?n Vi?t Nam r� r�ng, s�ch c� uy t�n (1956)
2. ? Ph� h?p v?i th? tru?ng m?c ti�u (ngu?i Vi?t Nam)
3. ? �on gi?n h�a ki?n tr�c (kh�ng c?n quy d?i 7?5 cho ch�nh tinh)
4. ? iztro ch? d�ng cho an sao (v? tr�), override d? s�ng b?ng T�n Bi�n

**C�ch implement:**

- **Data:** Luu 5 m?c t? T�n Bi�n (`'mieu' | 'vuong' | 'dac' | 'binh' | 'ham'`)
- **UI:** Hi?n th? 5 m?c
- **iztro:** Ch? d�ng d? an sao (v? tr� 14 ch�nh tinh, ph? tinh), KH�NG d�ng d? s�ng iztro cho ch�nh tinh
- **Fallback:** Ch? d�ng quy d?i 7?5 cho ph? tinh (n?u iztro tr? v? d? s�ng)

### B?ng quy d?i 7?5 cho ph? tinh (fallback)

```typescript
const IZTRO_TO_VIET_MAP = {
  'Mi?u': 'Mi?u', // iztro ? Vi?t
  'Vu?ng': 'Vu?ng',
  '�?c': '�?c',
  'L?i': '�?c', // ?? Quy?t d?nh: L?i ? �?c (g?n nh?t v? ng? nghia)
  'B�nh': 'B�nh',
  'B?t': 'H�m', // ?? Quy?t d?nh: B?t ? H�m (g?n nh?t v? ng? nghia)
  'H�m': 'H�m',
};
```

---

## ? Ngu?n Golden Standard �� Duy?t

**3 ngu?n d?i chi?u d? l?y 30-100 l� s? m?u:**

1. **lasotuvi.ai.vn** - Hi?n d?i, cho ch?n m�i gi? GMT+7
2. **lyso.vn** - L�u d?i, c� di?n d�n lu?n gi?i
3. **tracuulasotuvi.com** - D?n ngu?n T? Vi To�n Thu

**C�ch s? d?ng:**

- L?y 30-100 l� s? m?u t? 3 ngu?n
- Ph? c�c ca bi�n: nam l?ch (1985, 2007, 2033), th�ng nhu?n, gi? T�, l?ch s?
- So s�nh t?ng tru?ng v?i engine "Sao M?nh"
- Ghi nh?n "expected diff" cho c�c ng�y l?ch d� bi?t

---

## ??? Ki?n Tr�c �� Thi?t K?

### C?u tr�c thu m?c `lib/ziwei/`

```
lib/ziwei/
+-- index.ts                          # Public barrel export
+-- types/                            # TypeScript interfaces
�   +-- enums.ts                      # Can, Chi, Ngu H�nh, 5 m?c d? s�ng
�   +-- input.ts                      # BirthInfo, UserPreferences
�   +-- config.ts                     # ZiweiConfig, ResolvedZiweiConfig
�   +-- chart.ts                      # ZiweiChart, Palace, Star, Period
�   +-- audit.ts                      # AuditTrail, ChartWarning
�   +-- errors.ts                     # ZiweiError
�   +-- engine.ts                     # ChartEngine interface
+-- config/                           # H? th?ng c?u h�nh
�   +-- default-config.ts             # 7 quy?t d?nh d� ch?t
�   +-- schema.ts                     # Zod validation
�   +-- config-resolver.ts            # Merge default + user override
+-- data/                             # B?ng d? li?u tinh
�   +-- brightness-tan-bien.ts        # 14 ch�nh tinh � 12 cung (T�n Bi�n 1956)
�   +-- brightness-fallback-map.ts    # Quy d?i 7?5 cho ph? tinh
�   +-- vietnam-timezones.ts          # L?ch s? m�i gi? + 63 t?nh th�nh
�   +-- star-metadata.ts              # Thu?c t�nh sao
�   +-- palace-metadata.ts            # 12 cung ch?c nang
�   +-- stems-branches.ts             # 10 Can, 12 Chi, N?p �m
+-- utils/                            # H�m to�n h?c thu?n t�y
�   +-- equation-of-time.ts           # Phuong tr�nh th?i gian
�   +-- ho-ngoc-duc-lunar.ts          # L?ch �m H? Ng?c �?c (UTC+7)
�   +-- solar-terms.ts                # Ti?t L?p Xu�n
�   +-- can-chi.ts                    # T�nh Can Chi 4 tr?
�   +-- tuan-triet.ts                 # T�nh Tu?n/Tri?t 2 cung
�   +-- cache-key.ts                  # Sinh kh�a cache
+-- adapters/                         # 4 l?p adapter
�   +-- true-solar-time.adapter.ts    # L?p 1: Gi? m?t tr?i th?t
�   +-- vietnamese-calendar.adapter.ts# L?p 2: L?ch �m UTC+7
�   +-- iztro-engine.adapter.ts       # L?p 3: Wrap iztro
�   +-- vietnamese-chart.decorator.ts # L?p 4: Override d? s�ng, Tu?n/Tri?t
+-- engine/                           # �i?u ph?i ch�nh
�   +-- sao-menh.engine.ts            # ChartEngine implementation
�   +-- chart-cache.ts                # LRU cache
+-- __tests__/                        # Tests
    +-- unit/                         # Unit tests
    +-- adapters/                     # Adapter tests
    +-- property/                     # Property-based tests
    +-- golden/                       # Golden tests
    �   +-- fixtures/                 # 30-100 l� s? m?u
    +-- helpers/                      # Test utilities
```

### Lu?ng d? li?u m?t chi?u

```
BirthInfo + UserPreferences
  ?
[Config & Validation Layer] - resolveConfig()
  ?
[Layer 1: TrueSolarTimeAdapter] - Hi?u ch?nh m�i gi? l?ch s? + gi? m?t tr?i
  ?
[Layer 2: VietnameseCalendarAdapter] - �?i Duong?�m UTC+7, gi? T�, th�ng nhu?n
  ?
[Layer 3: IztroEngineAdapter] - G?i iztro.byLunar() (KH�NG d�ng bySolar)
  ?
[Layer 4: VietnameseChartDecorator] - Override d? s�ng T�n Bi�n, g?n Tu?n/Tri?t
  ?
ZiweiChart (immutable, serializable JSON)
  ?
UI / Canvas / LocalStorage
```

### Quy?t d?nh ki?n tr�c quan tr?ng

1. **G?i iztro qua c?ng �m l?ch (`byLunar`) thay v� Duong l?ch (`bySolar`)**
   - L� do: iztro d�ng l?ch Trung Qu?c (UTC+8), s? sai cho ng�y l?ch Vi?t-Trung
   - C�ch l�m: T? d?i Duong?�m theo UTC+7 tru?c, r?i truy?n v�o `byLunar`

2. **B?ng d? s�ng 5 m?c xuy�n su?t Data & UI**
   - Luu tr?c ti?p 5 m?c t? T�n Bi�n
   - Kh�ng luu 7 m?c cho ch�nh tinh
   - Ch? d�ng quy d?i 7?5 cho ph? tinh (fallback)

3. **Tu?n/Tri?t l� thu?c t�nh c?p Cung + d?i tu?ng c?u n?i**
   - Kh�ng coi l� 1 sao don l? trong m?ng `stars`
   - T�nh d?c l?p b?ng to�n h?c L?c Gi�p
   - G?n v�o c? 2 cung li?n k? (`palace.hasTuan`, `palace.hasTriet`)
   - Luu c?p �?a Chi ? c?p `ZiweiChart.tuanTriet` d? UI v? c?u n?i

4. **Strategy Pattern qua `ChartEngine` Interface**
   - UI kh�ng bi?t d?n iztro
   - D? d�ng c?m th�m engine B?c Ph�i sau n�y
   - Hi?n t?i: `NamPhaiChartEngine` (v� `TrungChauChartEngine` qua config)

---

## ?? K? ho?ch Implement Giai �o?n A

### Tu?n 1-2: Setup + Adapters

#### Task 1: Setup project structure (2 ng�y)

- [ ] Kh?i t?o Next.js App Router + TypeScript
- [ ] C�i d?t iztro@2.6.4, zod, dayjs
- [ ] T?o c?u tr�c thu m?c `lib/ziwei/`
- [ ] Setup Vitest/Jest, ESLint, Prettier
- [ ] T?o `tsconfig.json` v?i strict mode

**Files:** `package.json`, `tsconfig.json`, `vitest.config.ts`, `.eslintrc.js`

#### Task 2: Define TypeScript interfaces (2 ng�y)

- [ ] `types/enums.ts` - Can, Chi, Ngu H�nh, 5 m?c d? s�ng
- [ ] `types/input.ts` - BirthInfo, UserPreferences
- [ ] `types/config.ts` - ZiweiConfig, ResolvedZiweiConfig
- [ ] `types/chart.ts` - ZiweiChart, Palace, Star, Period
- [ ] `types/audit.ts` - AuditTrail, ChartWarning
- [ ] `types/errors.ts` - ZiweiError
- [ ] `types/engine.ts` - ChartEngine interface

**Acceptance:** TypeScript compile th�nh c�ng, kh�ng l?i type

#### Task 3: Config system (1 ng�y)

- [ ] `config/default-config.ts` - 7 quy?t d?nh d� ch?t
- [ ] `config/schema.ts` - Zod validation
- [ ] `config/config-resolver.ts` - Merge default + user override

**Acceptance:** Test pass cho merge config

#### Task 4: Data files - B?ng d? s�ng T�n Bi�n (2 ng�y)

- [ ] `data/brightness-tan-bien.ts` - 14 ch�nh tinh � 12 cung (T�n Bi�n 1956)
- [ ] `data/brightness-fallback-map.ts` - Quy d?i 7?5 cho ph? tinh
- [ ] `data/vietnam-timezones.ts` - L?ch s? m�i gi? + 63 t?nh th�nh
- [ ] `data/star-metadata.ts` - Thu?c t�nh sao (Ngu h�nh, �m Duong, t�n Vi?t)
- [ ] `data/palace-metadata.ts` - 12 cung ch?c nang
- [ ] `data/stems-branches.ts` - 10 Can, 12 Chi, N?p �m

**Acceptance:**

- B?ng T�n Bi�n d? 168 �, type-safe
- Test pass cho fallback mapping

#### Task 5: Utils - H�m to�n h?c (3 ng�y)

- [ ] `utils/equation-of-time.ts` - Phuong tr�nh th?i gian
- [ ] `utils/ho-ngoc-duc-lunar.ts` - L?ch �m H? Ng?c �?c (ho?c wrap @lichta/core)
- [ ] `utils/solar-terms.ts` - Ti?t L?p Xu�n
- [ ] `utils/can-chi.ts` - T�nh Can Chi 4 tr?
- [ ] `utils/tuan-triet.ts` - T�nh Tu?n/Tri?t 2 cung

**Acceptance:**

- Unit test pass cho t?ng h�m
- �?i chi?u v?i ngu?n H? Ng?c �?c

#### Task 6: 4 l?p Adapters (4 ng�y)

- [ ] `adapters/true-solar-time.adapter.ts` - L?p 1
- [ ] `adapters/vietnamese-calendar.adapter.ts` - L?p 2
- [ ] `adapters/iztro-engine.adapter.ts` - L?p 3
- [ ] `adapters/vietnamese-chart.decorator.ts` - L?p 4

**Acceptance:**

- Contract test pass cho t?ng adapter
- Integration test: Input ? Output d�ng schema

#### Task 7: Engine implementation (2 ng�y)

- [ ] `engine/sao-menh.engine.ts` - ChartEngine implementation
- [ ] `engine/chart-cache.ts` - LRU cache

**Acceptance:**

- End-to-end test: BirthInfo ? ZiweiChart
- Audit trail d?y d?

### Tu?n 3: Testing + Golden Fixtures

#### Task 8: Unit tests (2 ng�y)

- [ ] Test cho t?ng utils function
- [ ] Test cho t?ng adapter
- [ ] Test cho config resolver

**Acceptance:** Coverage > 90% cho adapter layer

#### Task 9: Property-based tests (1 ng�y)

- [ ] 12 cung lu�n d?, kh�ng tr�ng
- [ ] M?i sao xu?t hi?n d�ng 1 l?n
- [ ] T? H�a lu�n d? 4 sao theo can nam
- [ ] �?i x?ng nam/n?

**Acceptance:** 100+ random cases pass

#### Task 10: Golden fixtures (3 ng�y)

- [ ] L?y 30-100 l� s? m?u t? 3 ngu?n
- [ ] Ph?: nam l?ch (1985, 2007, 2033), th�ng nhu?n, gi? T�, l?ch s?
- [ ] So s�nh t?ng tru?ng v?i engine
- [ ] Ghi nh?n "expected diff" cho ng�y l?ch

**Acceptance:**

- 100% pass cho ng�y kh�ng l?ch
- 100% "expected diff" cho ng�y l?ch d� bi?t
- �? s�ng ch�nh tinh kh?p T�n Bi�n

### Acceptance Criteria Giai �o?n A

? **Engine:**

- [ ] 100% pass cho ng�y kh�ng l?ch l?ch
- [ ] 100% "expected diff" cho ng�y l?ch d� bi?t
- [ ] Property test pass (12 cung d?, kh�ng tr�ng sao, T? H�a d? 4)
- [ ] 30+ fixture v�ng kh?p ngu?n d?i chi?u
- [ ] �? s�ng ch�nh tinh kh?p b?ng T�n Bi�n

? **Code quality:**

- [ ] TypeScript strict mode, no `any`
- [ ] ESLint pass, no warnings
- [ ] Code coverage > 90% cho adapter layer
- [ ] JSDoc cho t?t c? public functions

? **Documentation:**

- [ ] README.md v?i hu?ng d?n setup, test, build
- [ ] DECISIONS.md d� c?p nh?t
- [ ] ARCHITECTURE.md v?i so d? ki?n tr�c

---

## ?? S?n S�ng B?t �?u

**T?t c? quy?t d?nh d� ch?t, ki?n tr�c d� thi?t k?, k? ho?ch d� chia nh?.**

**C�u h?i cu?i c�ng:** B?n c� mu?n t�i b?t d?u Giai do?n A ngay b�y gi? kh�ng?

N?u d?ng �, t�i s?:

1. Setup project structure
2. Implement TypeScript interfaces
3. Implement 4 l?p adapters
4. T?o b?ng d? s�ng T�n Bi�n
5. Vi?t tests + golden fixtures

**Th?i gian u?c t�nh:** 2-3 tu?n  
**Deliverable:** Engine T? Vi ho�n ch?nh, test pass, s?n s�ng cho UI

---

## ?? Ngu?n Tham Kh?o

### S�ch T? Vi

- V�n �?ng Th�i Th? Lang, "T? Vi �?u S? T�n Bi�n", NXB S�i G�n 1956
  - https://archive.org/details/TuViDdauSoTanBien-VDThaiThuLang-DV

### L?ch �m Vi?t Nam

- H? Ng?c �?c, "Thu?t to�n t�nh �m l?ch"
  - https://www.xemamlich.uhm.vn/calrules.html

### Thu vi?n

- iztro: https://github.com/SylarLong/iztro
- @lichta/core: https://www.npmjs.com/package/lichta

### Ngu?n d?i chi?u

- lasotuvi.ai.vn
- lyso.vn
- tracuulasotuvi.com

---

**Ghi ch�:** T�i li?u n�y l� co s? d? b?t d?u implement. M?i thay d?i sau khi d� duy?t c?n du?c ghi l?i trong commit messages v� c?p nh?t trong DECISIONS.md.
