import React, { useState, useEffect, useRef } from 'react';

import Card from '../UI/Card';
import './Search.css';
import useHttp from '../../hooks/http'
import ErrorModal from '../UI/ErrorModal'
import LoadingIndicator from '../UI/LoadingIndicator';

const Search = React.memo(props => {
    const [filter, setFilter] = useState('')
    const { onSearchIngredients } = props
    const inputRef = useRef()
    const { data, error, loading, sendRequest, clearError } = useHttp()
    useEffect(() => {
        const timer = setTimeout(() => {
            const query = filter.length === 0 ? '' : `?orderBy="title"&equalTo="${filter}"`
            sendRequest(
                'https://react-hook-4dfdb.firebaseio.com/ingredients.json' + query,
                'GET'
            )
            // if (filter === inputRef.current.value) {
            //     const query = filter.length === 0 ? '' : `?orderBy="title"&equalTo="${filter}"`
            //     // fetch('https://react-hook-4dfdb.firebaseio.com/ingredients.json' + query)
            //     //     .then(response => response.json())
            //     //     .then(datas => {
            //     //         const loadedIngredients = []
            //     //         for (const key in datas) {
            //     //             loadedIngredients.push({
            //     //                 id: key,
            //     //                 title: datas[key].title,
            //     //                 amount: datas[key].amount
            //     //             })
            //     //         }
            //     //         onSearchIngredients(loadedIngredients)
            //     //     })
            //     sendRequest(
            //         'https://react-hook-4dfdb.firebaseio.com/ingredients.json' + query,
            //         'GET'
            //     )
            // }
        }, 500)
        return () => {
            clearTimeout(timer)
        }
    }, [filter, onSearchIngredients, inputRef, sendRequest])

    useEffect(() => {
        if (!loading && !error && data) {
            const loadedIngredients = []
            for (const key in data) {
                loadedIngredients.push({
                    id: key,
                    title: data[key].title,
                    amount: data[key].amount
                })
            }
            onSearchIngredients(loadedIngredients)
        }
    }, [data, loading, error, onSearchIngredients])

    return (
        <section className="search">
            <Card>
                {error && <ErrorModal onClose={clearError}>{error}</ErrorModal>}
                <div className="search-input">
                    <label>Filter by Title</label>
                    {loading && <LoadingIndicator />}
                    <input
                        ref={inputRef}
                        type="text"
                        value={filter}
                        onChange={e => setFilter(e.target.value)} />
                </div>
            </Card>
        </section>
    );
});

export default Search;
