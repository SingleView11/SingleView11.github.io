import React, { useContext, useState } from "react"
import { TitleCen } from "../uiItems/titleFunc";
import { upFirst } from "../configs/levelTypes";
import { ConfigContext } from "../globalStates/ConfigContext";
import { SlideBarProp, ButtonGroupWithFunc, ButtonSelecOne, SlideBarRangeProp } from "../uiItems/BarButtons";
import { isMelody } from "../playSound/playSpecific";
import { theme } from "antd";
import { Content } from "antd/es/layout/layout";
import { changeSamplerSound } from "../playSound/playFunction"


export const PlayConfigComponent = () => {
    const { config, setConfig, } = useContext(ConfigContext)
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();
    return (
        <Content
            style={{
                margin: 0,
                marginTop: 20,
                padding: 24,
                background: colorBgContainer,
                borderRadius: borderRadiusLG,
            }}
        >
            <SlideBarProp config={config} setConfig={setConfig} propName={"noteBpm"} propTitle={"Note length"} sliderStep={0.01} ></SlideBarProp>
            <SlideBarProp config={config} setConfig={setConfig} propName={"volume"} propTitle={"Volume"} sliderStep={0.1} triggerFunc={() => { changeSamplerSound(config.volume.cur) }} ></SlideBarProp>


            {config[""]}
        </Content>
    )
}