import { useEffect, useCallback, useRef, useState } from 'react'
import Link from 'next/link';

import searchStyles from '../styles/Search.module.scss';

const searchEndpoint = (query, perPage) => `/api/search?q=${query}&per_page=${perPage}`
const defaultSuggestLimit = 20


export default function Search({ searchResults }) {
  const searchRef = useRef(null)
  const [query, setQuery] = useState('')
  const [active, setActive] = useState(false)
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState(null)

  const fetchSearchResults = async (perPage) => {
    let response = await fetch(searchEndpoint(query, perPage))
    let responseJSON = await response.json()
    let results = await responseJSON.data.items
    setResults(results)
    setLoading(false)
    if (!results.length) {
      setMessage('No users found matching your query.')
    }
  }

  const searchQuery = async(perPage = defaultSuggestLimit) => {
    if (query.length) {
      setMessage('Loading...')
      setLoading(true)
      fetchSearchResults(perPage)
    } else {
      setMessage('Please enter a search query.')
      setLoading(false)
    }
  }

  // Auto suggests first 10 results when search query changes
  useEffect(() => {
    setResults([])
    setLoading(true)

    // Delay searching until user has stopped typing for 1.5+ seconds
    let timer = setTimeout(() => {
      searchQuery(10)
    }, 1500)

    return () => clearTimeout(timer)
  }, [query])

  const onFocus = useCallback(() => {
    setActive(true)
    window.addEventListener('click', onClick)
  }, [])

  const onClick = useCallback((event) => {
    if (searchRef.current && !searchRef.current.contains(event.target)) {
      window.removeEventListener('click', onClick)
    }
  }, [])

  return (
    <div ref={searchRef}>
      <div className={searchStyles.searchBar}>
        <input
          className={searchStyles.searchInput}
          type="text"
          id="username"
          name="username"
          value={query}
          onFocus={onFocus}
          onChange={e => setQuery(e.target.value)}
          placeholder='Type a username' />
        <div className={searchStyles.searchButton}>
          <Link href="/profiles/[username]" as={`/profiles/${query}`}>
            <a>Search</a>
          </Link>
        </div>
      </div>
      <div className={searchStyles.results}>
        { active ?
          <>
            {
              results.length > 0 && !loading ?
                <ul>
                  <li>Suggestions</li>
                  {
                    results.map(({ login }) => (
                      <li key={login}>
                        <Link href="/profiles/[username]" as={`/profiles/${login}`}>
                          <a>{login}</a>
                        </Link>
                      </li>
                    ))
                  }
                </ul> : <div className={searchStyles.resultsMessage}>{message}</div>
            }
          </> : <div className={searchStyles.resultsMessage}>Suggestions will appear here.</div>
        }
      </div>
    </div>
  )
}
