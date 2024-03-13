import React, { useContext, useState } from "react"
import Button from "antd-button-color"
import { Col, Divider, Row, Slider, InputNumber } from 'antd';
import { Typography } from "antd";
import { TitleCen } from "../../utils/titleFunc";
import { upFirst } from "../../utils/levelTypes";
import { ConfigContext } from "../globalStates/ConfigContext";

const { Text, Title } = Typography

const SlideBarProp = ({ config, setConfig, propName, propTitle, sliderStep = 1 }) => {
    let cfg = {
        ...config
    }

    const propChoose = (value) => {
        cfg[propName] = {
            ...cfg[propName],
            cur: value
        }
        setConfig(cfg)

    }
    return (
        <>
            <TitleCen text={propTitle}></TitleCen>
            <Row justify="center">
                <Col span={12}>
                    <Slider
                        min={config[propName].min}
                        max={config[propName].max}
                        value={config[propName].cur}
                        onChange={propChoose}
                        step={sliderStep}

                    />
                </Col>
                <Col span={2}>
                    <InputNumber
                        min={config[propName].min}
                        max={config[propName].max}
                        style={{ margin: '0 16px', width: 50 }}
                        value={config[propName].cur}
                        onChange={propChoose}
                        step={sliderStep}
                    />
                </Col>
            </Row>
        </>
    )
}

const ButtonSelecOne = ({ config, setConfig, propName, propTitle }) => {
    let cfg = {
        ...config
    }

    const handleButtonSelection = (e) => {
        cfg[propName].cur = e.currentTarget.name
        setConfig(cfg)
    }

    return (
        <>
            <TitleCen text={propTitle}></TitleCen>
            <Row justify="center">
                {config[propName].options.map((option, index) => {
                    return (
                        <Col key={`${option} with ${index} in ${config.type}`}>
                            <Button style={{ margin: 10, }} name={index} onClick={handleButtonSelection}
                                type={index == config[propName].cur ? "primary" : "lightdark"}
                            >{upFirst(option)}</Button>
                        </Col>
                    )
                })}

            </Row>
        </>
    )
}

const ConfigComponent = () => {
    const { config, setConfig, } = useContext(ConfigContext)
    const soundChoose = (e) => {
        setConfig({
            ...config,
            sounds: config["sounds"].map(soundConfig => {
                if (soundConfig.key !== e.currentTarget.id) return soundConfig;
                return {
                    ...soundConfig,
                    playable: !soundConfig.playable
                }
            })
        })
    }


    return (
        <>
            {/* Buttons of Sounds */}

            <TitleCen text={`${upFirst(config.type)} Selection`}></TitleCen>

            <Row justify="center">
                {config["sounds"].map((soundInfo, index) => {
                    return (
                        <Col key={soundInfo["key"]}>
                            <Button style={{ margin: 10, width: 200, }} id={soundInfo.key} key={soundInfo["key"]} name={soundInfo["key"]} onClick={soundChoose} type={soundInfo["playable"] ? "primary" : "lightdark"} >{soundInfo["name"]}</Button>
                        </Col>
                    )
                })}
            </Row>

            <SlideBarProp config={config} setConfig={setConfig} propName={"speed"} propTitle={"Speed"} ></SlideBarProp>
            <SlideBarProp config={config} setConfig={setConfig} propName={"questionNumber"} propTitle={"Question number"} sliderStep={5} ></SlideBarProp>
            <SlideBarProp config={config} setConfig={setConfig} propName={"scaleRange"} propTitle={"Scale Range"} ></SlideBarProp>
            <SlideBarProp config={config} setConfig={setConfig} propName={"waitInterval"} propTitle={"Interval Time"} sliderStep={0.01} ></SlideBarProp>
            <ButtonSelecOne config={config} setConfig={setConfig} propName={"prelude"} propTitle={"Prelude"}></ButtonSelecOne>

            <ButtonSelecOne config={config} setConfig={setConfig} propName={"playForm"} propTitle={"Mode"}></ButtonSelecOne>
            <ButtonSelecOne config={config} setConfig={setConfig} propName={"wrongThen"} propTitle={"Action after wrong"}></ButtonSelecOne>
            {config["rightThen"] && <ButtonSelecOne config={config} setConfig={setConfig} propName={"rightThen"} propTitle={"Action after correct"}></ButtonSelecOne>}
            {config[""]}
        </>
    )
}

export { ConfigComponent }