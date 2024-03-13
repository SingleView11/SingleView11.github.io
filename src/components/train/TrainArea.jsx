import Button from 'antd-button-color';
import { Routes, Route, Link, Outlet } from 'react-router-dom';
import { useContext } from 'react';
import { ConfigContext } from '../globalStates/ConfigContext';

const TrainArea = () => {

    const endTrain = () => {
        setTrainState(2)
    }
    const { trainState, setTrainState } = useContext(ConfigContext)
    return (
        <>
            {/* <h1>Training Area</h1> */}
            {/* <Link to="chord"> <h2>chord link</h2> </Link>
            <Link to="interval"> <h2>interval link</h2> </Link>
            <Link to="note"> <h2>note link</h2> </Link>
            <Link to="melody"> <h2>melody link</h2> </Link> */}

            <Button type="warning" onClick={endTrain} >Exit</Button>
            <Outlet></Outlet>
        </>
    )
}

export default TrainArea;