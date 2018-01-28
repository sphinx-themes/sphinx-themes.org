import { h, Component } from "preact";
import { stylesheet } from "stylesheet-decorator";
import { http } from "http-decorator";


import Theme from './theme';
import TopBar from './top_bar';

export default _ => (
    <div>
      <TopBar />
      <Themes />
    </div>
)


class Themes extends Component<any, any> {
  render() {
      const data = require('../../../data/data.json');
      let themes = [] ;
      for ( const theme of (data as Array<any>) ) {
         themes.push(<Theme theme={theme} />)
      }
      console.log(themes);

      return (
      <main role="main" className="container">
        <div className="row">
          {themes}
        </div>
      </main>
      )
    }
}
