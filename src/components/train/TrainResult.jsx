import Button from 'antd-button-color';
import { Content, } from 'antd/es/layout/layout';
import { Row, theme, Col, message } from 'antd';
import { useContext, useEffect, useState, useRef } from 'react';
import { ConfigContext } from '../globalStates/ConfigContext';
import { generateInitProgress } from '../configs/progressConfig';
import { ResultPie } from '../uiItems/ProgressPie';
import { TitleCen } from '../uiItems/titleFunc';
import { commentOnProgressResult, getCorrectRate } from '../../utils/giveTips';
import { ProgressCardList, getProgressInfos } from '../uiItems/TrainCardList';
import { ProgressFigureOneLine } from '../uiItems/ProgressBar';
import trainingService from '../../services/trainingService';

// Robust UUID generator that works in all browsers
const generateUUID = () => {
    try {
        // Try native crypto.randomUUID first
        if (typeof crypto !== 'undefined' && crypto.randomUUID) {
            return crypto.randomUUID();
        }
    } catch (error) {
        console.warn('crypto.randomUUID not available:', error);
    }
    
    // Fallback UUID v4 generator
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        const r = Math.random() * 16 | 0;
        const v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
};

export const TrainResult = () => {
    const { trainState, setTrainState, progress, setProgress, config, setConfig, user } = useContext(ConfigContext)
    const [progressInfos, setProgressInfos] = useState(getProgressInfos(progress, config))
    const [isSaving, setIsSaving] = useState(false)
    const hasSaved = useRef(false) // Track if we've already saved
    const sessionStartTime = useRef(Date.now()) // Unique timestamp for this session

    // Function to determine the correct training type based on config
    const getTrainingType = (config) => {
        if (!config || !config.type) {
            return 'interval_recognition'; // fallback
        }
        
        const typeMapping = {
            'interval': 'interval_recognition',
            'chord': 'chord_recognition', 
            'note': 'note_recognition',
            'melody': 'melody_recognition'
        };
        
        return typeMapping[config.type] || 'interval_recognition';
    };

    const restartTrain = () => {
        // Reset save state and session time for new training session
        hasSaved.current = false;
        sessionStartTime.current = Date.now();
        setProgress(generateInitProgress())
        setTrainState(1)
    }
    
    const reConfigTrain = () => {
        setTrainState(0)
    }

    const testDashboardAPIs = async () => {
        console.log('Testing dashboard APIs...');
        try {
            console.log('Testing analytics...');
            const analytics = await trainingService.getUserAnalytics();
            console.log('Analytics result:', analytics);
            
            console.log('Testing stats...');
            const stats = await trainingService.getTrainingStats();
            console.log('Stats result:', stats);
            
            message.success('Dashboard APIs tested successfully - check console for results');
        } catch (error) {
            console.error('Dashboard API test failed:', error);
            message.error(`Dashboard API test failed: ${error.message}`);
        }
    }

    useEffect(() => {
        setProgressInfos(getProgressInfos(progress, config))
    }, [progress])

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
                <Row justify="center" style={{ marginTop: 0 }}>
                    <Col span={24}>
                        <TitleCen level={3} text={commentOnProgressResult(progress)} ></TitleCen>
                    </Col>


                    <ResultPie rate={getCorrectRate(progress)}></ResultPie>
                    <Col span={24}>
                        <ProgressFigureOneLine right={progress.rightNum} wrong={progress.wrongNum}></ProgressFigureOneLine>

                    </Col>
                    <Button type="primary" style={{ margin: 10 }} block onClick={restartTrain} >Restart</Button>

                    <Button type="info" style={{ margin: 10 }} block onClick={reConfigTrain} >Return to Config Page</Button>

                    
                    {true && (
                        <>
                            {/* <Button type="default" style={{ margin: 10 }} block onClick={testDashboardAPIs} >Test Dashboard APIs</Button> */}
                            <Button 
                                type="default" 
                                style={{ margin: 10 }} 
                                block 
                                loading={isSaving}
                                disabled={hasSaved.current}
                                onClick={async () => {
                                    console.log('=== MANUAL SAVE STARTED ===');
                                    
                                    // Check if already saved
                                    if (hasSaved.current) {
                                        message.info('Training results already saved!');
                                        return;
                                    }
                                    
                                    setIsSaving(true);
                                    
                                    try {
                                        // First test the connection/authentication
                                        console.log('Testing API connection...');
                                        const testResult = await trainingService.testConnection();
                                        console.log('Connection test result:', testResult);
                                        
                                        if (!testResult.authenticated) {
                                            throw new Error('Not authenticated');
                                        }

                                        console.log(progress)
                                        
                                        // Generate UUID and create records
                                        const sessionId = generateUUID();
                                        console.log('Generated sessionId:', sessionId);
                                        
                                        const trainingRecords = [];
                                        const totalQuestions = progress.rightNum + progress.wrongNum;
                                        console.log('Total questions:', totalQuestions);
                                        
                                        // Create records for right answers
                                        for (let i = 0; i < progress.rightNum; i++) {
                                            trainingRecords.push({
                                                sessionId: sessionId,
                                                trainingType: getTrainingType(config),
                                                playMode: config.playMode || 'harmonic',
                                                musicalElement: 'mixed',
                                                userAnswer: 'correct',
                                                isCorrect: true
                                            });
                                        }
                                        
                                        // Create records for wrong answers
                                        for (let i = 0; i < progress.wrongNum; i++) {
                                            trainingRecords.push({
                                                sessionId: sessionId,
                                                trainingType: getTrainingType(config),
                                                playMode: config.playMode || 'harmonic',
                                                musicalElement: 'mixed',
                                                userAnswer: 'incorrect',
                                                isCorrect: false
                                            });
                                        }
                                        
                                        console.log('Training records to save:', trainingRecords);
                                        
                                        if (trainingRecords.length === 0) {
                                            message.warning('No training data to save');
                                            return;
                                        }
                                        
                                        // Save records
                                        const savePromises = trainingRecords.map(record => 
                                            trainingService.saveTrainingRecord(record)
                                        );
                                        
                                        const results = await Promise.all(savePromises);
                                        console.log('Save results:', results);
                                        
                                        message.success(`Successfully saved ${results.length} training records!`);
                                        hasSaved.current = true; // Disable button after successful save
                                        
                                    } catch (error) {
                                        console.error('Manual save failed:', error);
                                        message.error(`Manual save failed: ${error.message}`);
                                    } finally {
                                        setIsSaving(false);
                                    }
                                }}
                            >
                                {isSaving ? 'Saving...' : (hasSaved.current ? 'Already Saved' : 'Save Training Results')}
                            </Button>
                        </>
                    )}

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
                    <Col key="title analysis" span={24}>
                        <TitleCen level={3} text={"Detailed Analysis"} ></TitleCen>

                    </Col>
                    <Col key="correct text comment " span={24}>
                        <TitleCen level={4} text={`You identified ${progress.rightNum} of ${progress.rightNum + progress.wrongNum} correctly, with a rate of ${getCorrectRate(progress)}%!`} ></TitleCen>
                    </Col>
                    <ResultPie rate={getCorrectRate(progress)}></ResultPie>
                    <Col key="correct data points comment " span={24}>
                        <TitleCen level={4} text={`Here are the accuracy analysis for each sound.`} ></TitleCen>
                    </Col>

                    <Col style={{ textAlign: 'center' }} key="correct data points comment button " span={24}>
                        <Button style={{ margin: 5, verticalAlign: 'middle', }} type={"primary"} onClick={() => { setProgressInfos([...progressInfos].reverse()) }}>Reverse display order</Button>

                    </Col>

                    <ProgressCardList progressCardInfos={progressInfos} ></ProgressCardList>


                </Row>
            </Content>

            {/* Result page */}


        </>
    )
}