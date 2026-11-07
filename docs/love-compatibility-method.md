# Phương pháp luận giải tương hợp tình cảm

Phiên bản: **2.0.0**

## Mục tiêu

Đối chiếu có chọn lọc hai lá số Tử Vi để đưa ra một bản luận giải tình cảm có thể giải thích
được: nêu rõ cung, sao và quan hệ nào đóng góp vào kết quả, thay vì chỉ dựa vào tuổi hay một
vài yếu tố rời rạc. Kết quả gồm năm khía cạnh, một phần thời vận tham khảo tách riêng, các
điểm hòa hợp, điều cần lưu ý và lời khuyên.

Đây là **mô hình tham chiếu**, không phải bản luận giải đầy đủ và không phải lời phán quyết
định mệnh. Kết quả phụ thuộc vào độ chính xác của ngày giờ sinh, cách quy đổi âm dương lịch
và trường phái an sao.

## Nguyên tắc về trọng số

Các trọng số dưới đây là **thang biên soạn có chủ đích** dựa trên những nguyên lý cổ điển
quen thuộc của Tử Vi (nạp âm, ngũ hành cung Mệnh/Thân/Cục, cung Phu Thê và tam phương, can
chi, tương tác cung vị). Đây **không phải công thức số học chính thống** và không có văn bản
cổ điển nào quy định các tỷ lệ này. Mọi con số đều có thể được điều chỉnh khi có cơ sở luận
giải rõ ràng hơn.

Các khía cạnh có phần **chồng lấn**: sao tại cung Phu Thê được dùng cho cả khía cạnh Cung Phu
Thê, Tương hợp tinh tú và Tương tác cung vị. Khía cạnh Cung Phu Thê phản ánh chất lượng nền
duyên hôn nhân của mỗi người, không phải một phép đo thuần túy cặp đôi.

## Năm khía cạnh và trọng số

Điểm tổng trên thang điểm 100 bằng tổng có trọng số của năm khía cạnh, mỗi khía cạnh chấm trên
thang điểm 10. Giao diện hiển thị điểm tổng dạng `x/100` dưới nhãn `Độ tương hợp` (không dùng
nhãn “Điểm hợp nhau”) và điểm từng khía cạnh dạng `x/10`; phần giải thích định tính đi kèm không
chứa điểm số.

| Khía cạnh | Trọng số | Nội dung chính |
| --- | ---: | --- |
| Nền tảng bản mệnh (`foundation`) | 20% | Nạp âm 35%, ngũ hành cung Mệnh 35%, ngũ hành Cục 20%, ngũ hành cung Thân 10%. |
| Cung Phu Thê (`marriagePalace`) | 30% | Chất lượng nền duyên hôn nhân của mỗi người: tự thân 65%, tam phương 35%; lấy trung bình hai lá số. |
| Tương hợp tinh tú (`starSynergy`) | 20% | Chính tinh nơi Mệnh, Phu Thê và Thân; Tứ Hóa; sao tình cảm; chính tinh hung. |
| Can Chi bốn trụ (`canChi`) | 20% | Địa chi và thiên can của cả bốn trụ năm/tháng/ngày/giờ. |
| Tương tác cung vị (`crossPalace`) | 10% | Phu Thê lá số này với Mệnh lá số kia, và Phu Thê hai bên. |

Ngưỡng xếp loại: từ 70 điểm là `tốt`, từ 50 đến dưới 70 là `trung bình`, dưới 50 là `xấu`.
Lời khuyên tổng cũng dùng đúng ba ngưỡng này.

## Kết luận khẩu khí

Giao diện hiển thị điểm tổng `/100` dưới nhãn `Độ tương hợp` (không dùng nhãn “Điểm hợp nhau”)
và điểm từng khía cạnh `/10`. Điểm thời vận chỉ mang tính tham khảo, không nằm trong tỷ lệ tương
hợp và không tham gia vào điểm tổng. Khối phương pháp trong giao diện nêu rõ trọng số của năm
khía cạnh. Câu khẩu khí là kết luận định tính đi kèm điểm số; người dùng thấy cả điểm, mức xếp
loại, câu khẩu khí ngắn và phần luận giải định tính.

Câu khẩu khí là **cách diễn đạt văn hóa có chọn lọc**, không phải lời phán quyết định mệnh.
Nó không khẳng định duyên phận cố định, không bảo đảm kết quả và không thay thế lựa chọn, nỗ
lực hay hoàn cảnh sống của hai người. Mỗi câu đều ngắn (khoảng 60–70 ký tự khi có thể) để đọc
gọn trên một dòng máy tính và tối đa hai dòng trên điện thoại.

- Dải điểm của khẩu khí: `high` từ 70 trở lên, `balanced` từ 50 đến dưới 70, `challenging`
  dưới 50. Trường `conclusion.tone` phản ánh dải này.
- Mỗi dải có **50 câu**, tổ chức thành 10 nhóm tất định × 5 nhánh nền. Câu khẩu khí được chọn
  **tất định** theo dải điểm và hồ sơ năm khía cạnh, không ngẫu nhiên:
  - Nhánh nền (chỉ số 0–4) do hồ sơ khía cạnh quyết định:
    - `high`:
      - Cung Phu Thê từ 7 và Tương hợp tinh tú từ 7: câu về âm dương thuận hòa, phu thê vinh
        hiển khi cả hai đồng lòng (0).
      - Nền tảng bản mệnh từ 7 và Tương tác cung vị từ 7: câu về đôi bên tương sinh tương trợ,
        gia đạo hưng long nhờ đồng tâm vun đắp (1).
      - Can Chi từ 7: câu về thiên định lương duyên, còn bền lâu là nhờ nghĩa tình và nhường
        nhịn (3).
      - Tương tác cung vị từ 7: câu về tơ hồng se mối, đôi người nâng đỡ nhau thì đường dài
        cũng vững (4).
      - Các trường hợp còn lại: câu về duyên lành gặp hội, một đời ấm áp nhờ đôi tay cùng vun đắp
        (2).
    - `balanced`: ưu tiên Tương tác cung vị từ 6 (0); kế đến Can Chi từ 5,5 (1), Cung Phu Thê
      từ 6 (3) rồi nền tảng bản mệnh từ 6 (4); còn lại dùng câu về âm dương lệch pha đôi chút (2).
    - `challenging`: ưu tiên Cung Phu Thê dưới 5 (0); kế đến nền tảng bản mệnh dưới 5 (1),
      Tương tác cung vị dưới 5 (3) và Can Chi dưới 5 (4); còn lại dùng câu về nhiều điểm xung,
      khẩu thiệt dễ sinh (2).
  - Nhóm (0–9) do một hàm băm tất định của điểm tổng và năm điểm khía cạnh (quy về phần mười),
    kết hợp với dấu hiệu của các cung trọng yếu (Mệnh, Phu Thê, Thân): tên/cặp sao, Tứ Hóa
    (mutagen), độ sáng, Tuần/Triệt và can chi của cung. Dấu hiệu của hai lá số được sắp xếp
    trước khi băm nên thứ tự hai lá số không làm đổi câu. Chỉ số câu cuối = nhánh nền + nhóm × 5
    (nhóm 0–9, mỗi nhóm 5 câu).
  - Cùng đầu vào và cùng năm xem cho cùng một câu; các hồ sơ khác nhau phân bố câu đa dạng hơn
    thay vì dồn về một câu cho mỗi nhánh. Cách chọn vẫn hoàn toàn tất định, không ngẫu nhiên.
- Mỗi dải có nhiều câu dự phòng để kết luận phù hợp bối cảnh. Câu `high` luôn có yếu tố chủ
  động hoặc điều kiện của con người (vun đắp, đồng lòng, nhường nhịn, nâng đỡ). Câu `balanced`
  giữ giọng khuyên nhủ, có điều kiện. Câu `challenging` **luôn kèm một lời kêu gọi hành động**
  (cần nhẫn nhịn, tu tâm, khắc chế cái tôi, bền tâm), không chỉ dừng ở lời phán đoán tiêu cực.
- Điểm từng khía cạnh được tầng dữ liệu chuyển thành trường `quality`:
  - `cat` — Cát lợi;
  - `binh` — Bình hòa;
  - `canLuuY` — Cần lưu ý.

  `quality` được đặt cùng lúc với `meaning` bằng chính ngưỡng của từng khía cạnh: Nền tảng bản
  mệnh dùng 7,5 và 5,5; bốn khía cạnh còn lại dùng 7 và 5. Giao diện chỉ hiển thị nhãn do dữ
  liệu cung cấp, không tự tính lại ngưỡng. Điểm thời vận không được hiển thị hay chấm vào độ
  tương hợp; mục `Vận trình hiện tại` trong giao diện chỉ trình bày bối cảnh đại vận/tiểu vận/lưu
  niên.


## Giá trị trung tính khi thiếu dữ liệu

- Quan hệ ngũ hành, địa chi hoặc thiên can chưa xác định: **5**.
- Thiếu cung, cung không có chính tinh hoặc thiếu cả ba cung tam phương: **5,5**.
- Cung Vô chính diệu là trạng thái hợp lệ, không tự động bị coi là dữ liệu lỗi.

## Quy tắc chấm từng khía cạnh

### 1. Nền tảng bản mệnh

Mỗi cặp ngũ hành được chấm theo quan hệ: cùng hành 7, tương sinh (một trong hai chiều) 9,
tương khắc (một trong hai chiều) 3, trung tính 5. Thiếu dữ liệu quan hệ thì dùng 5.

Điểm khía cạnh = 0,35 × nạp âm + 0,35 × cung Mệnh + 0,20 × Cục + 0,10 × cung Thân.

Nếu cung Thân trùng cung Mệnh ở **cả hai** lá số, cặp ngũ hành Thân chính là cặp ngũ hành
Mệnh. Khi đó bỏ thành phần Thân và chuẩn hóa lại các trọng số còn lại để không tính cùng một
yếu tố hai lần.

### 2. Cung Phu Thê

Với mỗi lá số:

- Nếu có chính tinh, nền tự thân là 6; nếu Vô chính diệu là 5,5.
- Điều chỉnh độ sáng trung bình: Miếu +3, Vượng +2,5, Đắc +2, Bình 0, Hãm −3; nhãn không
  nhận diện được tính 0.
- Điều chỉnh tính chất trung bình: cát +0,8, hung −1,2, trung 0.
- Điều chỉnh Tứ Hóa trung bình của chính tinh: Hóa Lộc +1,2, Hóa Quyền +0,8, Hóa Khoa +0,8,
  Hóa Kỵ −1,8.
- Phụ tinh tình cảm: Đào Hoa, Hồng Loan, Thiên Hỷ +0,8; Thiên Diêu +0,4; Hàm Trì +0,3;
  Mộc Dục +0,2; Thai +0,3; Văn Xương, Văn Khúc, Tả Phù, Hữu Bật, Thiên Riêu +0,3.
- Sao cần lưu tâm: Cô Thần, Quả Tú −0,9; Địa Không, Địa Kiếp −0,8; Kình Dương −0,7;
  Đà La, Hỏa Tinh, Linh Tinh −0,6; Thiên Hình, Thiên Khốc, Thiên Hư −0,3.
- Tổng điều chỉnh phụ tinh được giới hạn trong khoảng ±2.
- Hóa Kỵ chỉ được tính **một lần**: nếu Hóa Kỵ đã nằm trong thuộc tính Tứ Hóa của một chính
  tinh thì dùng mức −1,8 ở trên; nếu Hóa Kỵ chỉ xuất hiện như một sao phụ hoặc tên sao riêng
  thì trừ −1,0. Hai trường hợp không cộng dồn.
- Tuần hoặc Triệt tại cung Phu Thê: mỗi yếu tố −1.

Tam phương của Phu Thê gồm ba cung Phúc Đức, Quan Lộc, Thiên Di (không tính lại chính cung
Phu Thê). Mỗi cung được chấm chất lượng chính tinh: nền 5,5 cộng điều chỉnh độ sáng, tính chất
và Tứ Hóa; cung không có chính tinh dùng 5,5. Lấy trung bình ba cung.

Điểm của một lá số = 0,65 × tự thân + 0,35 × tam phương. Điểm khía cạnh là trung bình hai lá số.

### 3. Tương hợp tinh tú

Đối chiếu chính tinh trong Mệnh và Phu Thê, thêm cung Thân nếu khác hai cung trên.

- Nền 5,5. Mỗi chính tinh trùng nhau +1,5, tối đa +3.
- Lấy tối đa hai chính tinh chủ chốt mỗi lá số (xếp theo chất lượng, hòa điểm thì theo mã
  sao). Trung bình quan hệ ngũ hành của các cặp rồi trộn 50/50 với nền; nếu không có cặp nào
  thì giữ nền 5,5.
- Tứ Hóa nơi các cung chủ chốt: Hóa Lộc, Hóa Khoa, Hóa Quyền +0,5 mỗi sao; Hóa Kỵ −0,8 mỗi
  sao; tổng điều chỉnh giới hạn ±2.
- Nếu cả hai lá số có ít nhất một trong Đào Hoa, Hồng Loan, Thiên Hỷ tại Mệnh hoặc Phu Thê:
  +0,8; chỉ một lá số: +0,2; không có: 0.
- Mỗi chính tinh hung trong các cung chủ chốt −0,4, tối đa −1,5.
- Điểm được giới hạn trong thang điểm 10 (sàn 1).

### 4. Can Chi bốn trụ

Quan hệ địa chi: cùng chi 6, tam hợp 9, lục hợp 8, lục xung 2, lục hại 3,5, trung tính 5.
Áp dụng cho từng trụ với trọng số năm 0,35; tháng 0,20; ngày 0,30; giờ 0,15.

Thiên can cũng được tính cho **cả bốn trụ**: ngũ hợp 9, cùng can 7, còn lại 5. Trọng số thiên
can: năm 0,30; tháng 0,20; ngày 0,35; giờ 0,15 (nhấn ngày sinh hơn năm một chút).

Điểm khía cạnh = 0,8 × tổng địa chi có trọng số + 0,2 × tổng thiên can có trọng số.

### 5. Tương tác cung vị

So sánh địa chi của ba cặp:

- Phu Thê lá số thứ nhất với Mệnh lá số thứ hai: 35%.
- Phu Thê lá số thứ hai với Mệnh lá số thứ nhất: 35%.
- Phu Thê hai bên với nhau: 30%.

Chỉ dùng quan hệ địa chi để chấm điểm. Quan hệ ngũ hành của hai cung được nêu trong phần
giải thích để làm rõ bối cảnh, không cộng vào điểm. Thiếu một trong hai cung thì cặp đó dùng
mức trung tính 5,5.

## Thời vận tham khảo

Phần này **không nằm trong tỷ lệ tương hợp** và không tham gia vào điểm tổng thang điểm 100.
Điểm thời vận không được hiển thị hay chấm vào độ tương hợp; mục `Vận trình hiện tại` trong giao
diện chỉ trình bày bối cảnh đại vận/tiểu vận/lưu niên. Thời vận được tính **theo lá số thứ nhất**,
nên có thể khác khi hoán đổi thứ tự hai lá số.

- Năm xem mặc định là năm hiện tại, có thể truyền `currentYear` để cố định kết quả. Biểu mẫu
  dùng cùng một năm cho cả `viewingYear` của lá số và `calculateCompatibility`.
- Tuổi = năm xem − năm sinh + 1.
- Tìm đại hạn đang hoạt động theo `startAge`/`endAge`; tìm lưu niên có `solarYear` trùng năm xem.
- Điểm bắt đầu từ 5: +2 nếu đại hạn đi qua cung Phu Thê; +1 nếu đi qua cung Mệnh hoặc cung
  Thân; +1,5 nếu cung lưu niên có Đào Hoa, Hồng Loan hoặc Thiên Hỷ.
- Trừ 2 điểm nếu cung lưu niên có bất kỳ “sao cần lưu tâm” nào: Cô Thần, Quả Tú, Địa Không,
  Địa Kiếp, Kình Dương, Đà La, Hỏa Tinh, Linh Tinh, Thiên Hình, Thiên Khốc, Thiên Hư, hoặc
  Hóa Kỵ. Giới hạn trong thang điểm 10 (sàn 1).
- Thiếu dữ liệu đại hạn/lưu niên thì trả về mức trung hòa 5 kèm ghi chú; nếu có đại hạn nhưng
  không có lưu niên đúng năm, phần đại hạn vẫn được dùng và không báo lỗi.

## Chất lượng dữ liệu

Kết quả có trường `dataQuality`:

- `full`: đủ cung Mệnh, Phu Thê, Thân, đủ bốn trụ can chi, có chính tinh trong lá số, có nạp
  âm và ngũ hành Cục.
- `partial`: thiếu một trong các dữ liệu trên. Khi đó `dataWarnings` liệt kê phần còn thiếu và
  giao diện hiển thị cảnh báo, gọi kết quả là “Kết quả tham khảo” thay vì trình bày như một
  kết luận chắc chắn.

## Giới hạn dữ liệu

- Giờ sinh sai lệch có thể làm đổi cung Mệnh, cung Thân, giờ trụ và nhiều sao an theo giờ.
- Ngày sinh trước Tết âm lịch có thể thuộc năm âm lịch trước đó; cần kiểm tra quy đổi lịch.
- Các trường phái an sao và bảng độ sáng khác nhau có thể cho kết quả khác nhau.
- Phụ tinh và Tứ Hóa có thể được biểu diễn khác nhau giữa các nguồn dữ liệu; mô hình nhận
  diện theo cả mã và tên tiếng Việt nhưng vẫn có thể bỏ sót biến thể chưa biết.
- Mô hình không xét hoàn cảnh sống, lựa chọn cá nhân, kỹ năng giao tiếp hay nỗ lực thực tế
  của hai người.

## Bảo đảm kỹ thuật

- Hàm công khai: `calculateCompatibility(chart1, chart2, options?)`.
- Kết quả xác định: cùng đầu vào và cùng `currentYear` cho cùng đầu ra.
- Điểm và `meaning` của năm khía cạnh không phụ thuộc thứ tự hai lá số. Phần giải thích chi
  tiết, thứ tự `strengths`/`challenges` và thời vận có thể lấy theo lá số thứ nhất.
- Không dùng ngẫu nhiên và không thêm phụ thuộc ngoài.
