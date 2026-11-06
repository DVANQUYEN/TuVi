import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';
import { decodeChartUrl } from '@/lib/utils/share';
import { createChartEngine } from '@/lib/ziwei';

function getRequestHost(request: NextRequest): string {
  const configuredUrl = process.env.NEXT_PUBLIC_APP_URL;
  if (configuredUrl) {
    try {
      return new URL(configuredUrl).host;
    } catch {
      // Fall through to the request host when the env value is not a valid URL.
    }
  }
  return new URL(request.url).host;
}

export async function GET(request: NextRequest): Promise<Response> {
  const { searchParams } = new URL(request.url);
  const data = searchParams.get('data');

  if (!data) {
    return new Response('Missing data parameter', { status: 400 });
  }

  const shareData = decodeChartUrl(data);
  if (!shareData) {
    return new Response('Invalid data', { status: 400 });
  }

  const engine = createChartEngine();
  const chart = engine.generateChart(shareData.birthInfo, shareData.preferences);
  const host = getRequestHost(request);

  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: '#0A0E1A',
        color: '#F5F5F5',
        padding: '60px',
        fontFamily: 'Inter, sans-serif',
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', marginBottom: '40px' }}>
        <h1
          style={{ fontSize: '60px', fontWeight: 'bold', color: '#D4AF37', marginBottom: '20px' }}
        >
          Lá Số Tử Vi
        </h1>
        <p style={{ fontSize: '36px', marginBottom: '10px' }}>
          {chart.birthInfo.name || 'Đương số'}
        </p>
        <p style={{ fontSize: '28px', color: '#A0A0B0' }}>
          {chart.heavenPlate.effectiveLunarDate.day}/{chart.heavenPlate.effectiveLunarDate.month}/
          {chart.heavenPlate.effectiveLunarDate.year} (Âm lịch)
        </p>
      </div>

      <div style={{ display: 'flex', gap: '40px', marginBottom: '40px' }}>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span style={{ fontSize: '20px', color: '#A0A0B0' }}>Mệnh</span>
          <span style={{ fontSize: '28px', color: '#D4AF37' }}>{chart.heavenPlate.napAm.name}</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span style={{ fontSize: '20px', color: '#A0A0B0' }}>Cục</span>
          <span style={{ fontSize: '28px', color: '#D4AF37' }}>
            {chart.heavenPlate.fiveElementsClass.name}
          </span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span style={{ fontSize: '20px', color: '#A0A0B0' }}>Chủ Mệnh</span>
          <span style={{ fontSize: '28px', color: '#D4AF37' }}>{chart.heavenPlate.soulLord}</span>
        </div>
      </div>

      <div style={{ display: 'flex', marginTop: 'auto', alignItems: 'center' }}>
        <span style={{ fontSize: '20px', color: '#A0A0B0' }}>{host}</span>
      </div>
    </div>,
    {
      width: 1200,
      height: 630,
    }
  );
}
