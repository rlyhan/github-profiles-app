import { useEffect, useCallback, useRef, useState } from 'react'
import Link from 'next/link';

import searchStyles from '../styles/Search.module.css';

export default function Search({ searchResults }) {
  const searchRef = useRef(null)
  const [query, setQuery] = useState('')
  const [active, setActive] = useState(false)
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState(null)

  const searchEndpoint = (query) => `/api/search?q=${query}`

  useEffect(() => {
    setResults([])
    setLoading(true)

    const fetchSearchResults = async () => {
      let response = await fetch(searchEndpoint(query))
      let responseJSON = await response.json()
      let results = await responseJSON.data.items
      setResults(results)
      setLoading(false)
      if (!results.length) {
        setMessage('No results.')
      }
    }

    let timer = setTimeout(() => {
      if (query.length) {
        setMessage('Loading...')
        setLoading(true)
        fetchSearchResults()
      } else {
        setMessage('Please enter a search query.')
        setLoading(false)
      }
    }, 1500)

    return () => clearTimeout(timer)
  }, [query])

  const onFocus = useCallback(() => {
    setActive(true)
    window.addEventListener('click', onClick)
  }, [])

  const onClick = useCallback((event) => {
    if (searchRef.current && !searchRef.current.contains(event.target)) {
      // setActive(false)
      window.removeEventListener('click', onClick)
    }
  }, [])

  return (
    <div ref={searchRef}>
      <input
        className={searchStyles.searchInput}
        type="text"
        id="username"
        name="username"
        value={query}
        onFocus={onFocus}
        onChange={e => setQuery(e.target.value)}
        placeholder='Type a username' />
      <div className={searchStyles.results}>
        { active ?
          <>
            {
              results.length > 0 && !loading ?
                <ul>
                  {
                    results.map(({ login }) => (
                      <li key={login}>
                        <Link href="/profiles/[username]" as={`/profiles/${login}`}>
                          <a>{login}</a>
                        </Link>
                      </li>
                    ))
                  }
                </ul> : <div>{message}</div>
            }
          </> : <div>Results will appear here.</div>
        }
      </div>
    </div>
  )
}
