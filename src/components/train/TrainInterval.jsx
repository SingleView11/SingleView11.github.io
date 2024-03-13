import React, { useState } from "react"
import { ConfigComponent } from "./FillConfig"
import { Space, Typography } from "antd"
import { generateConfig } from "../../utils/initConfig"
import { intervalConfig } from "../../utils/initConfig"


const { Text, Title } = Typography



const TrainInterval = () => {
    const [config, setConfig] = useState(intervalConfig)


    return (
        <>
            
            <ConfigComponent {...{ config, setConfig }} ></ConfigComponent>
        </>
    )
}

export default TrainInterval