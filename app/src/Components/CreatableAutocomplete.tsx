import { Edit, Delete } from "@mui/icons-material";
import { Autocomplete, createFilterOptions, IconButton, Stack, TextField, Typography } from "@mui/material";
import { Dispatch, ReactElement, SetStateAction, useState, SyntheticEvent } from "react";

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
    onOpen?: (event: SyntheticEvent) => void;
    CreateDialog?: <A>(props: DialogProps<A>) => ReactElement<DialogProps<A>>;
    edit?: (item: A) => void;
    _delete?: (item: A) => void;
}

type InputProps<B> = B & {
    inputValue?: string;
    name: string;
}

export default function CreateableAutocomplete<T extends { _id?: number }>(props: Props<InputProps<T>>) {
    const { label, options, chosenSetter, chosen, onOpen, CreateDialog, edit, _delete } = props
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
            renderOption={(props, option) => {
                if((edit || _delete) && option._id) {
                    const listProps = (({ className, tabIndex }) => ({ className, tabIndex }))(props)
                    return <li {...listProps} key={props.id}>
                        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ width: 1 }}>
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