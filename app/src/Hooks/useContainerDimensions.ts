import { MutableRefObject, useCallback, useState, useEffect } from "react"

export default function useContainerDimensions(ref : MutableRefObject<HTMLHeadingElement|null>) {
    const getDimensions = useCallback(() => (ref.current ? 
        {
            // If we have a component reference, the dimensions are the same as the component's
            width: ref.current.offsetWidth,
            height: ref.current.offsetHeight
        } : {
            // Otherwise they are zero
            width: 0,
            height: 0
        }
    ), [ref])

    const [dimensions, setDimensions] = useState({ width: 0, height: 0 })

    useEffect(() => {
        if (ref.current) setDimensions(getDimensions())
        
        // Adds a resize event listener, grabs the dimensions, and then removes it
        window.addEventListener("resize", () => setDimensions(getDimensions()))

        return () => {
            window.removeEventListener("resize", () => setDimensions(getDimensions()))
        }
    }, [getDimensions, ref])

    return dimensions
}