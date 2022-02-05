import { Autocomplete, createFilterOptions, TextField } from "@mui/material";
import { Dispatch, FC, ReactElement, SetStateAction, useState } from "react";

type DialogProps<B> = {
    open: boolean, 
    setOpen: Dispatch<SetStateAction<boolean>>, 
    defaultValue?: string, 
    setFinal: Dispatch<SetStateAction<B|undefined>>
}

type Props<A> = {
    label: string;
    options: A[];
    chosenSetter: Dispatch<SetStateAction<A|undefined>>;
    chosen: A;
    onOpen?: (event: React.SyntheticEvent) => void;
    CreateDialog?: <A>(props: DialogProps<A>) => ReactElement<DialogProps<A>>;
}

type InputProps<B> = B & {
    inputValue?: string;
    name: string;
}

export default function CreateableAutocomplete<T>(props: Props<InputProps<T>>) {
    const { label, options, chosenSetter, chosen, onOpen, CreateDialog } = props
    const filter = createFilterOptions<InputProps<T>>()

    const [dialogOpen, setDialogOpen] = useState(false)
    const [dialogDefaultValue, setDialogDefaultValue] = useState<string>()

    return <>
        { CreateDialog && <CreateDialog<InputProps<T>> open={dialogOpen} setOpen={setDialogOpen} defaultValue={dialogDefaultValue} setFinal={chosenSetter} /> }
        <Autocomplete
            value={chosen || ""}
            selectOnFocus
            clearOnBlur
            handleHomeEndKeys
            freeSolo
            options={options}
            onOpen={onOpen}
            onChange={(_e, value) => {
                if(typeof value === 'string') {
                    chosenSetter(undefined)
                }else if(value && value.inputValue) {
                    if(CreateDialog) {
                        setDialogDefaultValue(value.inputValue)
                        setDialogOpen(true)
                    }else{
                        chosenSetter({
                            name: value.inputValue
                        }as InputProps<T>)
                    }
                }else{
                    chosenSetter(value as InputProps<T>)
                }
            }}
            filterOptions={(options, params) => {
                const filtered = filter(options, params)
                const { inputValue } = params
                const isExisting = options.some((option) => inputValue === option.name)
                if (inputValue !== '' && !isExisting) {
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
    </>
}