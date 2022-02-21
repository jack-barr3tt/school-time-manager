import { MutableRefObject, useCallback, useState, useEffect } from "react"

export default function useContainerDimensions(ref : MutableRefObject<HTMLHeadingElement|null>) {
    const getDimensions = useCallback(() => (ref.current ? {
        width: ref.current.offsetWidth,
        height: ref.current.offsetHeight
    } : {
        width: 0,
        height: 0
    }), [ref])

    const [dimensions, setDimensions] = useState({ width: 0, height: 0 })

    useEffect(() => {
        if (ref.current) setDimensions(getDimensions())
        
        window.addEventListener("resize", () => setDimensions(getDimensions()))

        return () => {
            window.removeEventListener("resize", () => setDimensions(getDimensions()))
        }
    }, [getDimensions, ref])

    return dimensions;
};