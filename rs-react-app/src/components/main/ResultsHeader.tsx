import { useTranslation } from 'react-i18next';

const ResultsHeader = () => {
  const { t } = useTranslation();
  
  return (
    <div className="results-header">
      <span className="item-name">{t('results.header.name')}</span>
      <span>{t('results.header.description')}</span>
    </div>
  );
};

export default ResultsHeader;
