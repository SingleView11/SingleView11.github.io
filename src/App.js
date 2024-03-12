// App.js
import { Routes, Route } from 'react-router-dom';
import AboutComponent from './components/layout/About';
import IntroductionPage from "./components/layout/IntroductionPage"
import HeaderComponent from './components/layout/Header';
import FooterComponent from './components/layout/Footer';
import ErrorComponent from './components/layout/ErrorPage';
import HomeComponent from './components/layout/Home';
import TrainSideBar from './components/train/TrainingSideBar';

import TrainChord from './components/train/TrainChord';
import TrainInterval from './components/train/TrainInterval';
import TrainMelody from './components/train/TrainMelody';
import TrainNote from './components/train/TrainNote';

const App = () => {
  return (
    <>
      <HeaderComponent></HeaderComponent>
      <Routes>
        <Route path="/" element={<HomeComponent />} />
        <Route path="/about" element={<AboutComponent />} />
        <Route path='/train' element={<TrainSideBar></TrainSideBar>}>
          <Route path="chord" element={<TrainChord></TrainChord>} />
          <Route path="interval" element={<TrainInterval></TrainInterval>} />
          <Route path="note" element={<TrainNote></TrainNote>} />
          <Route path="melody" element={<TrainMelody></TrainMelody>} />
        </Route>

        <Route path='*' element={<ErrorComponent />} />
      </Routes>
      <FooterComponent></FooterComponent>
    </>
  );
};

export default App;