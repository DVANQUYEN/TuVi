# T�i li?u Quy?t d?nh C?u h�nh - Sao M?nh

**Ng�y t?o:** 03/11/2026  
**Tr?ng th�i:** Ch? duy?t l?n cu?i tru?c Giai do?n A  
**M?c d�ch:** Ghi l?i t?t c? quy?t d?nh v? tru?ng ph�i, quy t?c, v� c?u h�nh cho engine T? Vi

---

## T�m t?t 7 Quy?t d?nh

| #   | H?ng m?c          | Quy?t d?nh                                              | Tr?ng th�i        |
| --- | ----------------- | ------------------------------------------------------- | ----------------- |
| 1   | Tru?ng ph�i       | Nam ph�i (m?c d?nh), cho ch?n Trung Ch�u/B?c ph�i       | ? �� ch?t         |
| 2   | Gi? T�            | Ch? hi?n khi 23:00-01:00, m?c d?nh theo ngu?n d?i chi?u | ? �� ch?t         |
| 3   | Th�ng nhu?n       | Chia d�i 15/15 (m?c d?nh), cho ch?n 2 c�ch kia          | ? �� ch?t         |
| 4   | Nam Can Chi       | M�ng 1 T?t (m?c d?nh), cho ch?n L?p Xu�n                | ? �� ch?t         |
| 5   | Tu?n/Tri?t        | Kh�ng ph�n bi?t ch�nh/ph�, hi?n th? c? 2 cung           | ? �� ch?t         |
| 6   | �? s�ng           | Data 7 m?c, UI 5 m?c, d�ng b?ng Vi?t Nam                | ?? C?n duy?t b?ng |
| 7   | Gi? m?t tr?i th?t | M?c d?nh T?T, cho ch?n trong advanced                   | ? �� ch?t         |

---

## Chi ti?t t?ng Quy?t d?nh

### 1. Tru?ng ph�i T? Vi

**Quy?t d?nh:**

- M?c d?nh: **Nam ph�i (Tam h?p)**
- Cho ch?n: Trung Ch�u, B?c ph�i
- Hi?n t�n tru?ng ph�i dang d�ng tr�n trang k?t qu?

**Ngu?n tham chi?u:**

- Nam ph�i: Ph? bi?n nh?t Vi?t Nam, d�ng trong c�c s�ch:
  - V�n �?ng Th�i Th? Lang, "T? Vi �?u S? T�n Bi�n", NXB S�i G�n 1956
  - Nguy?n Ph�t L?c, "T? Vi H�m S?"
- Trung Ch�u: iztro c� s?n (`algorithm: 'zhongzhou'`), nhung l� Trung Ch�u Trung Qu?c
- B?c ph�i: iztro KH�NG h? tr?, c?n vi?t engine ri�ng (T? H�a phi tinh)

**C?u h�nh:**

```json
{
  "school": {
    "default": "namPhai",
    "options": ["namPhai", "trungChau", "bacPhai"],
    "displayOnResult": true
  }
}
```

**Ghi ch�:**

- B?c ph�i ch? n�n h?a khi d� c� engine phi tinh (Giai do?n 3+)
- MVP ch? n�n h? tr? Nam ph�i + Trung Ch�u

---

### 2. Quy t?c Gi? T� (ranh gi?i ng�y)

**Quy?t d?nh:**

- Ch? hi?n l?a ch?n khi gi? sinh trong 23:00-01:00
- M?c d?nh theo ngu?n d?i chi?u (s? x�c d?nh khi c� golden standard)
- Th�m ca 23:00-01:00 v�o b? test golden

**Ngu?n tham chi?u:**

- Ph? bi?n trong T? Vi Vi?t Nam: 23:00 = ng�y h�m sau (T� s?m)
- M?t s? ph?n m?m: 00:00 = ng�y h�m sau (quy u?c hi?n d?i)
- Vienaoc, lasotuvi.ai.vn: cho ch?n, m?c d?nh 23:00

**C?u h�nh:**

```json
{
  "dayBoundary": {
    "default": "23:00",
    "options": ["23:00", "00:00"],
    "showOnlyWhen": "23:00-01:00",
    "source": "lasotuvi.ai.vn, vienaoc.vn"
  }
}
```

**Test cases c?n th�m:**

- 21/01/1985 23:30 (T?t ?t S?u)
- 17/02/2007 23:30 (T?t �inh H?i)
- 31/12/1999 23:30 (v?t qua nam duong + th�ng �m)

---

### 3. Quy t?c Th�ng Nhu?n

**Quy?t d?nh:**

- M?c d?nh: **Chia d�i 15/15** (ng�y 1-15 = th�ng g?c, 16-30 = th�ng sau)
- Cho ch?n: "C? th�ng g?c", "C? th�ng sau"
- Hi?n c?nh b�o ng?n khi ngu?i d�ng sinh trong th�ng nhu?n

**Ngu?n tham chi?u:**

- Chia d�i 15/15: Ph? bi?n nh?t, d�ng trong Vienaoc, OpenFate
- C? th�ng g?c: M?t s? s�ch c?
- C? th�ng sau: �t ph? bi?n

**C?u h�nh:**

```json
{
  "leapMonth": {
    "default": "split15",
    "options": ["split15", "baseMonth", "nextMonth"],
    "showWarning": true,
    "source": "Vienaoc, OpenFate"
  }
}
```

**Test cases:**

- 25/03/2004 (th�ng 2 nhu?n)
- 10/04/2004 (th�ng 2 nhu?n, ng�y ~21)
- 21/03/1985 (th�ng 2 nhu?n)

---

### 4. Nam Can Chi d?i khi n�o

**Quy?t d?nh:**

- M?c d?nh: **M�ng 1 T?t**
- Cho ch?n: **L?p Xu�n** (B�t T? d�ng)

**Ngu?n tham chi?u:**

- T? Vi Vi?t Nam: Nam d?i t?i M�ng 1 T?t (ph? bi?n)
- B�t T? / T? Tr?: Nam d?i t?i L?p Xu�n (3-5/2 duong l?ch)
- Vienaoc: "T�nh tu?i khi sinh c?n T?t: Kh�ng thay d?i / T? L?p Xu�n t�nh nam m?i"

**C?u h�nh:**

```json
{
  "yearBoundary": {
    "default": "tet",
    "options": ["tet", "lapXuan"],
    "source": "T? Vi �?u S? T�n Bi�n, Vienaoc"
  }
}
```

**Test cases:**

- 05/02/2026 (sau L?p Xu�n, tru?c T?t) ? T? Vi: ?t T?, B�t T?: B�nh Ng?
- 04/02/2026 (d�ng ng�y L?p Xu�n)
- 03/02/2024 vs 10/02/2024

---

### 5. Tu?n/Tri?t ch�nh/ph�

**Quy?t d?nh:**

- **Kh�ng ph�n bi?t ch�nh/ph�**
- Hi?n th? Tu?n/Tri?t tr�n c? 2 cung
- Th�m c? c?u h�nh `tuanTrietPrimary: 'none'` d? sau n�y c� th? b? sung quy t?c ch�nh/ph�

**Ngu?n tham chi?u:**

- M?t s? s�ch ph�n bi?t ch�nh/ph� (ch�nh = cung d?u, ph� = cung sau)
- M?t s? s�ch kh�ng ph�n bi?t, ch? hi?n th? 2 cung
- Chua c� ngu?n th?ng nh?t

**C?u h�nh:**

```json
{
  "tuanTriet": {
    "display": "bothPalaces",
    "primary": "none",
    "options": {
      "primary": ["none", "first", "nearMenh"]
    },
    "source": "C?n nghi�n c?u th�m"
  }
}
```

**Ghi ch�:**

- iztro ch? c� 1 sao (Tu?n Kh�ng, Tri?t L?), kh�ng d�ng chu?n Vi?t
- C?n t? t�nh Tu?n/Tri?t 2 cung trong VietnameseChartDecorator
- C� th? d�ng `?? + ??` c?a iztro l�m cross-check cho Tri?t

---

### 6. �? s�ng (Brightness)

**Quy?t d?nh:**

- **Luu data 7 m?c** (Mi?u/Vu?ng/�?c/L?i/B�nh/B?t/H�m) - raw data
- **Hi?n th? UI 5 m?c** (Mi?u/Vu?ng/�?c/B�nh/H�m) - user-facing
- **D�ng b?ng T? Vi Vi?t Nam** thay v� iztro
- B?ng quy d?i 7?5 l� file c?u h�nh ri�ng, KH�NG hard-code

**Ngu?n tham chi?u:**

- **B?ng Vi?t Nam:** V�n �?ng Th�i Th? Lang, "T? Vi �?u S? T�n Bi�n", NXB S�i G�n 1956, Quy?n 2, Part II, m?c 3, trang 33-38
  - B?n s? h�a: https://archive.org/details/TuViDdauSoTanBien-VDThaiThuLang-DV
- **B?ng iztro:** `src/data/stars.ts` trong iztro repo

**?? PH�T HI?N QUAN TR?NG:**
**B?ng iztro v� T? Vi Vi?t Nam (T�n Bi�n) l?ch nhau 103/168 � (61%)**

M?t s? v� d? l?ch:

- T? Vi t?i S?u: iztro **Mi?u** ? T�n Bi�n **�?c**
- T? Vi t?i D?n: iztro **Vu?ng** ? T�n Bi�n **Mi?u**
- Thi�n Co t?i T�: iztro **Mi?u** ? T�n Bi�n **�?c**
- Thi�n Co t?i D?n: iztro **�?c** ? T�n Bi�n **H�m**
- Th?t S�t t?i T�: iztro **Vu?ng** ? T�n Bi�n **Mi?u**

**C�c sao l?ch nhi?u nh?t:**

| Sao        | S? cung l?ch / 12 |
| ---------- | ----------------- |
| Thi�n Co   | 12/12 (100%)      |
| T? Vi      | 10/12 (83%)       |
| Th?t S�t   | 10/12 (83%)       |
| Thi�n �?ng | 8/12 (67%)        |
| Li�m Trinh | 8/12 (67%)        |
| Thi�n Ph?  | 8/12 (67%)        |
| Tham Lang  | 8/12 (67%)        |

**�? xu?t b?ng quy d?i 7?5:**

| iztro (7) | T? Vi Vi?t (5) | Ngu?n                                             | �? tin c?y   |
| --------- | -------------- | ------------------------------------------------- | ------------ |
| Mi?u      | Mi?u           | T�n Bi�n, m?c 2.1, tr. 32                         | ? Ch?c ch?n  |
| Vu?ng     | Vu?ng          | T�n Bi�n, m?c 2.2, tr. 32                         | ? Ch?c ch?n  |
| �?c       | �?c            | T�n Bi�n, m?c 2.3, tr. 32                         | ? Ch?c ch?c  |
| L?i       | �?c            | Kh�ng c� trong T�n Bi�n; L?i n?m gi?a �?c v� B�nh | ?? C?n duy?t |
| B�nh      | B�nh           | T�n Bi�n, m?c 2.4, tr. 33                         | ? Ch?c ch?n  |
| B?t       | H�m            | Kh�ng c� trong T�n Bi�n; B?t s�t H�m              | ?? C?n duy?t |
| H�m       | H�m            | T�n Bi�n, m?c 2.5, tr. 33                         | ? Ch?c ch?n  |

**C?u h�nh:**

```json
{
  "brightness": {
    "dataLevels": 7,
    "displayLevels": 5,
    "source": "T? Vi �?u S? T�n Bi�n, 1956",
    "mapping": {
      "mieu": "mieu",
      "vuong": "vuong",
      "dac": "dac",
      "loi": "dac",
      "binh": "binh",
      "bat": "ham",
      "ham": "ham"
    },
    "useVietnameseTable": true,
    "vietnameseTableSource": "T? Vi �?u S? T�n Bi�n, tr. 33-38"
  }
}
```

**?? C?N B?N DUY?T:**

1. **B?ng quy d?i L?i?�?c, B?t?H�m** c� d�ng kh�ng? Hay n�n:
   - L?i?B�nh, B?t?B�nh?
   - L?i?�?c, B?t?B�nh?
   - L?i?B�nh, B?t?H�m?

2. **B?ng d? s�ng Vi?t Nam (T�n Bi�n)** c� d�ng tin kh�ng? Hay n�n d?i chi?u th�m:
   - T? Vi �?u S? To�n Thu (Vu T�i L?c d?ch, 1973)?
   - C�c website t? vi Vi?t kh�c?

3. **103 � l?ch** - c� ch?p nh?n d�ng b?ng T�n Bi�n kh�ng? Hay c?n:
   - �?i chi?u th�m 2-3 ngu?n n?a?
   - T?o b?ng "Sao M?nh" ri�ng (t?ng h?p t? nhi?u ngu?n)?

**Chi ti?t 103 � l?ch:** (Xem file `BRIGHTNESS-COMPARISON.md`)

---

### 7. Gi? M?t tr?i Th?t (True Solar Time)

**Quy?t d?nh:**

- **M?c d?nh T?T**
- Cho ch?n trong Advanced Options
- N?u b?t, hi?n th? r� d� hi?u ch?nh bao nhi�u ph�t

**Ngu?n tham chi?u:**

- �a s? ph?n m?m T? Vi VN d�ng gi? d?ng h? tr?c ti?p
- Gi? m?t tr?i th?t ch? y?u d�ng trong B�t T? / T? Tr?
- Khi b?t: hi?u ch?nh � -24 d?n +33 ph�t (4 ph�t/d? + EoT �16 ph�t)

**C?u h�nh:**

```json
{
  "trueSolarTime": {
    "default": false,
    "showInAdvanced": true,
    "displayCorrection": true,
    "source": "lasotuvi.ai.vn, OpenFate"
  }
}
```

---

## C?u tr�c File C?u h�nh �? xu?t

```typescript
// lib/ziwei/config/types.ts

export interface ZiweiConfig {
  // Tru?ng ph�i
  school: {
    default: 'namPhai' | 'trungChau' | 'bacPhai';
    options: Array<'namPhai' | 'trungChau' | 'bacPhai'>;
    displayOnResult: boolean;
  };

  // Ranh gi?i ng�y (gi? T�)
  dayBoundary: {
    default: '23:00' | '00:00';
    options: Array<'23:00' | '00:00'>;
    showOnlyWhen: '23:00-01:00';
    source: string;
  };

  // Th�ng nhu?n
  leapMonth: {
    default: 'split15' | 'baseMonth' | 'nextMonth';
    options: Array<'split15' | 'baseMonth' | 'nextMonth'>;
    showWarning: boolean;
    source: string;
  };

  // Nam Can Chi
  yearBoundary: {
    default: 'tet' | 'lapXuan';
    options: Array<'tet' | 'lapXuan'>;
    source: string;
  };

  // Tu?n/Tri?t
  tuanTriet: {
    display: 'bothPalaces';
    primary: 'none' | 'first' | 'nearMenh';
    source: string;
  };

  // �? s�ng
  brightness: {
    dataLevels: 7 | 5;
    displayLevels: 5;
    mapping: Record<string, string>;
    useVietnameseTable: boolean;
    vietnameseTableSource: string;
  };

  // Gi? m?t tr?i th?t
  trueSolarTime: {
    default: boolean;
    showInAdvanced: boolean;
    displayCorrection: boolean;
    source: string;
  };
}

// lib/ziwei/config/default.ts
export const defaultConfig: ZiweiConfig = {
  school: {
    default: 'namPhai',
    options: ['namPhai', 'trungChau', 'bacPhai'],
    displayOnResult: true,
  },
  dayBoundary: {
    default: '23:00',
    options: ['23:00', '00:00'],
    showOnlyWhen: '23:00-01:00',
    source: 'lasotuvi.ai.vn, vienaoc.vn',
  },
  leapMonth: {
    default: 'split15',
    options: ['split15', 'baseMonth', 'nextMonth'],
    showWarning: true,
    source: 'Vienaoc, OpenFate',
  },
  yearBoundary: {
    default: 'tet',
    options: ['tet', 'lapXuan'],
    source: 'T? Vi �?u S? T�n Bi�n, Vienaoc',
  },
  tuanTriet: {
    display: 'bothPalaces',
    primary: 'none',
    source: 'C?n nghi�n c?u th�m',
  },
  brightness: {
    dataLevels: 7,
    displayLevels: 5,
    mapping: {
      mieu: 'mieu',
      vuong: 'vuong',
      dac: 'dac',
      loi: 'dac',
      binh: 'binh',
      bat: 'ham',
      ham: 'ham',
    },
    useVietnameseTable: true,
    vietnameseTableSource: 'T? Vi �?u S? T�n Bi�n, tr. 33-38',
  },
  trueSolarTime: {
    default: false,
    showInAdvanced: true,
    displayCorrection: true,
    source: 'lasotuvi.ai.vn, OpenFate',
  },
};
```

---

## Checklist Nh?ng �i?m C?n Duy?t

### ? �� ch?t (kh�ng c?n duy?t l?i)

- [x] Tru?ng ph�i m?c d?nh: Nam ph�i
- [x] Gi? T�: ch? hi?n khi 23:00-01:00
- [x] Th�ng nhu?n: chia d�i 15/15
- [x] Nam Can Chi: M�ng 1 T?t
- [x] Tu?n/Tri?t: kh�ng ph�n bi?t ch�nh/ph�
- [x] Gi? m?t tr?i th?t: m?c d?nh t?t

### ?? C?n duy?t tru?c khi code

#### **Uu ti�n cao**

1. **B?ng quy d?i d? s�ng 7?5**
   - [ ] L?i ? �?c hay B�nh?
   - [ ] B?t ? H�m hay B�nh?
   - �? xu?t hi?n t?i: L?i?�?c, B?t?H�m

2. **B?ng d? s�ng Vi?t Nam (T�n Bi�n)**
   - [ ] Ch?p nh?n 103/168 � l?ch so v?i iztro?
   - [ ] �?i chi?u th�m v?i To�n Thu (Vu T�i L?c)?
   - [ ] T?o b?ng "Sao M?nh" ri�ng?

3. **Ngu?n golden standard**
   - [ ] Ch?n 3 ngu?n n�o d? d?i chi?u?
     - lasotuvi.ai.vn?
     - lyso.vn?
     - tracuulasotuvi.com?
     - tuvisonkhiem.vn?

#### **Uu ti�n trung b�nh**

4. **Tu?n/Tri?t ch�nh/ph�**
   - [ ] Gi? `primary: 'none'` hay nghi�n c?u th�m?
   - [ ] C� t�i li?u chuy�n gia n�o v? v?n d? n�y kh�ng?

5. **B?c ph�i**
   - [ ] C� n�n h?a h? tr? B?c ph�i trong roadmap kh�ng?
   - [ ] Hay ch? ghi "�ang ph�t tri?n"?

---

## Bu?c Ti?p Theo

### Sau khi duy?t xong:

1. **Giai do?n A - Engine + Golden Tests (2-3 tu?n)**
   - Setup project structure
   - Implement VietnameseCalendarAdapter
   - Implement TrueSolarTimeAdapter
   - Implement IztroEngineAdapter
   - Implement VietnameseChartDecorator
   - L?y 30-100 fixture v�ng t? ngu?n d?i chi?u
   - Golden test: so s�nh t?ng tru?ng
   - �o t? l? l?ch, quy?t d?nh fork/wrap

2. **Acceptance Criteria Giai do?n A**
   - [ ] 100% pass cho ng�y kh�ng l?ch l?ch
   - [ ] 100% "expected diff" cho ng�y l?ch d� bi?t
   - [ ] Property test: 12 cung d?, kh�ng tr�ng sao
   - [ ] 30+ fixture v�ng kh?p ngu?n d?i chi?u
   - [ ] �? s�ng ch�nh tinh kh?p b?ng T�n Bi�n (ho?c b?ng d� duy?t)
   - [ ] Code coverage > 90% cho adapter layer

---

## Ngu?n Tham Chi?u Ch�nh

### S�ch T? Vi

- V�n �?ng Th�i Th? Lang, "T? Vi �?u S? T�n Bi�n", NXB S�i G�n 1956
  - https://archive.org/details/TuViDdauSoTanBien-VDThaiThuLang-DV
- Vu T�i L?c (d?ch), "T? Vi �?u S? To�n Thu", NXB Ng�n H� 1973
- Nguy?n Ph�t L?c, "T? Vi H�m S?"

### Website t? vi Vi?t

- lasotuvi.ai.vn - cho ch?n m�i gi? GMT+7
- lyso.vn - l�u d?i, c� di?n d�n
- tracuulasotuvi.com - d?n ngu?n To�n Thu
- tuvisonkhiem.vn - c� b?ng d? s�ng
- vienaoc.vn - UI v?i nhi?u option

### L?ch �m Vi?t Nam

- H? Ng?c �?c, "Thu?t to�n t�nh �m l?ch"
  - https://www.xemamlich.uhm.vn/calrules.html
  - https://www.xemamlich.uhm.vn/histcal.html
- B?ng T?t 1901-2099: https://agereckoner.com/reference/tet-dates

### Thu vi?n

- iztro: https://github.com/SylarLong/iztro
- @lichta/core: https://www.npmjs.com/package/lichta

---

**Ghi ch� cu?i:** T�i li?u n�y l� co s? d? b?t d?u code. M?i thay d?i sau khi d� duy?t c?n du?c ghi l?i v� c?p nh?t trong commit messages.
