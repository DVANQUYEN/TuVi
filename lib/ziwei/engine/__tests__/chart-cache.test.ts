import { describe, it, expect } from 'vitest';
import { ChartCache } from '../chart-cache';
import type { ZiweiChart } from '../../types/chart';

describe('ChartCache', () => {
  it('stores and retrieves charts', () => {
    const cache = new ChartCache({ maxSize: 10 });
    const mockChart = { id: 'mock' } as unknown as ZiweiChart;

    cache.set('key1', mockChart);
    const retrieved = cache.get('key1');

    expect(retrieved).toBe(mockChart);
  });

  it('returns null for missing keys', () => {
    const cache = new ChartCache({ maxSize: 10 });
    expect(cache.get('nonexistent')).toBeNull();
  });

  it('evicts oldest when at capacity', () => {
    const cache = new ChartCache({ maxSize: 2 });
    const chart1 = { id: 1 } as unknown as ZiweiChart;
    const chart2 = { id: 2 } as unknown as ZiweiChart;
    const chart3 = { id: 3 } as unknown as ZiweiChart;

    cache.set('key1', chart1);
    cache.set('key2', chart2);
    cache.set('key3', chart3); // Should evict key1

    expect(cache.get('key1')).toBeNull();
    expect(cache.get('key2')).toBe(chart2);
    expect(cache.get('key3')).toBe(chart3);
  });

  it('keeps recently read entries when evicting (LRU)', () => {
    const cache = new ChartCache({ maxSize: 2 });
    const chart1 = { id: 1 } as unknown as ZiweiChart;
    const chart2 = { id: 2 } as unknown as ZiweiChart;
    const chart3 = { id: 3 } as unknown as ZiweiChart;

    cache.set('key1', chart1);
    cache.set('key2', chart2);
    expect(cache.get('key1')).toBe(chart1); // key1 is now most recently used

    cache.set('key3', chart3); // Should evict key2

    expect(cache.get('key1')).toBe(chart1);
    expect(cache.get('key2')).toBeNull();
    expect(cache.get('key3')).toBe(chart3);
  });

  it('overwrites an existing key without growing the cache', () => {
    const cache = new ChartCache({ maxSize: 2 });
    const original = { id: 'original' } as unknown as ZiweiChart;
    const updated = { id: 'updated' } as unknown as ZiweiChart;

    cache.set('key1', original);
    cache.set('key1', updated);

    expect(cache.size).toBe(1);
    expect(cache.get('key1')).toBe(updated);
  });

  it('clears all entries', () => {
    const cache = new ChartCache({ maxSize: 10 });
    cache.set('key1', {} as unknown as ZiweiChart);
    cache.set('key2', {} as unknown as ZiweiChart);

    cache.clear();

    expect(cache.size).toBe(0);
    expect(cache.get('key1')).toBeNull();
  });

  it('respects TTL', async () => {
    const cache = new ChartCache({ maxSize: 10, ttl: 100 });
    cache.set('key1', {} as unknown as ZiweiChart);

    // Wait for TTL to expire
    await new Promise((resolve) => setTimeout(resolve, 150));

    expect(cache.get('key1')).toBeNull();
  });
});
