import { Component } from 'react';
import './loader.css';
import reactLogo from '../../assets/react.svg';

class Loader extends Component {
  render() {
    return <img src={reactLogo} className="loader" />;
  }
}

export default Loader;
