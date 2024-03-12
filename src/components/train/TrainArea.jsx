import { Routes, Route, Link, Outlet } from 'react-router-dom';


const TrainArea = () => {
    return (
        <>
            <h1>Training Area</h1>
            <Link to="chord"> <h2>chord link</h2> </Link>
            <Link to="interval"> <h2>interval link</h2> </Link>
            <Link to="note"> <h2>note link</h2> </Link>
            <Link to="melody"> <h2>melody link</h2> </Link>

            <Outlet></Outlet>
        </>
    )
}

export default TrainArea;