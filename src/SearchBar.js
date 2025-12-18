function SearchBar({query, onQueryChange}) {
    return(
        <div className="search-books-input-wrapper">
            <input 
            type="text"
            placeholder="Search By title, author or ISBN"
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            />
        </div>
    )
};

export default SearchBar;