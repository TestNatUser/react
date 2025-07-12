import { Component } from 'react';

class ErrorButton extends Component {
  throwError = () => {
    throw new Error('Something went wrong!');
  };

  render() {
    return (
      <button onClick={this.throwError} className="error-btn">
        Error button
      </button>
    );
  }
}

export default ErrorButton;
