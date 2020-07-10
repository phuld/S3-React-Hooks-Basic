import { useCallback, useReducer } from "react"

const initialState = {
    loading: false,
    error: '',
    data: null,
    extra: null,
    identifier: null
}

const httpReducer = (currentHttp, action) => {
    switch (action.type) {
        case 'SEND':
            return {
                ...currentHttp,
                loading: true,
                error: false,
                data: null,
                extra: null,
                identifier: action.identifier
            }
        case 'RESPONSE':
            return {
                ...currentHttp,
                loading: false,
                error: false,
                data: action.responseData,
                extra: action.extra
            }
        case 'ERROR':
            return {
                ...currentHttp,
                loading: false,
                error: action.errorData
            }
        case 'CLEAR':
            return initialState;
        default:
            throw new Error('Fail to get there.')
    }
}

const useHttp = () => {
    const [httpState, dispatchHttp] = useReducer(httpReducer, initialState)
    const clearError = useCallback(() => dispatchHttp({ type: 'CLEAR' }), [])
    const sendRequest = useCallback((url, method, body, reqExtra, reqIdentifier) => {
        dispatchHttp({ type: 'SEND', identifier: reqIdentifier })
        fetch(url, {
            method: method,
            body: body,
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(response => {
                return response.json()
            })
            .then(responseData => {
                dispatchHttp({ type: 'RESPONSE', responseData: responseData, extra: reqExtra, })
            })
            .catch(error => {
                dispatchHttp({ type: 'ERROR', errorData: 'Something went wrong.' })
            })
    }, [])
    return {
        loading: httpState.loading,
        error: httpState.error,
        data: httpState.data,
        sendRequest: sendRequest,
        extra: httpState.extra,
        identifier: httpState.identifier,
        clearError: clearError
    }
}

export default useHttp;