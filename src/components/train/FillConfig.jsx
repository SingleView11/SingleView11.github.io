import React, { useContext, useState } from "react"
import { TitleCen } from "../uiItems/titleFunc";
import { upFirst } from "../../utils/levelTypes";
import { ConfigContext } from "../globalStates/ConfigContext";
import { SlideBarProp, ButtonGroupWithFunc, ButtonSelecOne, SlideBarRangeProp } from "../uiItems/BarButtons";


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

            <ButtonGroupWithFunc config={config} setConfig={setConfig} propName={"sounds"} disableCtl={false} tagName={"playable"} clickFunc={soundChoose} ></ButtonGroupWithFunc>

            <SlideBarProp config={config} setConfig={setConfig} propName={"speed"} propTitle={"Speed"} ></SlideBarProp>
            <SlideBarProp config={config} setConfig={setConfig} propName={"noteBpm"} propTitle={"Note length"} sliderStep={0.01} ></SlideBarProp>
            <SlideBarProp config={config} setConfig={setConfig} propName={"questionNumber"} propTitle={"Question number"} sliderStep={5} ></SlideBarProp>
            {/* <SlideBarProp config={config} setConfig={setConfig} propName={"scaleRange"} propTitle={"Scale Range"} ></SlideBarProp> */}
            <SlideBarRangeProp config={config} setConfig={setConfig} propName={"scaleRange"} propTitle={"Scale Range"} ></SlideBarRangeProp>
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