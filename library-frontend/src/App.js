import { useState } from 'react'
import Authors from './components/Authors'
import Books from './components/Books'
import NewBook from './components/NewBook'

import { gql, useQuery } from '@apollo/client'

const ALL_BOOKS = gql`
  query {
    allBooks {
      title
      author
      published
    }
  }
`

const ALL_AUTHORS = gql`
  query {
    allAuthors {
      name
      bookCount
      born
    }
  }
`

const App = () => {
  const booksQuery = useQuery(ALL_BOOKS)
  const authorsQuery = useQuery(ALL_AUTHORS)
  const [page, setPage] = useState('authors')

  if(booksQuery.loading || authorsQuery.loading){
    return(
      <div>
        Just a moment...
      </div>
    )
  }

  return (
    <div>
      <div>
        <button onClick={() => setPage('authors')}>authors</button>
        <button onClick={() => setPage('books')}>books</button>
        <button onClick={() => setPage('add')}>add book</button>
      </div>

      <Authors show={page === 'authors'} authors={authorsQuery.data.allAuthors}/>

      <Books show={page === 'books'} books={booksQuery.data.allBooks}/>

      <NewBook show={page === 'add'} />
    </div>
  )
}


export default App
