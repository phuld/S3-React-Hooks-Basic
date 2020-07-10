import React, { useEffect, useCallback, useReducer } from 'react';

import IngredientForm from './IngredientForm';
import Search from './Search';
import IngredientList from './IngredientList';
import ErrorModal from '../UI/ErrorModal';
import useHttp from '../../hooks/http';

const ingredientsReducer = (currentIngredients, action) => {
    switch (action.type) {
        case 'SET':
            return action.ingredients
        case 'ADD':
            return [...currentIngredients, action.ingredient]
        case 'REMOVE':
            return currentIngredients.filter(item => item.id !== action.id)
        default:
            throw new Error('Fail to get there.')
    }
}

const Ingredients = () => {
    // const [ingredients, setIngredients] = useState([])
    // const [isLoading, setIsLoading] = useState(false)
    // const [error, setError] = useState()
    const [ingredients, dispatch] = useReducer(ingredientsReducer, [])
    const { data, error, loading, sendRequest, extra, identifier, clearError } = useHttp()

    useEffect(() => {
        if (!loading && !error && identifier === 'REMOVE_INGREDIENT') {
            dispatch({ type: 'REMOVE', id: extra })
        } else if (!loading && !error && identifier === 'ADD_INGREDIENT') {
            dispatch({ type: 'ADD', ingredient: { id: data.name, ...extra } })
        }
    }, [data, extra, identifier, loading, error])

    useEffect(() => {
        fetch('https://react-hook-4dfdb.firebaseio.com/ingredients.json')
            .then(response => {
                return response.json()
            })
            .then(datas => {
                const loadedIngredients = []
                for (const key in datas) {
                    loadedIngredients.push({
                        id: key,
                        title: datas[key].title,
                        amount: datas[key].amount
                    })
                }
                // setIngredients(loadedIngredients)
                dispatch({ type: 'SET', ingredients: loadedIngredients })
            })
    }, [])

    const onAddIngredient = (ingredient) => {
        // setIsLoading(true)
        // dispatchHttp({ type: 'SEND' })
        // fetch('https://react-hook-4dfdb.firebaseio.com/ingredients.json', {
        //     method: 'POST',
        //     body: JSON.stringify(ingredient),
        //     headers: { 'Content-Type': 'application/json' }
        // })
        //     .then(response => {
        //         dispatchHttp({ type: 'RESPONSE' })
        //         return response.json()
        //     })
        //     .then(responseJSON => {
        //         dispatch({ type: 'ADD', ingredient: { id: responseJSON.name, ...ingredient } })
        //     })
        //     .catch(error => {
        //         dispatchHttp({ type: 'ERROR', errorData: 'Something went wrong.' })
        //     })
        sendRequest(
            'https://react-hook-4dfdb.firebaseio.com/ingredients.json',
            'POST',
            JSON.stringify(ingredient),
            ingredient,
            'ADD_INGREDIENT'
        )
    }

    const onRemoveItem = useCallback((id) => {
        sendRequest(
            `https://react-hook-4dfdb.firebaseio.com/ingredients/${id}.jon`,
            'DELETE',
            null,
            id,
            'REMOVE_INGREDIENT'
        )
    }, [sendRequest])

    const onSearchIngredients = useCallback((ingredients) => {
        dispatch({ type: 'SET', ingredients })
    }, [])

    const handleCloseError = () => {
        // dispatchHttp({ type: 'CLOSE_ERROR' })
        clearError()
    }

    return (
        <div className="App">
            {error && <ErrorModal onClose={handleCloseError}>{error}</ErrorModal>}
            <IngredientForm
                onAddIngredient={onAddIngredient}
                isLoading={loading} />
            <section>
                <Search onSearchIngredients={onSearchIngredients} />
                <IngredientList
                    ingredients={ingredients}
                    onRemoveItem={onRemoveItem} />
            </section>
        </div>
    );
}

export default Ingredients;
