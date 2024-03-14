import Button from 'antd-button-color';
import { Space, Layout, theme, Typography, Modal } from 'antd';
import { ButtonGroupWithFunc } from '../uiItems/BarButtons';

import { Outlet } from 'react-router-dom';
import { useContext, useState } from 'react';
import { ConfigContext } from '../globalStates/ConfigContext';
import { TitleCen } from '../uiItems/titleFunc';
import { Col, Row, Slider, InputNumber } from 'antd';
import { HintModal, ChooseModal} from '../uiItems/HintModal';
import { randomTip } from '../../utils/giveTips';

const { Header, Content, Sider } = Layout;
const { Text, Title } = Typography;



const TrainArea = () => {

    const endTrain = () => {
        setTrainState(2)
    }
    const { trainState, setTrainState } = useContext(ConfigContext)
    const { config, setConfig, } = useContext(ConfigContext)



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

                <Row justify="center" style={{ marginTop: 20 }}>
                    <Button type='success' style={{ margin: 5 }}   >Replay</Button>
                </Row>


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