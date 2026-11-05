import { it } from 'vitest';
import { createChartEngine } from '@/lib/ziwei/engine';

it('dump stars', () => {
  const chart = createChartEngine().generateChart({
    gender: 'nam',
    calendarType: 'solar',
    year: 1990,
    month: 5,
    day: 15,
    hour: 10,
    minute: 30,
    location: { region: 'north', longitude: 105.8542 },
  });
  const ids = new Set<string>();
  for (const p of chart.palaces) {
    for (const s of [...p.majorStars, ...p.auspiciousStars, ...p.maleficStars, ...p.otherStars]) {
      ids.add(`${s.id} || ${s.name} || ${s.category}`);
    }
  }
  console.log([...ids].sort().join('\n'));
  console.log('PERIODS', JSON.stringify(chart.periods.filter((p) => p.type === 'daiHan')));
  console.log('GENDER', chart.heavenPlate.yinYangGenderLabel, chart.birthInfo.gender);
  console.log('CUC', JSON.stringify(chart.heavenPlate.fiveElementsClass));
  console.log('BODY', chart.heavenPlate.bodyPalaceName, chart.heavenPlate.bodyPalaceBranch);
  console.log(
    'PALACES',
    JSON.stringify(
      chart.palaces.map((p) => ({
        id: p.id,
        branch: p.branch,
        body: p.isBodyPalace,
        major: p.majorStars.map((s) => s.name),
        decadal: p.majorPeriod,
      }))
    )
  );
});
