import "./App.css";
import { useState, useEffect } from "react";
import * as BooksAPI from "./BooksAPI";
import Shelf from "./Shelf";
import SearchBar from "./SearchBar";
import SearchResults from "./SearchResults";

function App() {
  const [books, setBooks] = useState([]);
  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchPage, setShowSearchPage] = useState(false)


  useEffect(() => {
    BooksAPI.getAll().then((books) => {
      setBooks(books);
    });
  }, []);

  const handleMoveBook = (book, newShelf) => {
    BooksAPI.update(book, newShelf);
    setBooks((prevBooks) =>{
      const exists = prevBooks.find(b => b.id === book.id);
      if (exists) {
        return prevBooks.map(b =>
          b.id === book.id ? { ...b, shelf: newShelf} : b
        )
      } else {
        return [ ...prevBooks, {...book, shelf: newShelf }]
      }
    });
  };

  const currentlyReading = books.filter(
    (book) => book.shelf === "currentlyReading"
  );
  const wantToRead = books.filter(
    (book) => book.shelf === "wantToRead"
  );
  const read = books.filter(
    (book) => book.shelf === "read"
  );

    const handleQueryChange = (q) => {
    setQuery(q)

    if (q.trim() === "") {
      setSearchResults([]);
      return;
    }

    BooksAPI.search(q, 20)
    .then((results) => {
      if (!Array.isArray(results)) {
        setSearchResults([])
        return
      } const updatedResults = results.map((result) => {
        const existing = books.find((b) => b.id === result.id)
        return existing
        ? { ...result, shelf: existing.shelf}
        : { ...result, shelf: "none"};
      })
      setSearchResults(updatedResults)
    })
  }


  return (
    <div className="app">
      {showSearchPage ? (
        <div className="search-books">
          <div className="search-books-bar">
            <a className="close-search" onClick={() => setShowSearchPage(false)}>
              Close
            </a>
            <SearchBar query={query} onQueryChange={handleQueryChange} />
          </div> 
          <SearchResults books={searchResults} onMove={handleMoveBook} />
        </div>
      ): (
        <div className="list-books">
          <div className="list-books-title">
            <h1>MyReads</h1>
          </div>
          <div className="list-books-content">
            <Shelf title="Currently Reading" 
              books={currentlyReading}
              onMove={handleMoveBook} />
              <Shelf title="Want to Read" 
              books={wantToRead}
              onMove={handleMoveBook} />
              <Shelf title="Read" 
              books={read}
              onMove={handleMoveBook} />
          </div>
          <div className="open-search">
            <a onClick={() => setShowSearchPage(true)}>Add a book</a>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
