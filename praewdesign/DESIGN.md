# DESIGN.md — Praew Portfolio

เอกสารนี้สรุปจากโค้ดจริงในโปรเจกต์ ณ วันที่รีแฟกเตอร์เสร็จ (`css/`, `js/`, `index.html`, `projects/smart-tax.html`) ไม่มีกติกาใดที่โค้ดไม่ได้ทำจริง

## 1. หลักการออกแบบ

หน้าแรกใช้ธีมสีครีม/ชมพูพาสเทลกับลวดลายมือวาด (ลายตาราง, ช็อกโกแลตหยด, มะเขือเทศ) และฟอนต์คู่ Bodoni 72 + Pacifico (`.heading-pair`) ให้ความรู้สึกสมุดภาพ ส่วนหน้าโปรเจกต์ (`projects/*.html`) ใช้ระบบการ์ดสีขาวเรียบ (`.pj-card`) บนพื้นครีมอ่อน เพื่อให้อ่านเนื้อหาเคสสตัดดี้ได้ง่าย ทั้งสองธีมแชร์โทเค็นสี/ฟอนต์/ระบบแอนิเมชันชุดเดียวกัน (`css/tokens.css`, `css/motion.css`) เพื่อให้ยังรู้สึกเป็นเว็บเดียวกัน

## 2. ที่มาของค่าทุกอย่าง

- **สี/ฟอนต์/ระยะ/เวลาแอนิเมชันทั้งหมด** → `css/tokens.css` (`:root` ตัวเดียวของทั้งเว็บ) ห้ามประกาศค่าเหล่านี้ซ้ำไฟล์อื่น ให้ `var(--ชื่อ)` เสมอ
- **reset/ฟอนต์เริ่มต้น/ลิงก์/`.visually-hidden`** → `css/base.css`
- **component ที่ใช้ ≥2 หน้า** (heading-pair, wave, footer, ปุ่ม resume) → `css/components.css`
- **ระบบแอนิเมชัน 4 แบบ** → `css/motion.css`
- **เฉพาะหน้าแรก** → `css/home.css`
- **เฉพาะหน้าโปรเจกต์** → `css/project.css`
- **เอนจินแอนิเมชัน (reveal/typing)** → `js/motion.js` (`window.PJMotion`)
- **Lightbox** → `js/lightbox.js`
- **การเดินสายเฉพาะหน้า** (จะ observe element ไหน, ดีเลย์เท่าไร) → inline `<script>` ท้ายไฟล์ HTML ของแต่ละหน้า ไม่ถือเป็นโค้ดซ้ำเพราะรายการต่างกันทุกหน้า

ลำดับโหลด (ทุกหน้าเหมือนกัน): `tokens.css → base.css → components.css → motion.css → (home.css | project.css)` ตามด้วย `js/motion.js` แล้วค่อย (`js/lightbox.js` — เฉพาะหน้าโปรเจกต์) แล้วจึงเป็น wiring script

## 3. โครงไฟล์

```
praewdesign/
  index.html            หน้าแรก
  favicon.ico           ไอคอนแท็บ (16/32/48px รวมไฟล์เดียว) เบราว์เซอร์เรียกจาก / อัตโนมัติ
  projects/*.html        หน้าเคสสตัดดี้ (สร้างจาก _templates/project.html)
  _templates/project.html  แม่แบบหน้าโปรเจกต์ใหม่
  assets/favicon/       ไอคอนต้นฉบับ + ไฟล์ที่แตกออกมาทุกขนาด (ดูกฎด้านล่าง)
  css/
    tokens.css   ตัวแปรสีเดียว
    base.css     reset ทั่วไป
    components.css  ของใช้ร่วม 2 หน้าขึ้นไป
    motion.css   ระบบแอนิเมชัน + reduced-motion
    home.css     เฉพาะหน้าแรก
    project.css  เฉพาะหน้าโปรเจกต์
  js/
    motion.js    เอนจิน reveal/typing (window.PJMotion)
    lightbox.js  ระบบขยายภาพ
  assets/        รูป/ฟอนต์/ไฟล์ประกอบ
```
กติกา: โค้ด CSS/JS ที่มี selector หรือฟังก์ชันซ้ำกันใน 2 หน้าต้องอยู่ใน `components.css`/`motion.css`/`js/*.js` เท่านั้น ห้ามอยู่ใน `home.css`/`project.css` พร้อมกัน

**Favicon**: ทุกหน้า (รวม `_templates/project.html`) ต้องมีบล็อกนี้ต่อจาก `<title>` เสมอ ล้อมด้วยคอมเมนต์ `<!-- favicon -->` ... `<!-- /favicon -->` path ปรับตามความลึกของหน้า (หน้าใน `projects/` ใช้ `../`):
```html
<!-- favicon -->
<link rel="icon" href="[path]favicon.ico" sizes="48x48">
<link rel="icon" href="[path]assets/favicon/favicon-32.png" type="image/png" sizes="32x32">
<link rel="icon" href="[path]assets/favicon/favicon-192.png" type="image/png" sizes="192x192">
<link rel="apple-touch-icon" href="[path]assets/favicon/apple-touch-icon.png">
<!-- /favicon -->
```
ที่มาของไฟล์เหล่านี้คือ `assets/favicon/icon-512.png` ต้นฉบับเพียงไฟล์เดียว (512×512 พื้นโปร่งใส) ห้ามแก้ไฟล์นี้ ไฟล์อื่นทั้งหมดแตกออกมาจากมัน — ถ้ามี `assets/favicon/favicon.svg` (ไม่บังคับ) ให้เพิ่มบรรทัด `<link rel="icon" href="[path]assets/favicon/favicon.svg" type="image/svg+xml">` ต่อจากบรรทัด favicon.ico ห้ามเพิ่ม theme-color, web manifest หรือแท็กอื่นที่ไม่ได้อยู่ในบล็อกนี้

## 4. Component

| class | ใช้เมื่อไหร่ | ข้อห้าม |
|---|---|---|
| `.heading-pair` `.heading-main` `.heading-script` | หัวข้อฟอนต์คู่ (Bodoni+Pacifico) | ขนาดฟอนต์ปรับต่อ section ใน home.css/project.css เท่านั้น ห้ามแก้สี/ฟอนต์ในไฟล์ที่ใช้ |
| `.wave-top` `.wave-bottom` | คลื่นคั่น section | ต้องมี `<img>` ลูกเสมอ, `pointer-events:none` |
| `.footer` `.footer-inner` `.footer-title` `.footer-contact` `.footer-link` `.link-underline` | footer ทุกหน้า | ห้ามเขียน footer ใหม่แยกหน้า; ต่างได้เฉพาะ: มี/ไม่มีมะเขือเทศ, ปุ่ม CTA เพิ่ม, สี `.footer-title` (ดู pj-footer ด้านล่าง) |
| `.btn-resume` (+`-shadow`/`-front`) | ปุ่มดาวน์โหลด Resume แบบภาพซ้อน | ต้องมี 2 รูปลูกเสมอ (shadow มาก่อน front) |
| `.pj-col` / `.pj-prose` | container กว้าง `--pj-container`(940)/ `--pj-text-max`(720) เท่านั้นในหน้าโปรเจกต์ | ห้ามสร้างความกว้าง container อื่น ยกเว้นภาพในการ์ดหรือคอลัมน์ภาพที่ระบุเฉพาะจุด (เช่น Goals 360px) |
| `.pj-card` `.pj-card-simple` `.pj-meta-item` `.pj-goals li` `.pj-ideate li` `.pj-gallery-item` `.pj-learned` | "การ์ด" ทุกชนิดในหน้าโปรเจกต์ | ทุกตัวต้องใช้ bg/border/radius/shadow/padding จาก `--pj-card-*` เท่านั้น ห้ามมีการ์ดหน้าตาอื่น |
| bullet marker (ใช้ร่วมกับการ์ด list ด้านบน) | จุดกลม 8px สี `--pj-marker` | ห้ามใช้วงกลมเลข/เครื่องหมายถูก/สีต่างกันต่อใบอีก |
| `.pj-zoom-btn` + `#pj-lightbox` | ครอบภาพที่ขยายได้ | ห้ามใส่กับภาพ Parcel tools (12–14) หรือภาพใดที่ระบุห้ามมีปุ่ม; ต้องมี `<img>` ลูกเสมอ |
| `.pj-band` | แถบ Design Process พื้นเข้ม | ใช้ gradient CSS เท่านั้น ห้ามใช้รูปพื้นหลัง แถบ `.pj-band` ใส่ pj-card ที่เป็นเนื้อหาของ section ได้ (เช่น การ์ดเป้าหมาย การ์ดภาพ) การ์ดในแถบใช้พื้นขาวตามการ์ดกลาง ห้ามใส่ของตกแต่งหรือกล่องที่ไม่ใช่เนื้อหา |
| `.pj-stepper` | ปุ่มกระโดดไป 4 ขั้นตอน | ต้องเป็น `<a href="#id">` จริง ไม่ใช่ปุ่มปลอม |
| ช่องภาพที่ไม่บังคับ | ภาพที่เจ้าของระบุว่าไม่บังคับ (เช่น cover) | ถ้าไม่มีไฟล์ ให้ไม่แสดงอะไรและไม่เว้นช่องว่าง ห้ามแสดงกล่องเปล่าหรือกล่องเทา ภาพบังคับที่หายให้แสดงกล่องเทามีชื่อไฟล์ระหว่างพัฒนา |
| ภาพมุมโปร่งใส | ภาพอุปกรณ์หรือภาพที่มุมโปร่งใส (มือถือ หลายหน้าจอ) | ลอยบนพื้นหน้า ไม่ใส่กรอบ เส้นขอบ หรือเงา ปุ่มซูมใช้ `pj-zoom-btn--bare` ภาพทึบ (หน้าจอ) ใช้ขอบ 1px และเงาตามฉาก `.pj-scene` |
| คำแปลอังกฤษ | คำแปลอังกฤษใต้ข้อความภาษาไทย | ขนาด 14px เล็กกว่าต้นฉบับ (ต้นฉบับไทย 20px) ต้องตรวจด้วย getComputedStyle ไม่ใช่อ่านค่าใน CSS เพราะความเฉพาะเจาะจงของตัวเลือกอาจทับ |

## 5. ระบบแอนิเมชัน (`motion.css` + `js/motion.js`)

| class | ใช้กับ | เวลา | ข้อห้าม |
|---|---|---|---|
| `.anim-rise` | ข้อความ/บล็อกที่ "ลอยขึ้น" | `--dur` 800ms (มือถือ 640ms), เลื่อน `--dist` 16px | ต้องอยู่ใต้ `html.js` เท่านั้นจึงจะซ่อนก่อนเผย |
| `.anim-pop` | ภาพ/ปุ่มที่ "ผุดออกมา" | `--pop-dur` 700ms (มือถือ 560ms) | ปรับ `--pop-scale/--pop-y/--pop-rotate` ต่อจุดได้ ห้ามแก้ transition หลัก |
| `.anim-handwrite` | ข้อความสไตล์ลายมือ (script font) | `--handwrite-dur` 1000ms (มือถือ 800ms), ใช้ `clip-path` | ต้อง observe wrapper ที่ไม่ถูก clip (ไม่ใช่ตัว handwrite ตรงๆ) ไม่งั้น IntersectionObserver จะไม่ทำงาน |
| `.anim-type` (`anim-type-wrap/-spacer/-visual/-cursor`) | ข้อความพิมพ์ทีละตัว | ตั้งค่า charDelay ต่อจุดผ่าน `setupTyping()` | ต้องผ่าน `PJMotion.setupTyping/playTyping` เท่านั้น ห้ามเขียนเอนจินใหม่ |

ดีเลย์ต่อ element ใช้ inline `style="--delay:Nms"` คูณกับ `--mobile-scale` (0.8 บนมือถือ) เสมอ — **ห้ามเขียนเอนจินแอนิเมชันใหม่**, ให้เพิ่มแค่ class + `--delay` แล้ว observe ผ่าน `IntersectionObserver` ใน wiring script ของหน้านั้น `prefers-reduced-motion: reduce` (ใน `motion.css`) บังคับ opacity:1/transform:none/transition:none ทุกคลาสข้างต้นทันที (ไม่มี component ไหนได้รับการยกเว้น)

## 6. กฎห้ามทั้งหมด (สรุปจากโค้ดจริง)

- ห้ามใส่ค่าสี/ขนาดที่ตรงกับตัวแปรใน `tokens.css` ซ้ำเป็นค่าตรงๆ ในไฟล์อื่น
- หน้าโปรเจกต์ห้ามมีความกว้าง container อื่นนอกจาก 940px/720px (ยกเว้นภาพในการ์ด และคอลัมน์ภาพที่ระบุเฉพาะจุด)
- การ์ดทุกใบต้องหน้าตาเดียวกันทั้งหน้า (ดูข้อ 4)
- ภาพในการ์ด/แกลเลอรี: `object-fit: contain` เท่านั้น ห้ามครอปหรือยืด ห้ามเอียง
- ภาพหาย → กล่องเทา `.pj-img-fallback` มีชื่อไฟล์ ห้ามสร้าง/หารูปมาแทนเอง
- หน้าโปรเจกต์ห้ามมีมะเขือเทศ (`.footer-tomato`) ในหน้า footer
- ห้ามแก้ `js/motion.js` / `js/lightbox.js` เพื่อทำฟีเจอร์เฉพาะหน้า — ใช้ wiring script แทน
- จุดกดทุกจุด (ปุ่ม, ลิงก์ footer, ปุ่มปิด lightbox) ≥ 44×44px

## 7. การเข้าถึง (Accessibility)

- **Reduced motion**: `motion.css` และ per-page wiring เช็ก `prefers-reduced-motion` แล้วข้าม timer/observer ทั้งหมด, CSS `!important` บังคับให้ทุกอย่างแสดงผลทันที
- **จุดกด 44×44px**: บังคับใน `.pj-back-top`, `.pj-stepper a`, `.footer-link`, `.pj-lightbox-close`
- **Alt text**: ต้องอธิบายสิ่งที่เห็นจริงในภาพ (ไม่ใช่ชื่อไฟล์หรือคำทั่วไป) — ดูตัวอย่างใน `smart-tax.html`
- **Focus-visible**: outline 3px สี `--teal-text` เป็นค่าเริ่มต้นทุกจุด ยกเว้นใน `.pj-band` (พื้นเข้ม) ที่ใช้ `--pj-dark-title` แทนเพราะ teal กลืนกับพื้นเข้ม — เป็นข้อยกเว้นที่ตั้งใจ ไม่ใช่ความไม่สอดคล้อง
- คอนทราสต์ตัวอักษรบนพื้นสีต้องวัดจริงแล้ว ≥ 4.5:1 (หรือ ≥3:1 ถ้าเป็นตัวใหญ่ตามบริบท) ก่อนเลือกใช้สี ไม่ใช้ตามความรู้สึก

## 8. ขั้นตอนสร้างหน้าโปรเจกต์ใหม่

1. คัดลอก `_templates/project.html` ไปที่ `projects/<ชื่อโปรเจกต์>.html`
2. แทนที่ placeholder ทุกจุด (`[PROJECT TITLE]`, `[LEAD]`, ฯลฯ) ด้วยเนื้อหาจริง ห้ามลบ/เปลี่ยน class
3. ใส่รูปที่ `assets/projects/<ชื่อโปรเจกต์>/` ตามชื่อไฟล์ที่ template อ้างถึง วัดขนาดจริงของไฟล์แล้วใส่ใน `width`/`height` ให้ตรง (ห้ามเดา) — ถ้าไฟล์ไหนไม่มีให้ปล่อยกล่องเทา fallback ไว้ ห้ามหารูปมาแทน
4. ลบ/คง section ที่ทำ comment ว่า optional (เช่น `.pj-band`) ตามที่โปรเจกต์นั้นต้องการจริง
5. เพิ่ม `id="projects"` และลิงก์การ์ดในหน้าแรก (`index.html`) ชี้มาไฟล์ใหม่ — เป็นการแก้ไฟล์แรกจุดเดียวที่อนุญาต
6. รันเช็กลิสต์ข้อ 9 ก่อนส่งงาน

**ข้อควรระวัง (พบซ้ำหลายครั้งระหว่างพัฒนาเว็บนี้):** ทุก `<img>` ที่ CSS บังคับ `width` (เช่น `width:100%` ใน `.pj-goals-image`, `.pj-figure img`) ต้องมี `height: auto` กำกับเสมอ ไม่งั้นเบราว์เซอร์จะใช้ค่า `height` attribute ดิบแทนการสเกลตามสัดส่วน ทำให้ภาพเพี้ยนหรือดันเลย์เอาต์ทั้งหน้าโดยไม่มีอาการเตือน (ยิ่งเห็นยากขึ้นถ้าภาพนั้น `loading="lazy"` เพราะบั๊กจะโผล่เฉพาะตอนภาพยังไม่โหลด) ตรวจทุกครั้งที่เพิ่มภาพใหม่

## 9. เช็กลิสต์ก่อนบอกว่าเสร็จ

- [ ] เนื้อหาที่ยืนยันแล้วปรากฏ "ตรงตัว" ทุกบรรทัด (เขียนสคริปต์เทียบสตริง)
- [ ] ภาพทุกไฟล์ที่อ้างถึงโหลดได้จริง (หรือ fallback ถูกต้องถ้าไฟล์หาย)
- [ ] คอนทราสต์ตัวอักษรบนพื้นสีวัดจริง ≥ เกณฑ์ที่กำหนด รายงานค่าเป็นตัวเลข
- [ ] ไม่มีแถบเลื่อนแนวนอนที่ 1440px, 1024px, 768px, 390px
- [ ] แอนิเมชัน reveal ทำงาน, `prefers-reduced-motion` แสดงทันที, ปิด JS แล้วเนื้อหาครบ
- [ ] Lightbox เปิด/ปิด/โฟกัสวนใน dialog/คืนโฟกัสถูกต้อง (เฉพาะภาพที่อนุญาต)
- [ ] แคปหน้าจอเต็มหน้าที่ 1440px และ 390px เทียบกับที่ตั้งใจไว้
- [ ] ไม่มีค่าสี/ขนาดฝังตรงที่ควรเป็นตัวแปรจาก `tokens.css`

---
*หมายเหตุ: ระหว่างเขียนเอกสารนี้ไม่พบจุดที่โค้ดสองที่ขัดแย้งกันเอง (เช่น component เดียวกันมีสี/ขนาดต่างกันโดยไม่มีเหตุผล) ยกเว้นข้อยกเว้นที่ตั้งใจ 1 จุดซึ่งระบุไว้ในข้อ 7 แล้ว*
