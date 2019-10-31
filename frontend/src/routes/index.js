import React from 'react';
import { Switch, Route as BaseRoute, Redirect } from 'react-router-dom';

import Route from './Route';

import LogIn from '~/pages/LogIn';
import SignUp from '~/pages/SignUp';

import Dashboard from '~/pages/Dashboard';
import Profile from '~/pages/Profile';
import CreateTour from '~/pages/CreateTour';
import Tour from '~/pages/Tour';
import EditTour from '~/pages/EditTour';

export default function Routes() {
  return (
    <Switch>
      <Route path="/" exact component={LogIn} />
      <Route path="/register" component={SignUp} />

      <Route path="/dashboard" component={Dashboard} isPrivate />
      <Route path="/profile" component={Profile} isPrivate />

      <Route path="/tour/create" component={CreateTour} isPrivate />
      <Route path="/tour/:id" exact component={Tour} isPrivate />
      <Route path="/tour/:id/edit" component={EditTour} isPrivate />

      <BaseRoute render={() => <Redirect to="/" />} />
    </Switch>
  );
}
