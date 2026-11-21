# IEPVN v1.4.1 – Website tĩnh cho Cloudflare Pages

**IEP – Intelligent Ecosystem Partners · Creating Value · Delivering Success**

Bản chuyển đổi iepvn.com từ WordPress/Elementor sang HTML tĩnh chạy trên **Cloudflare Pages**.

## v1.4.1 – Sửa lỗi deploy xong vẫn thấy bản cũ
Đường dẫn CSS/JS trong HTML có kèm số phiên bản (`?v=1.4.1`), và trang HTML luôn được kiểm tra bản mới. **Lần sau sửa CSS/JS, nhớ tăng số phiên bản** (tìm `?v=` trong các file `.html`, đổi sang số mới) trước khi deploy.

## Có gì mới trong v1.4 – Chatbot gọn hơn, tự nhận diện ngôn ngữ
- Bỏ câu chào, bỏ các câu hỏi gợi ý và bỏ nút chuyển EN/VI. Khung chat mở ra trống, chỉ có logo IEP mờ ở giữa.
- **Tự trả lời theo ngôn ngữ của từng câu hỏi:** tiếng Việt (có dấu hoặc không dấu) thì trả lời tiếng Việt, tiếng Anh thì trả lời tiếng Anh. Tiếng Trung/Nhật/Hàn do AI tự trả lời theo đúng ngôn ngữ đó. Tiêu đề và ô nhập của khung chat cũng tự đổi theo.
- Câu hỏi dài hoặc hỏi nhiều ý cùng lúc được chuyển cho AI trả lời đầy đủ, thay vì chỉ trả lời một ý bằng câu có sẵn.

## Chatbot "IEP Assistant" (từ v1.3)

Chatbot cũ là một phần của WordPress nên đã mất cùng WordPress. Bản này có chatbot riêng cho IEPVN, chạy hoàn toàn trong tài khoản Cloudflare của anh.

- **Nút chat:** hình tròn navy có logo IEP màu vàng ở góc phải mọi trang. Khung chat có nút "Talk to our team" dẫn tới form liên hệ. Trên điện thoại khung chat mở toàn màn hình.
- **Tầng 1 – trả lời ngay trên trình duyệt** (`assets/js/chatbot.js`): khoảng 25 câu hỏi thường gặp, bằng tiếng Anh và tiếng Việt. Gõ không dấu hoặc sai chính tả nhẹ vẫn hiểu. Không tốn chi phí AI.
- **Tầng 2 – Workers AI** (`functions/api/chat.js`): dùng cho câu hỏi khác. Bot **chỉ trả lời theo nội dung website** (kho kiến thức nằm trong file này). Bot trả lời theo ngôn ngữ người hỏi, không tự bịa số liệu, và mời khách để lại thông tin khi họ hỏi về dự án cụ thể.
- **Chống lạm dụng:** chỉ nhận yêu cầu từ chính website; giới hạn 20 câu mỗi 5 phút cho mỗi IP; câu hỏi tối đa 600 ký tự.

**Sửa nội dung chatbot:**
- Câu trả lời nhanh: sửa mảng `FAQ` trong `assets/js/chatbot.js`.
- Kiến thức cho AI: sửa đoạn `KB` trong `functions/api/chat.js`.
- Sửa xong chạy lại lệnh deploy.

**Chi phí:** Workers AI tính theo lượng dùng của tài khoản Cloudflare. Câu hỏi thường gặp được trả lời trên trình duyệt nên không tốn phí. Có thể đổi model AI bằng biến `CHAT_MODEL`.

**Lưu ý:** phải deploy bằng lệnh `wrangler` như hướng dẫn. Kéo thả trên dashboard sẽ không chạy được form liên hệ lẫn chatbot AI (khi đó chỉ còn phần câu hỏi thường gặp).

## Thay đổi ở v1.2 (18/11/2026)

Website **tự chạy hoàn toàn, không còn phụ thuộc WordPress** (WordPress cũ đã ngừng hoạt động). Giải nén là deploy được ngay, không cần tải ảnh.

Các ảnh lấy từ WordPress được thay bằng đồ hoạ vẽ sẵn (SVG/HTML) theo đúng bảng màu:

| Vị trí | v1.1 (ảnh WordPress) | v1.2 |
|---|---|---|
| Banner trang chủ | 3 ảnh chụp | Nền thành phố + mạng kết nối vẽ bằng SVG (`hero-skyline.svg`) |
| Industrial Ecosystem Framework | Ảnh infographic `eco.jpg` | Sơ đồ HTML: IEP ở giữa, 6 trụ cột, 4 Core Benefits (sửa chữ trực tiếp trong HTML được) |
| Working Experience | Logo 5 công ty | Thẻ tên công ty dạng chữ |
| Northeast Asia Investment Bridge | Ảnh bản đồ | Sơ đồ hành lang Seoul/Tokyo/Shanghai/Taipei → TP. Hồ Chí Minh |
| 4 vùng FDI | Ảnh bản đồ Việt Nam | Sơ đồ hành lang Bắc–Nam với 4 vùng |
| Form liên hệ | Ảnh nền | Nền gradient xanh navy |
| Ảnh bìa bài Insight | 6 ảnh | Ảnh bìa tự tạo: tiêu đề bài + logo IEP |

Ngoài ra:
- Bỏ thư mục `scripts/` (không còn cần tải ảnh).
- Bỏ mọi chuyển hướng sang `wp.iepvn.com`. Link bài viết cũ và `/wp-content/*` chuyển về trang Insight hoặc trang chủ.
- **Bài viết Insight:** WordPress đã ngừng nên nội dung chi tiết không còn lấy được. Trang Insight hiện tiêu đề, ngày và tóm tắt từng bài. Nếu còn bản Word hoặc bản gốc của bài, gửi lại để dựng thành trang riêng.
- Muốn dùng lại ảnh chụp làm banner: chép ảnh (1920×1080) vào `assets/img/`, rồi trong `index.html` đổi `hero-skyline.svg` thành tên file ảnh.

## Thay đổi ở v1.1 (18/11/2026)

- **Màu và font đo trực tiếp từ iepvn.com** (bằng trình duyệt) thay cho màu lấy mẫu từ ảnh chụp. Xem bảng bên dưới.
- **Bố cục từng khối dựng theo trang thật:**
  - Leadership: nền kem, trích dẫn chữ có chân nghiêng, hàng logo "Working Experience".
  - What We Do: tab vàng/xanh, có các mục +/– đóng mở.
  - Perspectives: video bên trái.
  - Northeast Asia Investment Bridge: 4 thẻ kèm bản đồ.
  - 4 vùng FDI: bản đồ bên trái, thẻ bên phải.
  - Form liên hệ: có ảnh nền.
  - Khối Insight ở trang chủ.
  - Footer: Newsletter có nút Subscribe vàng.
- **Nội dung trang chủ là nguyên văn** từ trang thật (bản v1.0 có một số đoạn viết lại).
- **Trang Ecosystem làm lại hoàn chỉnh:** bản trên web đang trả về trang trắng cho trình duyệt. Nội dung nguyên văn được lấy từ WordPress REST API, trình bày gồm 6 trụ cột, lộ trình 4 giai đoạn, 4 lợi ích cốt lõi, phần kết luận và CTA.
- **Đổi tên** "Industrial Ecosystem Partners" thành **"Intelligent Ecosystem Partners"** ở header, footer, tiêu đề trang, meta SEO và logo footer (`logo-full.png` đã vẽ lại). Cụm "Industrial Ecosystem Framework" là tên khung giải pháp, không phải tên công ty, nên giữ nguyên.
- **Ảnh lãnh đạo:** ảnh mới gửi chỉ có 168×198px, không đủ nét, nên giữ ảnh cũ và chỉ đổi màu áo vest sang xanh navy như ảnh mới (`assets/img/leader.jpg`).
- **Sửa lỗi chữ:** "IEP turn" → "IEP turns", "SOM ready-build" → "SQM ready-built", TAIWAIN → Taiwan, INTERGRATION → Integration, "Phat Đat" → "Phat Dat", bỏ "Bac Ninh" bị lặp, "Daklak" → "Dak Lak", Copyright 2025 → năm hiện tại (tự cập nhật).

## ⚠️ Về site WordPress cũ
Site cũ từng bị chèn mã độc: spam casino, bài rác, và mã che giấu nội dung (cloaking). Dù WordPress đã ngừng, vẫn nên đổi mật khẩu hosting/cPanel/database. Nếu hosting còn lưu dữ liệu, nên xoá hẳn để không bị dùng lại.

## Bảng màu và font (`assets/css/style.css`, phần `:root`)

| Biến | Mã | Dùng ở |
|---|---|---|
| `--navy` | `#000080` | Header, dải số liệu, tab, nút Submit/Learn more |
| `--blue` | `#1b3e87` | Tất cả tiêu đề, trích dẫn, chữ trong thẻ |
| `--gold` | `#b8922a` | Menu, số liệu, tab đang chọn, nút Subscribe, chân footer |
| `--gold-dark` | `#5a4613` | Dòng hero "IEP turns potential into reality" |
| `--cream` | `#f2ede4` | Nền Leadership / Perspectives / Regions, ô nhập form |
| `--indigo` | `#11105c` | Footer |
| `--text` | `#1f2124` | Chữ nội dung |

**Font:**
- **Inter:** tiêu đề, menu, số liệu, nút.
- **Roboto:** chữ nội dung, nhãn.
- **Times New Roman nghiêng:** chỉ dùng cho câu trích dẫn của lãnh đạo, giống trang thật.

Trên trang WordPress, nhiều đoạn văn hiện bằng Times New Roman vì widget chưa được gán font, đó là lỗi. Bản này dùng Roboto cho các đoạn đó.

## Triển khai (Cloudflare Pages)

Cần cài **Node.js LTS** (nodejs.org). Mở PowerShell/Terminal **trong thư mục này** (thư mục có `index.html`).

1. Mở `wrangler.toml`, đổi `CONTACT_TO` thành email nhận form liên hệ.
2. Deploy:
   ```bash
   npx wrangler login
   npx wrangler pages project create iepvn --production-branch main
   npx wrangler pages deploy . --project-name iepvn --branch main
   ```
   Lệnh `login` mở trình duyệt, chọn tài khoản Cloudflare có domain iepvn.com rồi bấm Allow. Deploy xong sẽ có link `https://iepvn.pages.dev` để xem thử.
3. Form liên hệ gửi email qua Resend (có thể làm sau):
   ```bash
   npx wrangler pages secret put RESEND_API_KEY --project-name iepvn
   ```
   Sau đó chạy lại lệnh deploy ở bước 2. Khi chưa cấu hình, form chỉ báo "not configured yet", không làm lỗi trang. Lưu ý khi verify domain trên Resend: **không xoá hay sửa bản ghi MX/SPF của Google Workspace**.
4. Gắn tên miền: Workers & Pages > **iepvn** > **Custom domains** > thêm `iepvn.com`, rồi thêm `www.iepvn.com`. Khi Cloudflare báo đã có bản ghi cũ thì đồng ý thay thế. Các bản ghi MX/TXT của email giữ nguyên.

Mỗi lần sửa nội dung, chỉ cần chạy lại lệnh `npx wrangler pages deploy . --project-name iepvn --branch main`.

## Việc còn lại
- **Bài viết Insight:** cần bản gốc (Word/Google Docs) để dựng thành trang chi tiết.
- **Trang Investment Guide:** nội dung là bản dựng lại từ trang cũ, nên đối chiếu nếu còn bản gốc.
- **Link mạng xã hội** ở footer đang là `#` (tìm `data-todo="social-link"`).
- **Các trang ngôn ngữ khác** (Tiếng Việt, 中文, 日本語, 한국어) chưa chuyển.


## Chạy thử trên máy
```bash
npx wrangler pages dev .    # có cả form /api/contact
python3 -m http.server 8080 # chỉ xem giao diện
```
