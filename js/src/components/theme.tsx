import { h, Component } from "preact";

export default class Theme extends Component<any, any> {
    render() {
      const theme = this.props.theme;
      const src = `html/${theme.pkg_name}/${theme.theme}/screenshot.png`;
      const pypi = theme.url;
      const sample = `html/${theme.pkg_name}/${theme.theme}/index.html`;

      let name = theme.pkg_name;
      if (name === "default") {
          name = `default (${theme.theme})`;
      }

      return (
      <div className="col-md-4 p-3">
        <div className="card">
          <h5 className="card-header">{ name }</h5>
          <div className="card-body">
            <img className="card-img-top" src={ src }
                 alt="theme screen shot" />
          </div>
          <div className="card-footer text-center">
            <a className="card-link" href={ sample }>sample</a>
            <a className="card-link" href={ pypi }>pypi</a>
          </div>
        </div>
      </div>
        )
    }
}
