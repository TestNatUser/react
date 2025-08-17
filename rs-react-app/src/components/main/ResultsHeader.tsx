'use client';

import { useTranslations } from 'next-intl';

const ResultsHeader = () => {
  const t = useTranslations();

  return (
    <div className="results-header">
      <span className="item-name">{t('results.header.name')}</span>
      <span>{t('results.header.description')}</span>
    </div>
  );
};

export default ResultsHeader;
