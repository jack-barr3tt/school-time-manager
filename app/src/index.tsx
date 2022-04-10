import { StrictMode } from "react"
import { render } from "react-dom"
import App from "./App"

// Render the app on the root element on the DOM
render(
    <StrictMode>
        <App/>
    </StrictMode>,
    document.getElementById("root")
)
