import { Edit, Delete } from "@mui/icons-material";
import { Autocomplete, createFilterOptions, IconButton, Stack, TextField, Typography } from "@mui/material";
import { Dispatch, SetStateAction, SyntheticEvent } from "react";
import EasyDialog, { EasyDialogProps } from "./EasyDialog";

type Props<A> = {
    label: string
    autoFocus?: boolean
    options: A[]
    chosenSetter: Dispatch<SetStateAction<A|undefined>>
    chosen: A
    onOpen?: (event: SyntheticEvent) => void
    dialog?: {
        props: EasyDialogProps
        textValueSetter: Dispatch<SetStateAction<string|undefined>>
        setOpen: Dispatch<SetStateAction<boolean>>
    }
    save: (item: any[]) => void
    edit?: (item: A) => void
    _delete?: (item: A) => void
}

type InputProps<B> = B & {
    inputValue?: string  // Stores the value typed into the text field by the user
    name: string // Stores the text to be rendered in the dropdown menu
}

export default function CreateableAutocomplete<T extends { _id?: number }>(props: Props<InputProps<T>>) {
    const { label, autoFocus, options, chosenSetter, chosen, onOpen, dialog, save, edit, _delete } = props

    const filter = createFilterOptions<InputProps<T>>() // Uses a pre-defined filter function to filter the options based on the input value

    return <>
        { 
            // Dialog used if a new item is to be created
            dialog && <EasyDialog {...{
                ...dialog.props,
                done: save
            }}/> 
        }
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
                    chosenSetter(undefined) // Value should never be a string, but we confirm this for purposes of type-safety
                }else if(value && value.inputValue) { // If the value has an inputValue property, it is a new item
                    if(dialog) { // If a dialog has been provided
                        dialog.textValueSetter(value.inputValue) // We set the initial value of the dialog to the value typed into the text field
                        dialog.setOpen(true) // And open the dialog
                    }else{
                        save([value.inputValue]) // Otherwise we call the save function with the value typed into the text field
                    }
                }else{
                    chosenSetter(value as InputProps<T>) // This must be an existing item, so we store it as-is
                }
            }}
            filterOptions={(options, params) => {
                const filtered = filter(options, params) // Filter out the options based on the input value
                const { inputValue } = params
                const isExisting = options.some((option) => inputValue === option.name)
                if (inputValue !== '' && !isExisting) { // If a value has been entered that doesn't exist
                    filtered.push({
                        inputValue,
                        name: `Add "${inputValue}"`, // Add another item to the dropdown that allows the user to create it
                    } as InputProps<T>)
                }

                return filtered
            }}
            getOptionLabel={(option) => {
                if(typeof option === 'string') {
                    return option // Value should never be a string, but we confirm this for purposes of type-safety
                }
                return option.name
            }}
            renderInput={(params) => (
                <TextField {...params} autoFocus={autoFocus} label={label} />
            )}
            renderOption={(props, option) => {
                if((edit || _delete) && option._id) { 
                    // If edit and delete buttons are provided, we need to render these as well
                    const listProps = (({ className, tabIndex }) => ({ className, tabIndex }))(props)
                    return <li {...listProps} key={props.id}>
                        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ width: 1 }} spacing={2}>
                            <Typography sx={{ width: 1 }} {...props}>{option.name}</Typography>
                            <Stack direction="row" spacing={2}>
                                {edit && <IconButton onClick={() => edit(option)}>
                                    <Edit/>
                                </IconButton>}
                                {_delete && <IconButton onClick={() => { 
                                    _delete(option)
                                    chosenSetter(undefined)
                                }}>
                                    <Delete/>
                                </IconButton>}
                            </Stack>
                        </Stack>
                    </li>
                }else{
                    return <li {...props}>
                        {option.name}
                    </li>
                }
            }}

        />
    </>
}