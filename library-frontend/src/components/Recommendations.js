import { ALL_BOOKS, FAVORITE_GENRE } from "../queries";
import { useQuery } from "@apollo/client";

const Recommendations = (props) => {
  const genreQuery = useQuery(FAVORITE_GENRE);
  const booksQuery = useQuery(ALL_BOOKS, {
    pollInterval: 10000
  })

  if (!props.show) {
    return null;
  }

  if(genreQuery.loading || booksQuery.loading){
    return(
        <div>Reading books...</div>
    )
  }

  const genre = genreQuery.data.me.favoriteGenre
  const booksByGenre = booksQuery.data.allBooks.filter(b => b.genres.includes(genre))

  return (
    <div>
      <h2>Recommendations:</h2>
      <p>Books in your favorite genre <strong>{genre}</strong></p>
      <table border={3}>
        <tbody>
          <tr>
            <th>Book</th>
            <th>author</th>
            <th>published</th>
          </tr>
          {booksByGenre.map((a) => (
            <tr key={a.title}>
              <td>{a.title}</td>
              <td>{a.author.name}</td>
              <td>{a.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Recommendations;

/*

booksByGenre.map(b => <div>{b.title}</div>)

*/