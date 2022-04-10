import { Dispatch, SetStateAction, useEffect, useState } from 'react'

type LocalStorageProps<T> = {
    key: string,
    initialValue?: T
}

type LocalStorageReturn<T> = [T, Dispatch<SetStateAction<T>>, () => void]

function useLocalStorage<T>(props: LocalStorageProps<T>) : LocalStorageReturn<T> {
    const { key, initialValue } = props

    const keyToUse = "stm-" + key
    const [value, setValue] = useState<T>(() => {

        // If local storage has a value for this key, use it
        const json = localStorage.getItem(keyToUse)

        if (json) return JSON.parse(json)

        if (typeof initialValue === 'function') {
            // If the initial value is a function, call it and use the result
            return initialValue()
        } else {
            // Otherwise, use the initial value
            return initialValue
        }
    })

    const clearValue = () => localStorage.removeItem("stm-" + key)

    // Update local storage when the value changes
    useEffect(() => {
        if (value) localStorage.setItem(keyToUse, JSON.stringify(value))
    }, [keyToUse, value, initialValue])

    return [value, setValue, clearValue]
}

export default useLocalStorage