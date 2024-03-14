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

const { Header, Content, Sider } = Layout;
const { Text, Title } = Typography;



const TrainArea = () => {

    const endTrain = () => {
        setTrainState(2)
    }
    const { config, setConfig, trainState, setTrainState, progress, setProgress } = useContext(ConfigContext)

    const effectRan = useRef(false);

    // onload sound play
    useEffect(() => {
        if (!effectRan.current) {
            console.log("effect applied - only on the FIRST mount");
        }

        return () => effectRan.current = true;

    }, [])

    const correctAns = (sound) => {
        setProgress({
            ...progress,
            rightNum: progress.chosen ? progress.rightNum : progress.rightNum+1,
            rightSounds: progress.chosen? progress.rightSounds: progress.rightSounds.set(sound, (progress.rightSounds.get(sound) ?? 0) + 1),
            chosen: true,
            currentSoundIndex: progress.chosen ? progress.currentSoundIndex : progress.currentSoundIndex + 1,
        })
    }

    useEffect(()=> {

        if(progress.currentSoundIndex >= progress.rightNum + progress.wrongNum) {
            if(progress.played) return;

            setTimeout(()=>{
                console.log(1231)
                // playsound
                setProgress({
                    ...progress,
                    played: true
                })
            
            }, config.waitInterval)
        }
    }, [progress])

    const replayFunc = () => {
        setProgress({
            ...progress,
            finishedNum: progress.finishedNum + 1,
            currentSoundIndex: progress.currentSoundIndex + 1,
        })
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

                <ButtonGroupWithFunc config={config} setConfig={setConfig} propName={"sounds"} disableCtl={true} tagName={"playable"} buttonSize={80} size={'small'} ></ButtonGroupWithFunc>

                <Row justify="center" style={{ margin: 20 }}>
                    <Button type='success' style={{ margin: 5 }} onClick={replayFunc}   >Replay</Button>
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