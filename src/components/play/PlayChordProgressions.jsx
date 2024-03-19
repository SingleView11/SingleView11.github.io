import { useContext, useEffect, useRef, useState } from "react"
import { CHORD_PROG_INIT_PARAS, CHORD_SINGLE_INIT_PARAS, genChordProblemFromPos, generateDataForChordPara, modes, noteSounds } from "../../utils/musicTerms"
import { SelectGroup } from "../uiItems/selectOptions"
import { Button, Flex, Row, Typography, theme } from "antd"
import { Card, List } from 'antd';
import { v4 } from "uuid";
import { TitleCen } from "../uiItems/titleFunc";
import { CloseOutlined, InfoOutlined, CaretLeftOutlined, CaretRightOutlined, EditOutlined } from '@ant-design/icons';
import { Content } from "antd/es/layout/layout";
import { playSoundMulti, stopSamplerAll } from "../playSound/playFunction";
import { ConfigContext } from "../globalStates/ConfigContext";
import { playContext } from "./playGround";

const { Text, Title } = Typography;


const ChordProgressionUIList = ({ data, deleteFunc, infoFunc, moveLeft, moveRight, editFunc }) => (

  <List
    grid={{
      xs: Flex,
      sm: Flex,
      md: Flex,
      lg: Flex,
      xl: Flex,
      xxl: Flex,
    }}
    dataSource={data}
    locale={{ emptyText: 'Empty' }}
    renderItem={(item) => (
      <List.Item style={{ margin: 5, }}>
        <Card bodyStyle={{ padding: 0, textAlign: "center" }}
          title={<Text style={{ fontSize: 16 }}>{
            <SelectGroup minimalWidth={50} para={item.info}
              setPara={(e) => { editFunc(e, item.key) }} setFuncCustom={true}
            ></SelectGroup>
            //  generateDataForChordPara(item)
          }</Text>} >
          <Button shape="circle" style={{ margin: 5 }} icon={<InfoOutlined />} size="small" type="success" name={item.key} onClick={infoFunc}></Button>
          {/* <Button shape="circle" style={{ margin: 5 }} icon={<EditOutlined />} size="small" type="info" name={item.key} onClick={infoFunc}></Button> */}
          <Button shape="circle" style={{ margin: 5 }} icon={<CaretLeftOutlined />} size="small" type="primary" name={item.key} onClick={moveLeft}></Button>
          <Button shape="circle" style={{ margin: 5 }} icon={<CaretRightOutlined />} size="small" type="primary" name={item.key} onClick={moveRight}></Button>
          <Button shape="circle" style={{ margin: 5 }} icon={<CloseOutlined />} size="small" danger type="primary" name={item.key} onClick={deleteFunc}></Button>
        </Card>
      </List.Item>
    )}
  />
)

const info2ChordData = (para) => {
  const info = { ...para }
  const key = v4();
  return { info: info, key: key }
}

export const PlayChordProg = () => {
  const { config, setConfig } = useContext(ConfigContext)
  const {stateRef} = useContext(playContext)

  const [para, setPara] = useState(CHORD_PROG_INIT_PARAS)
  const [chordPara, setChordPara] = useState(CHORD_SINGLE_INIT_PARAS)
  let [chordList, setChordList] = useState([])
  let [loop, setLoop] = useState(true)

  const chordStateRef = useRef()

  useEffect(() => {
    chordStateRef.chordList = [...chordList]
    chordStateRef.para = {...para}
  }, [para, chordList]);

  const addListChord = () => {
    const newListData = [...chordList, info2ChordData({ ...chordPara })]
    console.log(newListData)
    setChordList(newListData)
  }
  const deleteListChord = (e) => {
    const newListData = []
    chordList.forEach((chord) => {
      if (chord.key != e.currentTarget.name) {
        newListData.push(chord)
      }
    })
    setChordList(newListData)
  }
  
  const swapArr = (arr, i1, i2) => {
    let tmp = arr[i1]
    arr[i1] = arr[i2]
    arr[i2] = tmp
  }
  const moveLeft = (e) => {
    let chordKey = e.currentTarget.name
    const newListData = [...chordList]
    for (let [index, value] of newListData.entries()) {
      if (value.key == chordKey) {
        if (index != 0) {
          swapArr(newListData, index, index - 1)
        }
        break
      }
    }
    setChordList(newListData)
  }
  const moveRight = (e) => {
    let chordKey = e.currentTarget.name
    const newListData = [...chordList]
    for (let [index, value] of newListData.entries()) {
      if (value.key == chordKey) {
        if (index != newListData.length - 1) {
          swapArr(newListData, index, index + 1)
        }
        break
      }
    }
    setChordList(newListData)
  }
  const clearChordList = () => {
    setChordList([])
  }
  const showChordInfo = (e) => {
    console.log(e.currentTarget)
  }

  const playChordWithConfig = async () => {
    let chords = chordStateRef.chordList, paras = chordStateRef.para
    console.log(paras)
    if(chords.length < 1) return
    let chordSounds = chords.map(chordData => {
      return genChordProblemFromPos(paras, chordData.info)
    })
    let chordTimes = chords.map(chordData => {
      return chordData.info.time.cur
    })  
    // console.log(chordSounds)
    // console.log(chordTimes)
    // console.log(loop)
    await playSoundMulti(chordSounds, chordTimes.map(t=>{
      return t * config.noteBpm.cur
    }) , config.speed.cur)
    

  }

  const playChordProgression = async () => {
    stopAll()
    // chordList.forEach(chordData=> {
    //   let chordVal = genChordProblemFromPos(para, chordData.info)
    //   console.log(chordVal)
    // })
    stateRef.current = true
    await playChordWithConfig()
    while (loop && stateRef.current  ) {
      if(chordStateRef.chordList.length < 1) break
      await playChordWithConfig()
    } 

  }


  const stopAll = () => {
    stateRef.current = false
    stopSamplerAll()
  }

  const editChordPos = (e, chordKey) => {
    const newList = [...chordList]
    newList.map(chord => {
      if (chord.key != chordKey) return chord;
      let ans = {
        ...chord,

      }
      ans.info[e.key] = {
        ...ans.info[e.key],
        cur: e.value,
      }
      return ans
    })
    // console.log(chordList)
    setChordList(newList)
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
        <TitleCen level={3} text={"Global Chord Config"}></TitleCen>
        <SelectGroup para={para} setPara={setPara} setFuncCustom={false}  ></SelectGroup>

        <TitleCen level={3} text={"Add Single Chord"}></TitleCen>
        <SelectGroup para={chordPara} setPara={setChordPara} buttonInfos={
          [{ name: "Add", type: "success", clickFunc: addListChord },
          { name: "Clear All", type: "dark", clickFunc: clearChordList },
          ]}  ></SelectGroup>
        {/* <SelectGroup para={para} setPara={setPara}  ></SelectGroup> */}
      </Content>


      <Content
        style={{
          margin: 0,
          marginTop: 20,
          padding: 0,
          background: colorBgContainer,
          borderRadius: borderRadiusLG,
        }}
      >
        <TitleCen level={3} text={"Chord List"}></TitleCen>
        <ChordProgressionUIList data={chordList} configParas={para}
          deleteFunc={deleteListChord} infoFunc={showChordInfo}
          moveLeft={moveLeft} moveRight={moveRight} editFunc={editChordPos}
        ></ChordProgressionUIList>
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
        <Row justify="center" style={{ margin: 0 }}>
          <Button type='success' style={{ margin: 5 }} onClick={playChordProgression}   >Play</Button>
          <Button type={loop ? 'primary' : 'default'} style={{ margin: 5 }} onClick={() => {
            
            let origin = loop
            loop = !origin
            setLoop(!origin)
          }}   >Loop</Button>
          <Button type='lightdark' style={{ margin: 5 }} onClick={() => {
            stopAll()
          }}   >Pause</Button>
        </Row>
      </Content>

    </>


  )
}