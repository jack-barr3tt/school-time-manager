import { Dispatch, SetStateAction, useCallback, useEffect, useState } from "react";
import Location, { LocationInput } from "../../API/Location";
import { User } from "../../API/Users";
import { useUser } from "../../Hooks/useUser";
import CreateableAutocomplete from "../CreatableAutocomplete";
import EasyDialog from "../EasyDialog";

type LocationsDropdownProps = {
    autoFocus?: boolean;
    location: LocationInput|undefined;
    setLocation: Dispatch<SetStateAction<LocationInput|undefined>>;
}

export default function LocationsDropdown(props: LocationsDropdownProps) {
    const { autoFocus, location, setLocation } = props

    const [locations, setLocations] = useState<Location[]>()
    const [locationEditing, setLocationEditing] = useState<LocationInput>()

    const { userId } = useUser()

    const fetchLocations = useCallback(async () => {
        setLocations(
            await User.forge(userId).locations?.get()
        )
    }, [userId])

    useEffect(() => {
        fetchLocations()
    }, [fetchLocations])
    
    const createLocation = async (name?: string) => {
        if(name) {
            const location = await User.forge(userId).locations?.create(name as string)
            if(location) {
                if(locations) setLocations(
                    [...locations, location]
                )
                setLocation(location)
            }
        }
    } 
    
    const editLocation = async (name?: string) => {
        if(locationEditing && locationEditing._id && locations && name) {
            const location = await User.forge(userId).locations?.get(locationEditing._id)
            if(location) {
                const editedLocation = await location.edit({
                    name
                })
                setLocations(locations.map(l => l._id === locationEditing._id ? location : l))
                setLocation(editedLocation)
            }
        }
        setLocationEditing(undefined)
    }

    const deleteLocation = async (id?: number) => {
        if(id && locations) {
            const location = await User.forge(userId).locations?.get(id)
            if(location) await location.delete()
            setLocations(locations.filter(l => l._id !== id))
        }
    }

    return <>
        { locations && <CreateableAutocomplete<LocationInput>
            label="Location"
            autoFocus={autoFocus}
            options={locations}
            chosenSetter={setLocation}
            chosen={location!}
            onOpen={() => fetchLocations()}
            save={([name]) => createLocation(name)}
            edit={(item) => setLocationEditing(item)}
            _delete={(item) => deleteLocation(item._id)}
        /> }
        <EasyDialog
            title="Edit Location"
            fields={[{ label: "Name", type: "text", defaultValue: locationEditing?.name }]}
            open={!!locationEditing}
            done={([name]) => editLocation(name)}
        />
    </>
}