import { ALL_AUTHORS, EDIT_AUTHOR } from "../queries"
import { useMutation, useQuery } from '@apollo/client'
import { useState } from "react"

const Authors = (props) => {

  const [name, setName] = useState('')
  const [birthyear, setBirthyear] = useState('')

  const [editAuthor, { data }] = useMutation(EDIT_AUTHOR, {
    refetchQueries: [{ query: ALL_AUTHORS }]
  })

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

  const updateAuthor = (event) => {
    event.preventDefault();
    const setBornTo = Number(birthyear)
    editAuthor({ variables: { name, setBornTo }})
    setName('Choose Author')
    setBirthyear('')
  }

  const authors = authorsQuery.data.allAuthors
  
  

  return (
    <div>
      <h2>Authors</h2>
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
      <h2>Set Birthyear</h2>
      <form onSubmit={updateAuthor}>
        <select value={name} onChange={({ target }) => setName(target.value)}>
          <option value='' hidden>Choose Author</option>
          {authors.map(a => <option key={a.name} value={a.name}>{a.name}</option>)}
        </select>
        <div>
          Birthyear:
          <input type="number" value={birthyear} onChange={({ target }) => setBirthyear(target.value)}/>
        </div>
        
        <button type="submit">update author</button>
      </form>
    </div>
  )
}

export default Authors
