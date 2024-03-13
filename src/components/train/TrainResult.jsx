import Button from 'antd-button-color';
import { useContext } from 'react';
import { ConfigContext } from '../globalStates/ConfigContext';
export const TrainResult = () => {
    const restartTrain = () => {
        setTrainState(1)
    }
    const reConfigTrain = () => {
        setTrainState(0)
    }
    const { trainState, setTrainState } = useContext(ConfigContext)
    return (
        <>
            Result page

            <Button type="warning" onClick={restartTrain} >restart</Button>

            <Button type="warning" onClick={reConfigTrain} >reConfig</Button>
        </>
    )
}