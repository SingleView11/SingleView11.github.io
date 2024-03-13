import React, { useState } from "react"
import Button from "antd-button-color"
import { Col, Divider, Row, Slider, InputNumber } from 'antd';
import { Typography } from "antd";
import { TitleCen } from "../../utils/titleFunc";
import { upFirst } from "../../utils/levelTypes";

const { Text, Title } = Typography

const ConfigComponent = ({ config, setConfig, }) => {
    // console.log(config)

    /*
        config type: 
        appearing sounds
        bpm
        play form
        cadence/prefix 

        action after wrong
        action after right

        wait to play next time 

    */


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

    const speedChoose = (value) => {
        setConfig({
            ...config,
            speed: {
                ...config.speed,
                cur: value
            }
        })
    }

    const waitIntervalChoose = (value) => {
            setConfig({
            ...config,
            waitInterval: {
                ...config.waitInterval,
                cur: value
            }
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
                            <Button style={{ margin: 10, width: 100, }} id={soundInfo.key} key={soundInfo["key"]} name={soundInfo["key"]} onClick={soundChoose} type={soundInfo["playable"] ? "primary" : "lightdark"} >{soundInfo["name"]}</Button>
                        </Col>
                    )
                })}
            </Row>

            <TitleCen text="Speed (BPM)"></TitleCen>
            <Row justify="center">
                <Col span={12}>
                    <Slider
                        min={config.speed.min}
                        max={config.speed.max}
                        onChange={speedChoose}

                        value={config.speed.cur}
                    />
                </Col>
                <Col span={2}>
                    <InputNumber
                        min={config.speed.min}
                        max={config.speed.max}
                        style={{ margin: '0 16px', width: 50 }}
                        value={config.speed.cur}
                        onChange={speedChoose}
                    />
                </Col>
            </Row>

            <TitleCen text="Play Interval Time"></TitleCen>
            <Row justify="center">
                <Col span={12}>
                    <Slider
                        min={config.waitInterval.min}
                        max={config.waitInterval.max}
                        onChange={waitIntervalChoose}
                        step={0.01}
                        value={config.waitInterval.cur}
                    />
                </Col>
                <Col span={2}>
                    <InputNumber
                        min={config.waitInterval.min}
                        max={config.waitInterval.max}
                        style={{ margin: '0 16px', width: 50 }}
                        value={config.waitInterval.cur}
                        onChange={waitIntervalChoose}

                    />
                </Col>
            </Row>



        </>
    )
}

export { ConfigComponent }