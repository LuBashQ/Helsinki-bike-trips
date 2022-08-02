/* eslint-disable react-hooks/exhaustive-deps */
import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import hash from 'object-hash';
import { useEffect, useState } from 'react';

type ApiResponse<T> = {
    response: T | undefined,
    error: Error | undefined,
    isLoading: boolean
}

const {CancelToken} = axios;

function useApi<T, D = any>(config: AxiosRequestConfig<D> = {}, initialFetch = true) {
    const [state, setState] = useState<ApiResponse<T>>({
        response: undefined,
        error: undefined,
        isLoading: true
    })

    const configHash = hash(config)
    const source = CancelToken.source()

    const fetch = () => {
        axios.request<T, AxiosResponse<T>, D>(config)
            .then(response => {
                setState({error: undefined, response: response.data, isLoading: false})
            })
            .catch(error => {
                if(axios.isCancel(error))
                    console.log(`Request canceled by cleanup: ${error}`)
                else
                    setState({error, response: undefined, isLoading: false})
            })
    }

    useEffect(() => {
        setState({...state, isLoading: true})

        if(initialFetch)
            fetch()

        return () => {
            source.cancel('useEffect cleanup')
        }
    }, [configHash])

    const {response, error, isLoading} = state

    return {response, error, isLoading}
}

export default useApi