import { ApolloClient, ApolloLink, InMemoryCache, Observable } from '@apollo/client'
import { ComposeClient } from '@composedb/client'
import { definition } from '../schema/client'

const compose = new ComposeClient({ ceramic: 'http://localhost:7007', definition })

const link = new ApolloLink((operation) => {
  return new Observable((observer) => {
    compose.execute(operation.query, operation.variables).then(
      (result) => {
        observer.next(result)
        observer.complete()
      },
      (error) => {
        observer.error(error)
      }
    )
  })
})

export const client = new ApolloClient({ cache: new InMemoryCache(), link })