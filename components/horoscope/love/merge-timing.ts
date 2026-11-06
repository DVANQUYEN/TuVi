/**
 * Thời lượng hiệu ứng gộp hai mệnh chủ trên huy hiệu.
 *
 * Giá trị này được dùng cho animation CSS và được truyền vào huy hiệu qua thuộc
 * tính `data-merge-duration-ms` cùng biến CSS `--love-emblem-merge-duration`.
 */
export const LOVE_EMBLEM_MERGE_DURATION_MS = 3000;

/** Khoảng lặng ngắn sau khi animation kết thúc, trước khi công bố kết quả. */
export const LOVE_RESULT_REVEAL_DELAY_MS = 1000;

/** Tổng thời gian từ lúc bắt đầu gộp tới lúc hiện kết quả bên phải. */
export const LOVE_TOTAL_REVEAL_MS =
  LOVE_EMBLEM_MERGE_DURATION_MS + LOVE_RESULT_REVEAL_DELAY_MS;

/** Tên ngắn tương thích với các nơi đang dùng hằng số này. */
export const MERGE_DURATION_MS = LOVE_EMBLEM_MERGE_DURATION_MS;
