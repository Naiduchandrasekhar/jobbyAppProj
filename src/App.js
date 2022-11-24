import {Route, Switch, Redirect} from 'react-router-dom'
import Login from './components/Login'
import Home from './components/Home'
import Jobs from './components/Jobs'
import JobItemDetails from './components/JobItemDetails'
import NotFound from './components/NotFound'
import Protected from './components/Protected'
import './App.css'

// Replace your code here
const App = () => (
  <Switch>
    <Route exact path="/login" component={Login} />
    <Protected exact path="/" component={Home} />
    <Protected exact path="/jobs" component={Jobs} />
    <Protected exact path="/jobs/:id" component={JobItemDetails} />
    <Route exact path="/notfound" component={NotFound} />
    <Redirect to="/notfound" />
  </Switch>
)

export default App
