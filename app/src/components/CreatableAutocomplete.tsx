import { Autocomplete, createFilterOptions, TextField } from "@mui/material";
import { Dispatch, SetStateAction, SyntheticEvent } from "react";

type Props<A> = {
    label: string;
    options: A[];
    chosenSetter: Dispatch<SetStateAction<A>>;
    chosen: A;
    onOpen?: (event: React.SyntheticEvent) => void;
}

type InputProps<B> = B & {
    inputValue?: string;
    name: string;
}

export default function CreateableAutocomplete<T>(props: Props<InputProps<T>>) {
    const { label, options, chosenSetter, chosen, onOpen } = props
    const filter = createFilterOptions<InputProps<T>>()
    return <Autocomplete
        value={chosen || ""}
        selectOnFocus
        clearOnBlur
        handleHomeEndKeys
        freeSolo
        options={options}
        onOpen={onOpen}
        onChange={(_e, value) => {
            if(typeof value === 'string') {
                chosenSetter({
                    name: value
                } as InputProps<T>)
            }else if(value && value.inputValue) {
                chosenSetter({
                    name: value.inputValue
                }as InputProps<T>)
            }else{
                chosenSetter(value as InputProps<T>)
            }
        }}
        filterOptions={(options, params) => {
            const filtered = filter(options, params)
            const { inputValue } = params
            const isExisting = options.some((option) => inputValue == option.name)
            if (inputValue != '' && !isExisting) {
                filtered.push({
                    inputValue,
                    name: `Add "${inputValue}"`,
                } as InputProps<T>)
            }

            return filtered
        }}
        getOptionLabel={(option) => {
            if(typeof option === 'string') {
                return option
            }
            if (option.inputValue) {
                return option.name
            }
            return option.name
        }}
        renderInput={(params) => (
            <TextField {...params} label={label} />
        )}
    />
}