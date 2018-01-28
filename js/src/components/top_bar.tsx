import { h, Component } from "preact";

export default class TopBar extends Component<any, any> {
  render() {
      return (
    <nav className="navbar navbar-expand-md navbar-dark bg-dark mb-4">
      <a className="navbar-brand" href="https://sphinx-themes.org">Sphinx Themes</a>
      <div className="collapse navbar-collapse" id="navbarCollapse">
        <ul className="navbar-nav mr-auto">
          <li className="nav-item">
            <a className="nav-link" href="https://github.com/sphinx-themes/sphinx-themes.org">GitHub</a>
          </li>
        </ul>
      </div>
    </nav>
    )
  }
}
