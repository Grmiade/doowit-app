import React from 'react'
import ReactDOM from 'react-dom'

import './style.css'
import App from './App'
import { register } from './serviceWorker'

ReactDOM.render(<App />, document.getElementById('root'))

register()
