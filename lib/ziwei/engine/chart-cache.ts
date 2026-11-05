import type { ZiweiChart } from '../types/chart';

interface CacheOptions {
  maxSize: number;
  ttl?: number; // milliseconds
}

interface CacheEntry {
  chart: ZiweiChart;
  timestamp: number;
}

/**
 * LRU Cache cho kết quả lá số.
 * Giới hạn số lượng entries, tự động xóa entries cũ nhất.
 */
export class ChartCache {
  private readonly cache: Map<string, CacheEntry>;
  private readonly maxSize: number;
  private readonly ttl: number;

  constructor(options: CacheOptions) {
    this.cache = new Map();
    this.maxSize = options.maxSize;
    this.ttl = options.ttl ?? 24 * 60 * 60 * 1000; // Mặc định: 24 giờ
  }

  /**
   * Lấy lá số từ cache.
   *
   * @param key - Khóa cache.
   * @returns Lá số nếu tồn tại và chưa hết hạn, ngược lại null.
   */
  get(key: string): ZiweiChart | null {
    const entry = this.cache.get(key);

    if (!entry) {
      return null;
    }

    // Kiểm tra TTL
    const now = Date.now();
    if (now - entry.timestamp > this.ttl) {
      this.cache.delete(key);
      return null;
    }

    // Di chuyển entry xuống cuối (mới nhất sử dụng)
    this.cache.delete(key);
    this.cache.set(key, entry);

    return entry.chart;
  }

  /**
   * Lưu lá số vào cache.
   *
   * @param key - Khóa cache.
   * @param chart - Lá số cần lưu.
   */
  set(key: string, chart: ZiweiChart): void {
    // Xóa nếu đã tồn tại
    if (this.cache.has(key)) {
      this.cache.delete(key);
    }

    // Xóa entry cũ nhất nếu đầy
    if (this.cache.size >= this.maxSize) {
      const firstKey = this.cache.keys().next().value;
      if (firstKey !== undefined) {
        this.cache.delete(firstKey);
      }
    }

    this.cache.set(key, {
      chart,
      timestamp: Date.now(),
    });
  }

  /**
   * Xóa toàn bộ cache.
   */
  clear(): void {
    this.cache.clear();
  }

  /**
   * Số lượng entries trong cache.
   */
  get size(): number {
    return this.cache.size;
  }
}
