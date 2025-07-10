import { Component } from 'react';

class ResultsHeader extends Component {
  render() {
    return (
      <div className="results-header">
        <span className="item-name">Item Name</span>
        <span>Item Description</span>
      </div>
    );
  }
}

export default ResultsHeader;