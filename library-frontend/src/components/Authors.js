import { ALL_AUTHORS } from "../queries"
import { useQuery } from '@apollo/client'

const Authors = (props) => {

  const authorsQuery = useQuery(ALL_AUTHORS, {
    pollInterval: 10000
  })

  if (!props.show) {
      return null
  }

  if(authorsQuery.loading){
    return(
      <div>
        Getting the authors...
      </div>
    )
  }

  

  const authors = authorsQuery.data.allAuthors

  return (
    <div>
      <h2>authors</h2>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>born</th>
            <th>books</th>
          </tr>
          {authors.map((a) => (
            <tr key={a.name}>
              <td>{a.name}</td>
              <td>{a.born || 'unknown'}</td>
              <td>{a.bookCount}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default Authors
