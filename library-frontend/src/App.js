import { useState } from 'react'
import Authors from './components/Authors'
import Books from './components/Books'
import BookForm from './components/BookForm'
import Notification from './components/Notification'
import Recommendations from './components/Recommendations'
import LoginForm from './components/LoginForm'
import { useApolloClient } from '@apollo/client'


const App = () => {
  const [token, setToken] = useState(localStorage.getItem('phonenumbers-user-token'))
  const [page, setPage] = useState('authors')
  const [errorMessage, setErrorMessage] = useState(null)
  const client = useApolloClient()

  const notify = (message) => {
    setErrorMessage(message)
    setTimeout(() => {
      setErrorMessage(null)
    }, 5000)
  }

  const logout = () => {
    setToken(null)
    localStorage.clear()
    client.resetStore()
  }


  if(!token){
    return(
      <div>
        <h2>Login</h2>
        <LoginForm
          setToken={setToken}
          setError={notify}
        />
      </div>
    )
  }

  return (
    <div>
      <Notification errorMessage={errorMessage}/>
      <div>
        <button onClick={() => setPage('authors')}>Authors</button>
        <button onClick={() => setPage('books')}>Books</button>
        <button onClick={() => setPage('add')}>Add Book</button>
        <button onClick={() => setPage('recommendations')}>Recommend</button>
        <button onClick={logout}>Log out</button>
      </div>
      <Authors show={page === 'authors'} />
      <Books show={page === 'books'} />
      <BookForm show={page === 'add'} />
      <Recommendations show={page === 'recommendations'} />
    </div>
  )
}


export default App
