import Button from 'antd-button-color';
import { useContext } from 'react';
import { ConfigContext } from '../globalStates/ConfigContext';
import { generateInitProgress } from '../../utils/progressConfig';

export const TrainResult = () => {
    const { trainState, setTrainState, progress, setProgress } = useContext(ConfigContext)

    const restartTrain = () => {
        setProgress(generateInitProgress())
        setTrainState(1)
    }
    const reConfigTrain = () => {
        setTrainState(0)
    }
    return (
        <>
            Result page

            <Button type="warning" onClick={restartTrain} >restart</Button>

            <Button type="warning" onClick={reConfigTrain} >reConfig</Button>
        </>
    )
}