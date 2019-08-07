import React from 'react';

import { ApolloProvider } from '@apollo/react-hooks';
import { FocusStyleManager } from '@blueprintjs/core';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { ApolloClient } from 'apollo-client';
import { ApolloLink } from 'apollo-link';
import DebounceLink from 'apollo-link-debounce';
import { HttpLink } from 'apollo-link-http';
import { RetryLink } from 'apollo-link-retry';
import { WebSocketLink } from 'apollo-link-ws';
import { getMainDefinition } from 'apollo-utilities';
import styled from 'styled-components';

import TasksView from './components/TasksView';

FocusStyleManager.onlyShowFocusOnTabs();

if (!process.env.REACT_APP_GRAPHQL_URL) {
  throw new Error('The REACT_APP_GRAPHQL_URL env is missing');
}

if (!process.env.REACT_APP_GRAPHQL_WEBSOCKET) {
  throw new Error('The REACT_APP_GRAPHQL_WEBSOCKET env is missing');
}

// Create our Apollo links
const httpLink = ApolloLink.from([
  new DebounceLink(100),
  new RetryLink(),
  new HttpLink({ uri: process.env.REACT_APP_GRAPHQL_URL }),
]);
const wsLink = new WebSocketLink({
  uri: process.env.REACT_APP_GRAPHQL_WEBSOCKET,
  options: {
    reconnect: true,
  },
});

// Using the ability to split links, you can send data to each link
// depending on what kind of operation is being sent
const link = ApolloLink.split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return definition.kind === 'OperationDefinition' && definition.operation === 'subscription';
  },
  wsLink,
  httpLink,
);

const client = new ApolloClient({ link, cache: new InMemoryCache() });

const StyledTasksView = styled(TasksView)`
  margin: 2em;
`;

function App() {
  return (
    <ApolloProvider client={client}>
      <StyledTasksView />
    </ApolloProvider>
  );
}

export default App;
