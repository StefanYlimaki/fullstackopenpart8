import { ALL_BOOKS } from "../queries";
import { useLazyQuery, useQuery } from "@apollo/client";
import { useEffect, useState } from "react";

const Books = (props) => {
  const [filter, setFilter] = useState("");
  const [books, setBooks] = useState(null);

  const bookResult = useQuery(ALL_BOOKS, {
    pollInterval: 10000,
  });

  const [booksByGenreQuery, bookByGenreResult] = useLazyQuery(ALL_BOOKS, {
    fetchPolicy: "no-cache"
  });

  useEffect(() => {
    if (bookResult.data) {
      setBooks(bookResult.data.allBooks);
    }
  }, [bookResult.data]);

  useEffect(() => {
    if (bookByGenreResult.data) {
      setBooks(bookByGenreResult.data.allBooks);
    }
  }, [bookByGenreResult.data]);

  if (!props.show) {
    return null;
  }

  if (books === null) {
    return <div>moi</div>;
  }

  const allGenres = bookResult.data.allBooks.map(b => b.genres)
  const uniqueGenres = []
  allGenres.forEach((element) => {
    element.forEach((element) => {
      if (!uniqueGenres.includes(element)) {
        uniqueGenres.push(element);
      }
    });
  });
  
  const handleClick = (setTo) => {
    if (setTo === "") {
      setFilter(setTo)
    }
    setFilter(setTo);
    booksByGenreQuery({ variables: { genre: setTo } });
  };

  return (
    <div>
      <h2>Books</h2>
      <div>
        <p>
          <strong>Filter by genres:</strong>
        </p>
        {uniqueGenres.map((g) => (
          <button onClick={() => handleClick(g)} key={g}>
            {g}
          </button>
        ))}
        <button onClick={() => handleClick("")}>Reset</button>
      </div>

      {filter ? (
        <div>
          Showing books in <strong>{filter}</strong> genre
        </div>
      ) : (
        <div>Showing all books</div>
      )}

      <br />
      <h3> Search Results: </h3>
      <table border={3}>
        <tbody>
          <tr>
            <th>Book</th>
            <th>author</th>
            <th>published</th>
          </tr>
          {books.map((a) => (
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

export default Books;
