import { h } from 'preact';

import Themes from './Themes';
import TopBar from './TopBar';


const App = () => {
	return (
		<div>
		<TopBar />
		<Themes />
	  </div>
	);
}

export default App;
