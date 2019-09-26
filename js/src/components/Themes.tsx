import { h } from 'preact';

import Theme from './Theme';

const Themes = () => {
  const sort = (data) => {
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

  const data = require('../../../data/data.json');
  const sorted = sort(data);
  const themes = sorted.map((theme) => <Theme theme={theme} />);

  return (
    <main role="main" className="container-fluid">
      <div className="row">
        {themes}
      </div>
    </main>
  )
}

export default Themes;