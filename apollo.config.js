module.exports = {
  schemas: {
    doowit: {
      endpoint: {
        url: 'http://localhost:4000',
        subscriptions: 'ws://localhost:4000/graphql',
      },
    },
  },
}
