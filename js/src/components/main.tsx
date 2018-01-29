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

  sort(data) {
      return data.sort((n1,n2) => {
          if (n1.pkg_name > n2.pkg_name) {
              return 1;
          }
          if (n1.pkg_name < n2.pkg_name) {
              return -1;
          }
          return 0;
      });
  }


  render() {
      const data = require('../../../data/data.json');
      const sorted = this.sort(data);

      let themes = [] ;
      for ( const theme of (sorted as Array<any>) ) {
         themes.push(<Theme theme={theme} />)
      }

      return (
      <main role="main" className="container-fluid">
        <div className="row">
          {themes}
        </div>
      </main>
      )
    }
}
