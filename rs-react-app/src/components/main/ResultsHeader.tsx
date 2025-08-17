import { useIntl } from 'react-intl';

const ResultsHeader = () => {
  const intl = useIntl();
  
  return (
    <div className="results-header">
      <span className="item-name">{intl.formatMessage({ id: 'results.header.name' })}</span>
      <span>{intl.formatMessage({ id: 'results.header.description' })}</span>
    </div>
  );
};

export default ResultsHeader;
