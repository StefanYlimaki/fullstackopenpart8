import { ALL_BOOKS } from "../queries"
import { useQuery } from '@apollo/client'
import { useState } from 'react'

const Books = (props) => {

  const [filter, setFilter] = useState('')

  const booksQuery = useQuery(ALL_BOOKS, {
    pollInterval: 10000
  })

  if (!props.show) {
    return null
  }

  if(booksQuery.loading){
    return(
      <div>
        Getting the books...
      </div>
    )
  }

  const books = booksQuery.data.allBooks
  let booksToShow = books
  if(filter !== ''){
    booksToShow = books.filter(b => b.genres.includes(filter))
  }

  const allGenres = [];
  books.forEach(element => {
    element.genres.forEach(element => {
      if(!allGenres.includes(element)) {
        allGenres.push(element)
      }
    })
  });

  return (
    <div>
      <h2>Books</h2>
      <div>
        <p><strong>Filter by genres:</strong></p>
        {allGenres.map(g => <button onClick={() => setFilter(g)} key={g}>{g}</button>)}
        <button onClick={() => setFilter('')}>Reset</button>
      </div>
      
      {filter 
        ? <div>Showing books in <strong>{filter}</strong> genre</div>
        : <div>Showing all books</div>
      }

      <br />
      <h3> Search Results: </h3>
      <table border={3}>
        <tbody>
          <tr>
            <th>Book</th>
            <th>author</th>
            <th>published</th>
          </tr>
          {booksToShow.map((a) => (
            <tr key={a.title}>
              <td>{a.title}</td>
              <td>{a.author.name}</td>
              <td>{a.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default Books
