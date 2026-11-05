import standardCases from './standard-cases.json';
import tetDivergenceCases from './tet-divergence-cases.json';
import leapMonthCases from './leap-month-cases.json';
import ziHourBoundaryCases from './zi-hour-boundary-cases.json';

export const STANDARD_FIXTURES = standardCases;
export const TET_DIVERGENCE_FIXTURES = tetDivergenceCases;
export const LEAP_MONTH_FIXTURES = leapMonthCases;
export const ZI_HOUR_BOUNDARY_FIXTURES = ziHourBoundaryCases;

export const ALL_FIXTURES = [
  ...STANDARD_FIXTURES,
  ...TET_DIVERGENCE_FIXTURES,
  ...LEAP_MONTH_FIXTURES,
  ...ZI_HOUR_BOUNDARY_FIXTURES,
];
