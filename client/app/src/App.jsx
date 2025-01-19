import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [books, setBooks] = useState([]);
  const [title, setTitle] = useState('');
  const [releaseYear, setReleaseYear] = useState(0);
  const [newTitle, setNewTitle] = useState('');

  useEffect(() => {
    fetchBooks();
  }, [])
  const fetchBooks = async () => {
    try{

      const response = await fetch("http://127.0.0.1:8000/api/books/");
      const data = await response.json();
      setBooks(data)
    } catch(err) {
      console.log(err)
    }
  }

  const addBook = async() => {
    const bookData = {
      title,
      release_date:releaseYear
    };
    try {
      const response = await fetch("http://127.0.0.1:8000/api/books/create",{
        method: "POST",
        headers: {
          'content-type': 'application/json',
        },
        body: JSON.stringify(bookData),
      });
      const data = await response.json();
      setBooks((prev) => [...prev, data]);
    } catch(error) {
      console.log(error);
    }
      
  };

  const updateTitle = async(pk,release_date) => {
    const bookData = {
      title: newTitle,
      release_date,
    };
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/books/${pk}`,{
        method: "PUT",
        headers: {
          'content-type': 'application/json',
        },
        body: JSON.stringify(bookData),
      });
      const data = await response.json();
      // setBooks((prev) => [...prev, data]);
      setBooks((prev) => prev.map((book) => {
        if (book.id === pk) {
          return data;
        } else {
          return book;
        }
      }));
    } catch(error) {
      console.log(error);
    }
  };


  const deleteBook= async (pk) => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/books/${pk}`,{
        method: "DELETE",
      });
      
      setBooks((prev) => prev.filter((book) => book.id !== pk))
    } catch(error) {
      console.log(error);
    }
  };

  return (
    <>
    <h1>Book Store</h1>
    <div>
      <input type='text' placeholder='Book Title..' onChange={(e) => 
        setTitle(e.target.value)}
      />
      <input type='number' placeholder='Book Release Year..' onChange={(e) => 
        setReleaseYear(e.target.value)}/>
      <button onClick={addBook}>Add Book</button>
    </div>
    {books.map((book) => (
      <div>
        <p>Title: {book.title}</p>
        <p>Release Year: {book.release_date}</p>
        <input type='text' placeholder='New Title...' onChange={(e) => 
          setNewTitle(e.target.value)}/>
        <button onClick={() => updateTitle(book.id,book.release_date)}>Change Title</button>
        <button onClick={() => deleteBook(book.id)}>Delete Book</button>
      </div>
    ))}
    </>
  )
}

export default App
