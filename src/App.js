// App.js
import { Routes, Route } from 'react-router-dom';
import AboutComponent from './components/layout/About';
// import IntroductionPage from "./components/layout/IntroductionPage"
import HeaderComponent from './components/layout/Header';
import FooterComponent from './components/layout/Footer';
import ErrorComponent from './components/layout/ErrorPage';
import HomeComponent from './components/layout/Home';
import TrainSideBar from './components/train/TrainingSideBar';

import { TrainChord } from './components/train/TrainChord';
import { TrainInterval } from './components/train/TrainInterval';
import { TrainNote } from './components/train/TrainNote';

import 'antd-button-color/dist/css/style.css';

import { useState } from 'react';
import { ConfigContext } from './components/globalStates/ConfigContext';
import { initialConfig } from './utils/trainConfig';

const App = () => {
  const [config, setConfig] = useState(initialConfig)
  const [trainState, setTrainState] = useState(0)
  const [progress, setProgress] = useState({})

  return (
    <>
      <ConfigContext.Provider value={{
        config: config, setConfig: setConfig,
        trainState: trainState, setTrainState: setTrainState,
        progress: progress, setProgress: setProgress,
      }}>
        <HeaderComponent></HeaderComponent>
        <Routes>
          <Route path="/" element={<HomeComponent />} />
          <Route path="/about" element={<AboutComponent />} />
          <Route path='/train' element={<TrainSideBar></TrainSideBar>}>
            <Route path="chord" element={<TrainChord></TrainChord>} />
            <Route path="interval" element={<TrainInterval></TrainInterval>} />
            <Route index element={<TrainInterval></TrainInterval>} />
            <Route path="note" element={<TrainNote></TrainNote>} />
            {/* <Route path="melody" element={<TrainMelody></TrainMelody>} /> */}
          </Route>

          <Route path='/listen' element={<TrainSideBar></TrainSideBar>}>
            <Route index element={<TrainInterval></TrainInterval>} />

            <Route path="chord" element={<TrainChord></TrainChord>} />
            <Route path="interval" element={<TrainInterval></TrainInterval>} />
            <Route path="note" element={<TrainNote></TrainNote>} />
            {/* <Route path="melody" element={<TrainMelody></TrainMelody>} /> */}
          </Route>

          <Route path='/test' element={<TrainSideBar></TrainSideBar>}>
            <Route path="chord" element={<TrainChord></TrainChord>} />
            <Route path="interval" element={<TrainInterval></TrainInterval>} />
            <Route element={<TrainInterval></TrainInterval>} />

            <Route path="note" element={<TrainNote></TrainNote>} />
            {/* <Route path="melody" element={<TrainMelody></TrainMelody>} /> */}
          </Route>

          <Route path='*' element={<ErrorComponent />} />
        </Routes>
        <FooterComponent></FooterComponent>
      </ConfigContext.Provider>
    </>
  );
};

export default App;