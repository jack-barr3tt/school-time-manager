import { Check } from "@mui/icons-material";
import { Stack, ButtonBase, Paper } from "@mui/material";
import { red, orange, yellow, green, lightBlue, blue, purple, grey } from "@mui/material/colors";
import { useMemo, useState, useEffect } from "react";
import { ColorIntToString } from "../functions";

type Props = {
    setColor: (color: number) => void
    defaultValue?: number
}

export default function ColorPicker(props: Props) {
    const { setColor, defaultValue } = props

    const colors = useMemo(() => [ red, orange, yellow, green, lightBlue, blue, purple, grey ], [])

    // Turn an object to a tuple of with color id as the key and an array of hex codes as the value
    const toArray = (color: object) => {
        const keys = Object.keys(color)
        const values = Object.values(color)
        
        return keys.map((key, index) => [key, values[index]])
    }
    
    const [colorMatrix, setColorMatrix] = useState<string[][]>()
    const [checked, setChecked] = useState<{ x: number, y: number }>()

    // Convert the color object array to a 2D array of hex values
    useEffect(() =>
        setColorMatrix(
            colors.map(color =>
                toArray(color) // Convert the object to a tuple
                .filter(s => s[0].toString().length > 3) // Target colors with a 4 digit key as these are the brighter colors
                .map(s => s[1]) // Get the hex value
            )
        )
    , [colors])

    // Set the checked state to the default value on mount
    useEffect(() => {
        if(colorMatrix) {
            // Look for the row in the color matrix that contains the default value
            const indicies = colorMatrix.map(row => 
                row.findIndex(color => color === ColorIntToString(defaultValue))  
            )
            // Set the checked object equal to the x and y coordinates of the default value
            for(let i = 0; i < indicies.length; i++) {
                if(indicies[i] !== -1) {
                    setChecked({ x: i, y: indicies[i] })
                    break
                }
            }
        }
    }, [colorMatrix, defaultValue])

    // Whenever a different color is checked, update the color variable to contain an integer value for that color
    useEffect(() => {
        if(colorMatrix && checked) {
            setColor(
                Number(colorMatrix[checked.x][checked.y].replace("#", "0x")) // Convert the hex value to an integer
            )
        }
    }, [checked, colorMatrix, setColor])

    return <Stack direction="row" spacing={0.75} sx={{ p: 2 }}>
        { colorMatrix && colorMatrix.map((row, x) => {
                return <Stack direction="column" spacing={0.75} key={`stack-${x}`}>
                    { row.map((s, y) => 
                        <ButtonBase 
                            sx={{ borderRadius: "50%" }} 
                            onClick={() => setChecked({ x, y })} // Set the checked state to the clicked color
                            key={`${x}-${y}`}
                        >
                            <Paper sx={{ backgroundColor: s, borderRadius: "50%", width: "2rem", aspectRatio: "1" }} >
                                { (checked && (x === checked.x && y === checked.y)) &&
                                    <Stack direction="column" justifyContent="center" alignItems="center" sx={{ height: 1 }}>
                                        <Check/> 
                                    </Stack>
                                }
                            </Paper>
                        </ButtonBase>
                    ) }
                </Stack>
            })
        }
    </Stack>
}