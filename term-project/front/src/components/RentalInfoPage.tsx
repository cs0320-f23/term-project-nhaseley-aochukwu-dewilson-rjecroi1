import { useParams } from "react-router-dom";

export default function RentalInfoPage(){
    const { id } = useParams();

    return (
        <div> This is the info page for rental {id} </div>
    )
}