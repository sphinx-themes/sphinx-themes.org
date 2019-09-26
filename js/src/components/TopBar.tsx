import { h } from 'preact';

const TopBar = () => {
  return (
    <nav className="navbar navbar-expand-md navbar-dark bg-dark mb-4">
      <a className="navbar-brand" href="https://sphinx-themes.org">Sphinx Themes</a>
      <div className="collapse navbar-collapse" id="navbarCollapse">
        <ul className="navbar-nav mr-auto">
          <li className="nav-item dropdown">
            <a className="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
              Theme
            </a>
            <div className="dropdown-menu" aria-labelledby="navbarDropdown">
              <a className="dropdown-item" href="http://www.sphinx-doc.org/en/master/theming.html">How to use </a>
              <a className="dropdown-item" href="http://www.sphinx-doc.org/en/master/theming.html#creating-themes">How to create</a>
              <a className="dropdown-item" href="http://www.sphinx-doc.org/en/master/theming.html#distribute-your-theme-as-a-python-package">How to upload</a>
            </div>
          </li>
          <li className="nav-item">
            <a className="nav-link" href="https://github.com/sphinx-themes/sphinx-themes.org">GitHub</a>
          </li>
        </ul>
      </div>
    </nav>
  )
}

export default TopBar;