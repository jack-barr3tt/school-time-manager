import { Add } from "@mui/icons-material";
import { Fab, Skeleton } from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Repeat from "../../../API/Repeat";
import { User } from "../../../API/Users";
import NavBar from "../../../Components/NavBar";
import SetupCard from "../../../Components/SetupCard";
import { DayIndexToString } from "../../../functions";
import { useUser } from "../../../Hooks/useUser";
import EditRepeat from "./EditRepeat";

export default function ViewRepeats() {
    const [repeats, setRepeats] = useState<Repeat[]>()
    const [editing, setEditing] = useState(false)
    const [editingId, setEditingId] = useState<number>()

    const { userId } = useUser()
    const navigate = useNavigate()

    const fetchRepeats = useCallback(async () => {
        setRepeats(
            await User.forge(userId).repeats?.get()
        )
    }, [userId])

    const deleteRepeat = async (repeat: Repeat) => {
        await repeat.delete()
        if(repeats)
            // Remove the deleted repeat from the list
            setRepeats(
                repeats.filter(r => r._id !== repeat._id)
            )
    }

    // Fetch repeats on mount or when edit mode is toggled
    useEffect(() => {
        fetchRepeats()
    }, [fetchRepeats, editing])

    return <>
        { !editing ? <>
            <NavBar name="View Repeats"/>
            {
                repeats ? 
                    repeats.map(r => <SetupCard 
                        key={r._id}
                        id={r._id}
                        topText={r.name}
                        bottomText={`${DayIndexToString(r.start_day, "long")} to ${DayIndexToString(r.end_day, "long")}`}
                        setEditing={setEditing}
                        setEditingId={setEditingId}
                        deleteItem={() => deleteRepeat(r)}
                    />)
                :
                    // Show 5 loading skeletons while blocks have not loaded
                    (new Array(5)).fill(0).map((_a, i) => 
                        <Skeleton key={""+i} variant="rectangular" height={92} animation="wave" sx={{ borderRadius: 1 }}/>
                    )
            }
            <Fab sx={{ position: "absolute", right: "24px", bottom: "24px" }} onClick={() => navigate("new")}>
                <Add/>                      
            </Fab>
        </> : <EditRepeat back={() => setEditing(false)} id={editingId}/> }
    </>
}