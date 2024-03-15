import Button from 'antd-button-color';
import { Space, Layout, theme, Typography, Modal } from 'antd';
import { ButtonGroupWithFunc } from '../uiItems/BarButtons';

import { Outlet } from 'react-router-dom';
import { useContext, useEffect, useState, useRef } from 'react';
import { ConfigContext } from '../globalStates/ConfigContext';
import { TitleCen } from '../uiItems/titleFunc';
import { Col, Row, Slider, InputNumber, Progress } from 'antd';
import { HintModal, ChooseModal } from '../uiItems/HintModal';
import { ProgressBarTrain } from '../uiItems/ProgressBar';
import { playSoundDemo, stopSamplerAll } from '../playSound/playSingle';

const { Header, Content, Sider } = Layout;
const { Text, Title } = Typography;



const TrainArea = () => {

    const endTrain = () => {
        setTrainState(2)
    }

    const [curProblem, setCurProblem] = useState([])

    // -1 for not answered, 0 for not passed, 1 for passed and waiting for next one
    const [ansStatus, setAnsStatus] = useState(-1)

    const startNewProblem = (currentProgress) => {


        // init buttons and ans status

        setAnsStatus(-1)

        // select a random sound mode to play

        // playsound
        playCurProblem()




    }

    const playCurProblem = () => {
        playSoundDemo()
        // playSoundOnce([curProblem], config)
    }



    const { config, setConfig, trainState, setTrainState, progress, setProgress } = useContext(ConfigContext)

    const effectRan = useRef(false);

    // onload sound play
    useEffect(() => {
        if (!effectRan.current && !progress.started) {
            startNewProblem(progress)
            setProgress({
                ...progress,
                started: true
            })
        }
        return () => effectRan.current = true;

    }, [])

    const correctAns = (sound) => {
        if (config.rightThen.cur == 0) {
            playSoundDemo()
        }
        if (ansStatus == 1) return;
        if (ansStatus == -1) {

            setProgress({
                ...progress,
                rightNum: progress.rightNum + 1,
                rightSounds: progress.rightSounds.set(sound, (progress.rightSounds.get(sound) ?? 0) + 1),
                finishedNum: progress.finishedNum + 1,
            })
        }
        setAnsStatus(1)
        // console.log(progress)
        stopSamplerAll()
        
        if(progress.finishedNum >= config.questionNumber.cur - 1) {
            setTimeout(()=>{
                endTrain()
            }, 2000)
        }

        // passing outdated data
        setTimeout(() => {
            startNewProblem(progress)
        }, config.waitInterval.cur * 1000 + 500)


    }

    const wrongAns = (sound) => {
        if (config.wrongThen.cur == 0) {
            playSoundDemo()
        }
        if (ansStatus == -1) {
            setProgress({
                ...progress,
                wrongNum: progress.wrongNum + 1,
                wrongSounds: progress.wrongSounds.set(sound, (progress.wrongSounds.get(sound) ?? 0) + 1),
                chosen: true,
            })
            setAnsStatus(0)
        }

    }


    const clickButtonHandler = (e) => {
        const buttonVal = e.currentTarget.name
        if (true || curProblem == buttonVal) {
            correctAns(buttonVal)
        }
        else {
            wrongAns(buttonVal)
        }
    }


    const replayFuncTrial = () => {
        playCurProblem()
        // endTrain()
        // setProgress({
        //     ...progress,
        //     finishedNum: progress.finishedNum + 1,
        // })
    }


    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();
    return (
        <>

            <Content
                style={{
                    margin: 0,
                    marginTop: 20,
                    padding: 24,
                    background: colorBgContainer,
                    borderRadius: borderRadiusLG,
                }}
            >
                <TitleCen text={"C"}></TitleCen>

                <ButtonGroupWithFunc
                    config={config} setConfig={setConfig} propName={"sounds"}
                    disableCtl={true} tagName={"playable"} buttonSize={80}
                    size={'small'}
                    clickFunc={clickButtonHandler}
                ></ButtonGroupWithFunc>

                <Row justify="center" style={{ margin: 20 }}>
                    <Button type='success' style={{ margin: 5 }} onClick={replayFuncTrial}   >Replay</Button>
                </Row>

                <ProgressBarTrain progress={Math.round(100 * (config.questionNumber.cur ? (progress.finishedNum / config.questionNumber.cur) : 0))} ></ProgressBarTrain>


            </Content>

            <Content
                style={{
                    margin: 0,
                    marginTop: 20,
                    padding: 24,
                    background: colorBgContainer,
                    borderRadius: borderRadiusLG,
                }}
            >
                <Row justify="center" style={{ marginTop: 0 }}>

                    <ChooseModal endFunc={endTrain} buttonType='warning' name="Exit"
                        title='Confirmation' text={"Are you sure to end training now?"}
                    ></ChooseModal>

                    <HintModal></HintModal>


                </Row>
            </Content>

            <Outlet></Outlet>
        </>
    )
}

export default TrainArea;