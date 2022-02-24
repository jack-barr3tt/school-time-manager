import { Edit, Delete } from "@mui/icons-material";
import { Autocomplete, createFilterOptions, IconButton, Stack, TextField, Typography } from "@mui/material";
import { Dispatch, SetStateAction, SyntheticEvent } from "react";
import EasyDialog, { EasyDialogProps } from "./EasyDialog";

type Props<A> = {
    label: string;
    options: A[];
    chosenSetter: Dispatch<SetStateAction<A|undefined>>;
    chosen: A;
    onOpen?: (event: SyntheticEvent) => void;
    dialog?: {
        props: EasyDialogProps
        textValueSetter: Dispatch<SetStateAction<string|undefined>>;
        setOpen: Dispatch<SetStateAction<boolean>>;
    };
    edit?: (item: A) => void;
    _delete?: (item: A) => void;
}

type InputProps<B> = B & {
    inputValue?: string;
    name: string;
}

export default function CreateableAutocomplete<T extends { _id?: number }>(props: Props<InputProps<T>>) {
    const { label, options, chosenSetter, chosen, onOpen, dialog, edit, _delete } = props

    const filter = createFilterOptions<InputProps<T>>()

    return <>
        { dialog && <EasyDialog {...dialog.props}/> }
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
                    if(dialog) {
                        dialog.textValueSetter(value.inputValue)
                        dialog.setOpen(true)
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
            renderOption={(props, option) => {
                if((edit || _delete) && option._id) {
                    const listProps = (({ className, tabIndex }) => ({ className, tabIndex }))(props)
                    return <li {...listProps} key={props.id}>
                        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ width: 1 }} spacing={2}>
                            <Typography variant="body1" sx={{ width: 1 }} {...props}>{option.name}</Typography>
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