import React from 'react'

import { FocusStyleManager } from '@blueprintjs/core'
import { ApolloProvider } from 'react-apollo'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { ApolloClient } from 'apollo-client'
import { ApolloLink } from 'apollo-link'
import DebounceLink from 'apollo-link-debounce'
import { HttpLink } from 'apollo-link-http'
import { WebSocketLink } from 'apollo-link-ws'
import { getMainDefinition } from 'apollo-utilities'
import styled from 'styled-components'

import TasksView from './components/TasksView'

FocusStyleManager.onlyShowFocusOnTabs()

// Create our Apollo links
const httpLink = ApolloLink.from([
  new DebounceLink(100),
  new HttpLink({ uri: process.env.GRAPHQL_URL! }),
])
const wsLink = new WebSocketLink({
  uri: process.env.GRAPHQL_WEBSOCKET!,
  options: {
    reconnect: true,
  },
})

// Using the ability to split links, you can send data to each link
// depending on what kind of operation is being sent
const link = ApolloLink.split(
  ({ query }) => {
    const definition = getMainDefinition(query)
    if (definition.kind !== 'OperationDefinition') return false
    return definition.operation === 'subscription'
  },
  wsLink,
  httpLink,
)

const client = new ApolloClient({ link, cache: new InMemoryCache() })

const StyledTasksView = styled(TasksView)`
  margin: 2em;
`

function App() {
  return (
    <ApolloProvider client={client}>
      <StyledTasksView />
    </ApolloProvider>
  )
}

export default App
