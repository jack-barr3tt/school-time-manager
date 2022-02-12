import { Add } from "@mui/icons-material";
import { Fab, Skeleton } from "@mui/material";
import { useCallback, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Repeat from "../../../API/Repeat";
import { User } from "../../../API/Users";
import { userContext } from "../../../App";
import NavBar from "../../../Components/NavBar";
import SetupCard from "../../../Components/SetupCard";
import EditRepeat from "./EditRepeat";

export default function ViewRepeats() {
    const [repeats, setRepeats] = useState<Repeat[]>()
    const [editing, setEditing] = useState(false)
    const [editingId, setEditingId] = useState<number>()

    const user = useContext(userContext)
    const navigate = useNavigate()

    const fetchRepeats = useCallback(async () => {
        setRepeats(
            await User.forge(user.id).repeats?.get()
        )
    }, [user.id])

    const deleteRepeat = async (repeat: Repeat) => {
        await repeat.delete()
        if(repeats)
            setRepeats(
                repeats.filter(r => r._id !== repeat._id)
            )
    }

    useEffect(() => {
        fetchRepeats()
    }, [fetchRepeats, editing])

    const getDay = (day: number) => ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"][day]
    return <>
        { !editing ? <>
            <NavBar name="View Repeats"/>
            {
                repeats ? 
                    repeats.map(r => <SetupCard 
                        key={r._id}
                        id={r._id}
                        topText={r.name}
                        bottomText={`${getDay(r.start_day)} to ${getDay(r.end_day)}`}
                        setEditing={setEditing}
                        setEditingId={setEditingId}
                        deleteItem={() => deleteRepeat(r)}
                    />)
                :
                    (new Array(5)).fill(0).map((_a, i) => 
                        <Skeleton key={""+i} variant="rectangular" height={92} animation="wave" sx={{ borderRadius: 1 }}/>
                    )
            }
            <Fab color="primary" sx={{ position: "absolute", right: "24px", bottom: "24px" }} onClick={() => navigate("new")}>
                <Add/>                      
            </Fab>
        </> : <EditRepeat back={() =>  setEditing(false)} id={editingId}/> }
    </>
}