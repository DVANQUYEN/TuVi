# Tử Vi Style Guide

Internal editorial policy for all Tử Vi copy in this project: interpretation text, UI labels, star and formation descriptions, and PDF export.

This guide describes the app as it exists today, not an idealized future version. Where the code and this guide disagree, the code is the source of truth and this guide must be updated.

---

## 1. Purpose and non-goals

**Purpose**

- Keep every reading consistent in structure, terminology, and tone.
- Make the top “Luận giải” readable by someone who knows nothing about Tử Vi.
- Keep the technical section precise enough for a reader who does know Tử Vi.
- Prevent fatalistic, absolute, or gender-stereotyped claims.

**Non-goals**

- This is not a Tử Vi textbook and does not settle academic disputes between schools.
- It does not claim to produce a “fatal verdict” about a person. A chart describes tendencies, conditions, and trade-offs; it does not decide a life.
- It does not replace the engine, the chosen data tables, or the audit trail.
- It does not require every file to be rewritten at once. Apply it to new and touched copy first, then work through the backlog in section 10.

---

## 2. Sources and hierarchy

### 2.1 Classical sources

Use these for concepts, terminology, and structure. Cite the edition actually consulted, because author and translator credits differ between printings.

| Work                      | Common attribution                                                               | Role here                                           |
| ------------------------- | -------------------------------------------------------------------------------- | --------------------------------------------------- |
| **Tử Vi Đẩu Số Toàn Thư** | Trần Đoàn (Trần Hy Di); Vietnamese rendering commonly associated with Vũ Tài Lục | Classical framing, star meanings, sentence patterns |
| **Tử Vi Đẩu Số Tân Biên** | Vân Đằng Thái Thứ Lang (1956 edition used in this repo)                          | Primary source for the 5-level brightness table     |
| **Tử Vi Nghiệm Lý**       | Thiên Lương                                                                      | Interpretation method, practical reasoning          |
| **Tử Vi Hàm Số**          | Hà Uyên                                                                          | Supplementary star and palace meanings              |

Notes:

- Attribution is often edition-specific. Vũ Tài Lục is normally credited with the Vietnamese translation of **Toàn Thư**, while **Tân Biên** is the 1956 work by Vân Đằng Thái Thứ Lang. When in doubt, cite the edition and page, not only the name.
- Schools disagree on brightness values, Tứ Hóa tables, Tuần/Triệt handling, and Chủ Thân. Do not present one school's choice as universal.

### 2.2 Modern Vietnamese sites

`tuvi.vn`, `licham.net`, `altuvi`, and similar sites are useful for **reader-friendly presentation only**: layout, wording, UX patterns, and how to explain a term in one sentence.

They are **not** the sole technical authority. Never use a website as the only justification for a star meaning, brightness value, or formation condition. If a site disagrees with the engine and chosen tables, the site loses.

### 2.3 Internal source of truth

The engine and the chosen data tables decide what the app actually displays:

- `lib/ziwei/config/default-config.ts` — school, day boundary, leap month, year boundary, Tuần/Triệt, brightness, true solar time.
- `lib/ziwei/data/brightness-tan-bien.ts` — 5-level Vietnamese brightness table.
- `lib/ziwei/interpretation/daily-personal.ts` — `YEAR_MUTAGEN_STARS`, the year-stem Tứ Hóa table.
- `lib/ziwei/interpretation/personal-summary.ts` — `STAR_NARRATIVES` and `TAM_HOP_ARCHETYPES`, the current reference tone.
- `lib/ziwei/data/vietnam-timezones.ts` — historical timezone offsets.

If copy contradicts these files, fix the copy.

---

## 3. Reading order

Every full reading follows this order. The top summary may skip steps, but the technical section must not.

1. **Mệnh / Thân** — start with the Mệnh palace, then the Thân palace and where Thân is placed. State the palace branch and whether Mệnh is Vô Chính Diệu.
2. **Chính tinh + độ sáng** — name the major star(s) at Mệnh and their brightness: Miếu / Vượng / Đắc / Bình / Hãm.
3. **Tam phương tứ chính** — check Mệnh, Tài Bạch, Quan Lộc, and Thiên Di. This is where formations and support/conflict become visible.
4. **Tứ Hóa** — check Hóa Lộc, Hóa Quyền, Hóa Khoa, Hóa Kỵ: which star, which palace, and whether it lands in a key palace.
5. **Tuần / Triệt** — check whether Tuần or Triệt falls on Mệnh, Thân, or a key palace. State the effect as a delay, filter, or recalibration, not a cancellation of fate.
6. **Đại vận / tiểu hạn / lưu niên** — only after the natal reading. Frame as timing and conditions, never as a fixed event.

Do not jump to a formation (e.g. “Sát Phá Tham”) before checking which palace it occupies, the brightness of each star, and the supporting/opposing stars.

The intended scope of **tam phương tứ chính** is Mệnh – Tài Bạch – Quan Lộc – Thiên Di. `TAM_HOP_ARCHETYPES` in `personal-summary.ts` now implements explicit conditions for all five formations (Tử Phủ Vũ Tướng, Cơ Nguyệt Đồng Lương, Sát Phá Tham, Tử Vũ Liêm, Cự Nhật), including brightness thresholds. Scope is still mostly Mệnh – Tài Bạch – Quan Lộc: only **Cự Nhật** also checks Thiên Di, and no formation yet conditions on Tứ Hóa or Tuần/Triệt (section 10.2).

---

## 4. Terminology and sentence patterns

### 4.1 Core terms

| Term                                | Meaning                                         | How to use                                       |
| ----------------------------------- | ----------------------------------------------- | ------------------------------------------------ |
| **Mệnh tọa …**                      | The Mệnh palace sits at a branch                | “Mệnh tọa Tý…”                                   |
| **… thủ Mệnh**                      | A star occupies the Mệnh palace                 | “Tử Vi thủ Mệnh…”                                |
| **hội / hội hợp**                   | Stars gather through the tam phương tứ chính    | “Tử Vi hội Thiên Phủ…”                           |
| **tam hợp**                         | The three-branch harmony group                  | “tam hợp Dần – Ngọ – Tuất”                       |
| **xung chiếu**                      | The opposite palace                             | “Thiên Di xung chiếu Mệnh”                       |
| **Miếu / Vượng / Đắc / Bình / Hãm** | The 5 brightness levels                         | Always pair the star with its level              |
| **Tứ Hóa**                          | Hóa Lộc, Hóa Quyền, Hóa Khoa, Hóa Kỵ            | Name both the transformation and the star        |
| **Tuần / Triệt**                    | The two voiding factors                         | “Mệnh gặp Tuần”, “Mệnh gặp Triệt”                |
| **Nạp Âm**                          | The element attached to the year's Can–Chi pair | Explain once in the technical block              |
| **Cục**                             | The five-element framework of the chart         | Explain once before using “Mệnh – Cục” relations |

### 4.2 Sentence patterns

Use short, declarative sentences. Put the palace first, then the star, then the condition.

- “Mệnh tọa Tý, chính tinh Tử Vi thủ Mệnh, ở thế Miếu địa.”
- “Tử Vi hội Thiên Phủ tại tam hợp Dần – Ngọ – Tuất, nên cách cục nghiêng về quản trị nguồn lực.”
- “Cung Mệnh xung chiếu cung Thiên Di, vì vậy môi trường bên ngoài ảnh hưởng rõ tới cách đương số thể hiện bản thân.”
- “Tứ Hóa năm Giáp: Liêm Trinh Hóa Lộc, Phá Quân Hóa Quyền, Vũ Khúc Hóa Khoa, Thái Dương Hóa Kỵ.”
- “Mệnh gặp Tuần Không, ý tưởng lớn thường đến muộn hoặc cần thời gian chiêm nghiệm.”

Avoid stacking more than two technical clauses in one sentence. Split instead.

### 4.3 “bạn” vs “đương số”

- **Top “Luận giải” and second-person passages**: address the reader directly as **“bạn”**. This is the readable register. No jargon.
- **Technical section (“Luận giải chi tiết”)**: the current implementation opens its technical intro with **“Bạn…”** (`buildTechnicalIntro`), so **“bạn” is allowed and expected there too**. Do not treat technical register as requiring “đương số” everywhere.
- **“đương số”**: use for a neutral third-person or formal/classical-citation register, not as a mandatory replacement for every “bạn”.
- Do not mix the two registers inside the same paragraph. A paragraph is either reader-facing / second-person (“bạn”) or third-person / formal (“đương số”).

---

## 5. Writing rules

### 5.1 Two registers

| Register      | Location                                                | Language               | Jargon                                                                |
| ------------- | ------------------------------------------------------- | ---------------------- | --------------------------------------------------------------------- |
| Reader-facing | Top “Luận giải”, headline, key traits, life path, quote | Plain Vietnamese       | None. If a term is unavoidable, explain it in the same sentence.      |
| Technical     | “Luận giải chi tiết”                                    | Full Tử Vi terminology | Allowed, but explain Nạp Âm, Cục, and any uncommon term at first use. |

The top summary must make sense to someone who has never opened a Tử Vi book. The technical section must make sense to someone who has.

**Quote banner exception:** the conclusion quote may use a classical aphorism as the one intentional exception to “no jargon in the top”. The aphorism must still follow section 5.2: no fatalistic framing and no absolute guarantee (no “cả đời”, “viên mãn”, “phú quý tại thiên” as a verdict). Quote text may sound classical; its claim must remain conditional and tendency-based.

### 5.2 No fatalism or absolute wording

State tendencies, conditions, and ranges of possibility. Never state a fixed outcome as fact.

**Banned phrases** (replace, do not merely soften):

- “số mệnh đã định”, “không thể thay đổi”, “an bài”
- “chắc chắn”, “nhất định”, “100%”, “luôn luôn”, “mãi mãi”
- “phú quý song toàn”, “giàu sang”, “nghèo khổ”, “sung túc” as a verdict
- “tai nạn chết người”, “đe dọa tính mạng”, “bệnh nan y”, “đại họa”
- “ly hôn”, “không có con”, “tuyệt tự”, “cô độc cả đời”
- “số xấu”, “vô phúc”, “đen đủi”
- “tốt cho phụ nữ”, “tốt cho đàn ông”, “phái mạnh”, “phái yếu”

**Preferred replacements**

| Avoid                | Prefer                                                            |
| -------------------- | ----------------------------------------------------------------- |
| “số mệnh đã định”    | “khuynh hướng bẩm sinh”, “xu hướng”                               |
| “chắc chắn giàu”     | “có tiềm năng thuận lợi về tài chính, tùy môi trường và lựa chọn” |
| “tai nạn chết người” | “cần chú ý an toàn và sức khỏe trong giai đoạn nhiều áp lực”      |
| “phú quý song toàn”  | “thuận lợi về quản trị nguồn lực nếu biết giữ cân bằng”           |
| “ly hôn”             | “quan hệ cần được vun đắp; không kết luận trước”                  |
| “cả đời cô độc”      | “dễ thu mình khi căng thẳng kéo dài”                              |
| “tốt cho phụ nữ”     | “phù hợp với người có thiên hướng chăm sóc và phân tích”          |

### 5.3 Never equate a star with a fixed outcome

A “good” star is not automatically wealth, and a “bad” star is not automatically disaster. Every claim must be conditioned on at least:

- **Palace** — where the star sits (Mệnh, Tài Bạch, Quan Lộc, Phu Thê, …).
- **Brightness** — Miếu / Vượng / Đắc / Bình / Hãm.
- **Companions** — which auspicious and malefic stars accompany it.
- **Tứ Hóa** — whether the star carries Lộc, Quyền, Khoa, or Kỵ.
- **Tuần / Triệt** — whether the palace is filtered or delayed.

Example: do not write “Tử Vi = lãnh đạo thành công”. Write “Tử Vi ở thế Miếu tại Mệnh, có Tả Phù – Hữu Bật hội chiếu, nghiêng về khả năng dẫn dắt; mức độ phát huy còn tùy môi trường và việc đương số có chịu lắng nghe”.

### 5.4 No gender essentialism

- Never say a formation or star is “good for women” or “good for men”.
- Describe traits, not genders: “thiên hướng chăm sóc”, “thiên hướng phân tích”, “thiên hướng cạnh tranh”.
- A chart does not determine marriage, fertility, or domestic roles. Do not imply it does.

### 5.5 Potential vs outcome; agency

- Write about **tiềm năng**, **khuynh hướng**, **điều kiện**, not **kết cục**.
- Always leave room for **lựa chọn** and **hành động**: what the person can do, practice, avoid, or build.
- Prefer “nếu biết… thì có thể…” over “sẽ…”.
- End a reading with an actionable direction, not a verdict.

### 5.6 Explain technical terms at first use

In the technical block, explain a term the first time it appears:

- “Nạp Âm là ngũ hành gắn với cặp Can – Chi của năm sinh; ở đây là …”
- “Cục là khung ngũ hành dùng để so sánh với bản mệnh; ở đây là …”
- “Tuần / Triệt là hai yếu tố làm chậm hoặc lọc bớt ảnh hưởng của cung, không phải xóa bỏ hoàn toàn.”

Do not re-explain the same term in every paragraph.

---

## 6. School decisions

These are the app's current choices, verified against `default-config.ts` and `config-resolver.ts` at the time of writing. The UI must not imply that they are the only valid school.

| Topic               | Current decision                                                                                 | Source / note                                                                                                                               |
| ------------------- | ------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------- |
| School              | **Nam phái (Tam Hợp)** default; **Trung Châu** selectable; **Bắc phái** disabled (“chưa hỗ trợ”) | `default-config.ts`; `bacPhai` is in the type but not implemented (`supportedInMvp` = Nam phái, Trung Châu), and the UI disables the option |
| Brightness          | **Tân Biên 1956, 5 levels**                                                                      | `brightness-tan-bien.ts`; Miếu / Vượng / Đắc / Bình / Hãm                                                                                   |
| Tứ Hóa              | Year-stem table aligned with common Vietnamese / iztro usage                                     | `YEAR_MUTAGEN_STARS`; birth-chart Tứ Hóa comes from iztro                                                                                   |
| Day boundary        | **23:00 = next day** default                                                                     | `dayBoundary`; only relevant around 23:00–01:00                                                                                             |
| Year boundary       | **Mùng 1 Tết** default; Lập Xuân selectable                                                      | `yearBoundary`                                                                                                                              |
| Leap month          | **Split 15/15** default                                                                          | `leapMonth`                                                                                                                                 |
| Tuần / Triệt        | Show on both palaces; no chính/phó distinction                                                   | `tuanTriet.primary = 'none'`                                                                                                                |
| True solar time     | **Default OFF** in the current config; opt-in in Advanced Options                                | `trueSolarTime.default = false`                                                                                                             |
| Historical timezone | **Default ON**; standard meridian 105°E                                                          | `config-resolver.ts`, `vietnam-timezones.ts`                                                                                                |

### 6.1 Chủ Thân

- The app uses **Chủ Thân theo chi năm** (the body lord derived from the year branch), via iztro's `astrolabe.body` (verified: iztro maps `earthlyBranchOfYear` to `body`).
- The **Thân palace placement** is a separate value (`bodyPalaceBranch`) and is not the same thing as Chủ Thân.
- Do not silently switch to a “Thân cung” school. If a future option is added, label it explicitly and let the reader choose.

### 6.2 Tứ Hóa table

- Use `YEAR_MUTAGEN_STARS` in `daily-personal.ts` for year-stem Tứ Hóa.
- The table is the common Vietnamese / iztro-aligned one. Do not mix in a Phi Tinh Tứ Hóa table.
- When writing a reading, name both the transformation and the star: “Hóa Kỵ tại Cự Môn”, not just “có Hóa Kỵ”.
- If a different school uses a different table, say so and do not present the difference as an error.

### 6.3 Brightness table

- Use the Tân Biên 5-level table for major stars.
- Do not use iztro's 7-level values for major stars. The 7→5 fallback map is only for minor stars where a Vietnamese table is unavailable.
- Always show the level next to the star in technical text.

### 6.4 Giờ sinh, true solar time, historical timezone

- **Giờ sinh** is entered as clock time. The engine then optionally applies:
  - **Historical timezone** (default ON): adjusts for Vietnam's historical UTC offsets, including the pre-1975 north/south differences.
  - **True solar time** (default OFF): adjusts for longitude and the equation of time; when enabled, show the correction in minutes.
- Standard meridian is 105°E.
- Never present the correction as changing the person's fate; it changes the chart input, which can change the chart.
- If the time is near a boundary (23:00–01:00 or a solar-term boundary), state the assumption in the reading or UI.

### 6.5 Tam Hợp vs Phi Tinh

- The app is a **Tam Hợp / Nam phái** reading. Formations are detected through tam phương tứ chính.
- **Phi Tinh (Bắc phái)** is not implemented. The school option is rendered **disabled** and labelled “Bắc phái (chưa hỗ trợ)”. Do not write Phi Tinh-specific claims (e.g. flying-star Tứ Hóa chains) as if the engine supports them.
- Trung Châu is selectable and changes the iztro algorithm, but it is still a different school; label it.

### 6.6 UI must declare the school and its limitations

- The footer now carries a neutral disclosure: “Mặc định dùng trường phái Nam phái và bảng độ sáng Tân Biên 1956; có thể chọn Trung Châu. Kết quả mang tính tham khảo.” It no longer asserts a single school as if it were the user's applied choice.
- The result screen still does **not** display the applied school dynamically from `appliedConfig.school`; the footer stays neutral instead. This remains backlog (section 10.3).
- State limitations near the result:
  - “Kết quả mang tính tham khảo, không phải kết luận số phận.”
  - “Đang dùng bảng độ sáng Tân Biên 1956 và trường phái Nam phái.” (only when that is actually the applied school)
  - “Giờ sinh gần ranh giới có thể làm thay đổi lá số.”
- Do not hide the school choice in Advanced Options without showing it again on the result.

---

## 7. Star template

Every star description uses the same five parts. Keep each part to one or two sentences.

1. **Bản chất** — what the star represents at its core.
2. **Mặt mạnh** — the constructive expression.
3. **Mặt trái** — the shadow when overused or under pressure.
4. **Môi trường phù hợp** — the kinds of work or conditions where the strength shows up, framed as potential.
5. **Lời khuyên** — one concrete, actionable direction.

### Example: Thiên Cơ

- **Bản chất:** Mưu trí, quan sát tốt, có thói quen tính toán trước khi hành động.
- **Mặt mạnh:** Học nhanh, nhìn ra điểm bất hợp lý, lập kế hoạch và điều phối công việc khá tốt.
- **Mặt trái:** Nghĩ quá nhiều, dễ đổi ý liên tục, chờ mọi thứ hoàn hảo rồi bỏ lỡ thời cơ.
- **Môi trường phù hợp:** Công việc cần phân tích và chuẩn bị kỹ như nghiên cứu, giáo dục, công nghệ hoặc tư vấn.
- **Lời khuyên:** Đặt mốc hành động rõ ràng và chấp nhận ra quyết định khi đã đủ thông tin, thay vì chờ đợi sự hoàn hảo.

Tone check: the example describes tendencies and conditions, not a fixed destiny, and leaves agency with the reader.

---

## 8. Formation template

Every formation (cách cục) uses the same four parts.

1. **Điều kiện** — which stars, which palaces, and any brightness or Tứ Hóa condition.
2. **Thế mạnh** — what the formation supports when the conditions hold.
3. **Rủi ro** — the typical failure mode or shadow.
4. **Lời khuyên** — the practical way to keep the strength and reduce the risk.

Always state that the formation is a **pattern of tendencies**, not a guaranteed outcome. Mention brightness, companions, Tứ Hóa, and Tuần/Triệt if they materially change the reading.

### Example: Sát Phá Tham

- **Điều kiện:** Thất Sát, Phá Quân và Tham Lang cùng hội về Mệnh – Tài Bạch – Quan Lộc (tam hợp). The detector requires all three across the three key palaces, with at least two at Bình or brighter; a single star at Mệnh is not enough.
- **Thế mạnh:** Dám nghĩ dám làm, chịu được áp lực, nhanh thích nghi với biến động.
- **Rủi ro:** Thăng trầm, hao tán nguồn lực, hoặc đứt gãy quan hệ nếu thiếu tiết chế.
- **Lời khuyên:** Đặt giới hạn rủi ro, giữ lại thành quả đã gây dựng, và kiểm tra độ sáng cùng trợ lực của từng sao trước khi kết luận.

Note: the Sát Phá Tham quote now uses the formation detector, so it requires the full bộ across Mệnh – Tài Bạch – Quan Lộc, not a single star at Mệnh.

---

## 9. Review checklist

Before shipping any interpretation copy, check every item.

- [ ] **Sao nào?** The relevant major and minor stars are named.
- [ ] **Cung nào?** The palace(s) are named; tam phương tứ chính has been considered.
- [ ] **Độ sáng nào?** Each major star has a brightness level where relevant.
- [ ] **Hội sao nào?** Auspicious and malefic companions are considered, not just the main star.
- [ ] **Tứ Hóa / Tuần / Triệt?** Their presence or absence is checked and stated when material.
- [ ] **Có điều kiện hóa?** The claim depends on palace, brightness, companions, Tứ Hóa, or Tuần/Triệt.
- [ ] **Có agency?** The reader is left with an action, choice, or practice.
- [ ] **Không tuyệt đối?** No banned phrase and no fixed outcome.
- [ ] **Đúng register?** “bạn” for top/second-person (including the technical intro); “đương số” only for third-person/formal passages; one register per paragraph.
- [ ] **Không gender essentialism / health fatalism?** No “good for women/men”, no death or terminal-illness claims.
- [ ] **Giải thích thuật ngữ?** Nạp Âm, Cục, and uncommon terms are explained at first use in the technical block.

---

## 10. Backlog and known issues

`STAR_NARRATIVES`, the formation **meanings** in `TAM_HOP_ARCHETYPES`, `CONCLUSION_QUOTES`, `STAR_GROUPS`, and `ADVANCED_COMBINATIONS` have been rewritten to this guide's tone. A data style guard in `phase2-fortune.test.ts` now fails the suite if `STAR_GROUPS.meaning` or `ADVANCED_COMBINATIONS.description` contains a banned absolute or fatalistic phrase. Formation **detection** now has explicit brightness conditions for all five formations, but its scope and conditioning factors are still limited (section 10.2). The items below are what remains.

### 10.1 `MAJOR_STAR_MEANINGS` (14 × 12 × 5)

- Still needs a full audit for **fixed adjectives** (“phú quý”, “thành công”, “nổi tiếng”, “quyền lực”) that read as guaranteed outcomes.
- Many entries are **generated templates**; check depth so palace × brightness entries do not repeat the same sentence with only the label changed, and so Miếu vs Hãm actually reads differently.
- Ensure each entry follows the star template in section 7 or a compatible structure.
- Status: **next-phase backlog**.

### 10.2 Formation detection conditions

- `TAM_HOP_ARCHETYPES` now implements explicit conditions for all five formations: Tử Phủ Vũ Tướng, Cơ Nguyệt Đồng Lương, Sát Phá Tham, Tử Vũ Liêm, and Cự Nhật, including brightness thresholds.
- Cơ Nguyệt Đồng Lương now uses the **four-star** definition (Thiên Cơ, Thái Âm, Thiên Đồng, Thiên Lương) in both `advanced-combinations.ts` and `TAM_HOP_ARCHETYPES`.
- Scope is still mostly Mệnh – Tài Bạch – Quan Lộc; only **Cự Nhật** also checks Thiên Di (Thái Dương + Cự Môn at Dần/Thân).
- Detection does not yet condition on **Tứ Hóa** or **Tuần/Triệt**, and does not state when Thiên Di changes the result for the other formations.
- Status: **next-phase backlog**.

### 10.3 UI school disclosure

- The footer is now neutral: it states the default school and brightness table, notes that Trung Châu is selectable, and says the result is for reference.
- The result screen still does **not** render the exact applied school dynamically from `appliedConfig.school`, so a Trung Châu user sees only the neutral default disclosure.
- Bắc phái is rendered as a **disabled** option labelled “Bắc phái (chưa hỗ trợ)” and must stay out of `supportedInMvp`.
- Fix: display the applied school and brightness table on the result; keep the reference disclaimer.

### 10.4 Conclusion quote banner

- `CONCLUSION_QUOTES` has been rewritten to remove fixed outcomes, and the Sát Phá Tham quote category now requires the full formation.
- The quote banner intentionally allows **classical jargon** as the one exception to the no-jargon rule (section 5.1). That is a design choice, not a bug.
- The classical tone must still follow section 5.2: no fatalistic framing and no absolute guarantee.

### 10.5 Vô Chính Diệu fallback

- `buildTechnicalMenh` does borrow stars from Thiên Di, which is correct.
- The top summary uses `FALLBACK_NARRATIVE`, which is generic and does not name the opposite palace's stars.
- Fix: resolve the opposite palace's major stars and reflect them explicitly in the fallback narrative; guard the case where the opposite palace is also empty.
- The fallback should be explicit: “Mệnh Vô Chính Diệu, mượn cách từ Thiên Di xung chiếu (…)”, not only “linh hoạt, dễ thích nghi”.

---

## Source notes

This document is **internal editorial policy**, not a claim that one school is absolute. It chooses Nam phái / Tam Hợp and the Tân Biên 1956 brightness table because they are the app's current defaults and the most common Vietnamese presentation.

Classical works and modern websites differ on brightness, Tứ Hóa, Tuần/Triệt, and Chủ Thân. Where the app must choose, it chooses the engine and the data tables listed in section 2.3, and the UI should say so. When a reader asks about another school, the honest answer is: “Đây là cách chọn của ứng dụng, không phải chân lý duy nhất.”
