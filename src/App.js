import "./App.css";
import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import * as BooksAPI from "./BooksAPI";
import Shelf from "./Shelf";
import SearchBar from "./SearchBar";
import SearchResults from "./SearchResults";

function App() {
  const [books, setBooks] = useState([]);
  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    BooksAPI.getAll().then((books) => setBooks(books));
  }, []);

  const handleMoveBook = (book, newShelf) => {
    BooksAPI.update(book, newShelf);
    setBooks(prevBooks => {
      const exists = prevBooks.find(b => b.id === book.id);
      if (exists) return prevBooks.map(b => b.id === book.id ? { ...b, shelf: newShelf } : b);
      return [...prevBooks, { ...book, shelf: newShelf }];
    });
    setSearchResults(prevResults =>
      prevResults.map(b => b.id === book.id ? { ...b, shelf: newShelf } : b)
    );
  };

  const handleQueryChange = (q) => {
    setQuery(q);
  
    if (q.trim() === "") {
      setSearchResults([]);
      return;
    }
  
    BooksAPI.search(q, 20).then((results) => {
      if (!Array.isArray(results)) {
        setSearchResults([]);
        return;
      }
  
      const updatedResults = results
      .filter(result => result.id) 
      .map(result => {
        const existingBook = books.find(b => b.id === result.id);
        return { ...result, shelf: existingBook ? existingBook.shelf : "none" };
      });
  
      setSearchResults(updatedResults);
    });
  };

  const currentlyReading = books.filter(b => b.shelf === "currentlyReading");
  const wantToRead = books.filter(b => b.shelf === "wantToRead");
  const read = books.filter(b => b.shelf === "read");

  return (
    <Router>
      <Routes>
        {/* Main page */}
        <Route path="/" element={
          <div className="list-books">
            <div className="list-books-title"><h1>MyReads</h1></div>
            <div className="list-books-content">
              <Shelf title="Currently Reading" books={currentlyReading} onMove={handleMoveBook} />
              <Shelf title="Want to Read" books={wantToRead} onMove={handleMoveBook} />
              <Shelf title="Read" books={read} onMove={handleMoveBook} />
            </div>
            <div className="open-search">
              <Link to="/search">Add a book</Link>
            </div>
          </div>
        } />

        {/* Search page */}
        <Route path="/search" element={
          <div className="search-books">
            <div className="search-books-bar">
              <Link className="close-search" to="/">Close</Link>
              <SearchBar query={query} onQueryChange={handleQueryChange} />
            </div>
            <SearchResults books={searchResults} onMove={handleMoveBook} />
          </div>
        } />
      </Routes>
    </Router>
  );
}

export default App;