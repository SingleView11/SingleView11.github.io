import React from "react"
import Button from "antd-button-color"
import { Col, Row, Slider, InputNumber } from 'antd';
import { TitleCen } from "./titleFunc";
import { upFirst } from "../../utils/levelTypes";

export const SlideBarProp = ({ config, setConfig, propName, propTitle, sliderStep = 1 }) => {
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

export const ButtonSelecOne = ({ config, setConfig, propName, propTitle }) => {
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

export const ButtonGroupWithFunc = ({ config, setConfig, propName, clickFunc, tagName, disableCtl = false, buttonSize=200, size="" }) => {
    return (
        <Row justify="center">
            {config[propName].map((soundInfo, index) => {
                return (
                    <Col key={soundInfo["key"]}>
                        <Button style={{ margin: 10, width: buttonSize, }} id={soundInfo.key}
                            key={soundInfo["key"]} name={soundInfo["name"]} 
                            onClick={clickFunc}
                            type={soundInfo[tagName] ? "primary" : "default"}
                            size={size}
                            // disabled={true}
                            disabled={soundInfo[tagName] ? false : disableCtl}

                        >{soundInfo["name"]}</Button>
                    </Col>
                )
            })}
        </Row>
    )
}
