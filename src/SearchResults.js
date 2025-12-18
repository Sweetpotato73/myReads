function SearchResults({ books, onMove}) {
    return (
        <div className="search-books-results">
            <ol className="books-grid">
                {books.map((book) => (
                    <li key={book.id}>
                        <div className="book">
                            <div className="book-top">
                                <div 
                                className="book-cover"
                                style={{
                                    width: 128,
                                    height: 193,
                                    backgroundImage: book.imageLinks
                                    ? `url(${book.imageLinks?.thumbnail})`
                                    : "none"
                                }}></div>
                                <div className="book-shelf-changer">
                                    <select value={book.shelf}
                                    onChange={(e) => onMove(book, e.target.value)}>
                                        <option value="none" disabled>
                                            Move to...
                                        </option>
                                        <option value="currentlyReading">
                                            Currently Reading
                                        </option>
                                        <option value="wantToRead">
                                            Want to Read
                                        </option>
                                        <option value="read">
                                            Read
                                        </option>
                                        <option value="none">
                                            none
                                        </option>
                                    </select>
                                </div>
                            </div>
                            <div className="book-title">{book.title}</div>
                            <div className="book-authors">{book.authors?.join(", ")}</div>
                        </div>
                    </li>
                ))}
            </ol>
        </div>
    )
}

export default SearchResults;