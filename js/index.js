import React from 'react';
import ReactDOM from 'react-dom';

class SideBar extends React.Component {
  render() {
    return (
      <div>
        Hello {this.props.name}
      </div>
    );
  }
}

ReactDOM.render(
  <SideBar name="HOGE" />,
  document.getElementById('root')
);
