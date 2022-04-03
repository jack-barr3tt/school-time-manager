import { Dispatch, SetStateAction, useEffect, useState } from 'react'

type LocalStorageProps<T> = {
    key: string,
    initialValue?: T;
}

type LocalStorageReturn<T> = [T, Dispatch<SetStateAction<T>>, () => void]

function useLocalStorage<T>(props: LocalStorageProps<T>): LocalStorageReturn<T> {
    const { key, initialValue } = props

    const keyToUse = "stm-" + key
    const [value, setValue] = useState<T>(() => {

        const json = localStorage.getItem(keyToUse)

        if (json) return JSON.parse(json)

        if (typeof initialValue === 'function') {
            return initialValue()
        } else {
            return initialValue
        }
    })

    const clearValue = () => sessionStorage.removeItem("stm-" + key);

    useEffect(() => {
        if (value) localStorage.setItem(keyToUse, JSON.stringify(value));
    }, [keyToUse, value, initialValue])

    return [value, setValue, clearValue]
}

export default useLocalStorage;