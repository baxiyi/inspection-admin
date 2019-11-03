import React from 'react'
import Shelf1 from '../pages/Shelf/insert'
import Shelf2 from '../pages/Shelf/delete'
import Rule1 from '../pages/Rule/insert'
import Rule2 from '../pages/Rule/delete'
import Backup1 from '../pages/Backup/deleteimg'
import Backup2 from '../pages/Backup/deletelog'
import On from '../pages/On'
import System from '../pages/System'
import Menu from '../components/Menu'
import TopBar from '../components/TopBar'
import {BrowserRouter, Route, Switch} from 'react-router-dom'

const App = () => (
  <BrowserRouter>
    <div>
      <TopBar />
      <Menu />
      <Switch>                
        <Route 
          path='/shelf/insert'
          exact
          component={Shelf1}
        />
        <Route 
          path='/shelf/delete'
          exact
          component={Shelf2}
        />
        <Route
          path='/rule/insert'
          component={Rule1}
        />
        <Route
          path='/rule/delete'
          component={Rule2}
        />
        <Route 
          path='/backup/deleteimg'
          component={Backup1}
        />
        <Route 
          path='/backup/deletelog'
          component={Backup2}
        />
        <Route 
          path='/on'
          component={On}
        />
        <Route 
          path='/system'
          component={System}
        />
      </Switch>
    </div>
  </BrowserRouter>
);
export default App;