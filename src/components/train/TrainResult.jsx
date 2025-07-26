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

    // Save training results when component mounts (session completed)
    useEffect(() => {
        console.log('🔥 TrainResult useEffect RUNNING - this should appear when component loads');
        
        const saveTrainingResults = async () => {
            console.log('=== TrainResult: useEffect triggered ===');
            console.log('User:', user);
            console.log('hasSaved.current:', hasSaved.current);
            console.log('isSaving:', isSaving);
            console.log('Progress:', progress);
            console.log('Config:', config);
            
            // Only save if user is logged in and we haven't saved yet
            if (!user) {
                console.log('❌ No user - training results not saved');
                message.warning('Please login to save training results');
                return;
            }
            
            if (hasSaved.current) {
                console.log('❌ Already saved, skipping...');
                return;
            }
            
            if (isSaving) {
                console.log('❌ Currently saving, skipping...');
                return;
            }
            
            hasSaved.current = true; // Mark as saved immediately to prevent duplicates
            setIsSaving(true);
            console.log('✅ Starting to save training results...');
            console.log('Progress data:', progress);
            console.log('Config data:', config);

            // First test the connection/authentication
            console.log('Testing API connection...');
            const testResult = await trainingService.testConnection();
            console.log('Connection test result:', testResult);
            
            if (!testResult.authenticated) {
                throw new Error('Not authenticated');
            }
            
            if (testResult.error) {
                throw new Error(`API connection failed: ${JSON.stringify(testResult.error)}`);
            }

            try {
                // Generate a session ID for this training session
                const sessionId = generateUUID();
                
                // Create training records for each question answered
                const trainingRecords = [];
                
                // Extract training data from progress and config
                const totalQuestions = progress.rightNum + progress.wrongNum;
                console.log('Total questions:', totalQuestions);
                
                // For each question, we need to reconstruct the training record
                // Since we don't have individual question data, we'll create aggregate records
                if (progress.rightSounds && progress.rightSounds.size > 0) {
                    console.log('Processing right sounds:', progress.rightSounds);
                    for (const [musicalElement, count] of progress.rightSounds.entries()) {
                        for (let i = 0; i < count; i++) {
                            trainingRecords.push({
                                sessionId: sessionId, // UUID string
                                trainingType: getTrainingType(config),
                                playMode: config.playMode || 'harmonic',
                                musicalElement: String(musicalElement), // Ensure string
                                userAnswer: String(musicalElement), // Ensure string, correct answer
                                isCorrect: true // Boolean
                            });
                        }
                    }
                }
                
                if (progress.wrongSounds && progress.wrongSounds.size > 0) {
                    console.log('Processing wrong sounds:', progress.wrongSounds);
                    for (const [musicalElement, count] of progress.wrongSounds.entries()) {
                        for (let i = 0; i < count; i++) {
                            trainingRecords.push({
                                sessionId: sessionId,
                                trainingType: getTrainingType(config),
                                playMode: config.playMode || 'harmonic',
                                musicalElement: String(musicalElement),
                                userAnswer: 'unknown', // We don't track wrong answers specifically
                                isCorrect: false
                            });
                        }
                    }
                }

                // If no detailed sound data, create summary records
                if (trainingRecords.length === 0 && totalQuestions > 0) {
                    console.log('No detailed sound data, creating summary records');
                    // Create records for correct answers
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
                }

                console.log('Generated training records:', trainingRecords);

                if (trainingRecords.length === 0) {
                    console.log('No training records to save');
                    message.info('No training data to save');
                    return;
                }

                // Save all training records
                console.log('Saving training records to backend...');
                const savePromises = trainingRecords.map(record => 
                    trainingService.saveTrainingRecord(record)
                        .then(result => {
                            console.log('Successfully saved record:', result);
                            return result;
                        })
                        .catch(error => {
                            console.error('Failed to save individual record:', error);
                            return null; // Continue with other saves
                        })
                );
                
                const results = await Promise.all(savePromises);
                const successCount = results.filter(result => result !== null).length;
                
                console.log('Save results:', results);
                console.log('Success count:', successCount);
                
                if (successCount > 0) {
                    message.success(`Training session saved! ${successCount} questions recorded.`);
                    console.log(`Saved training session with ${successCount} records`);
                } else {
                    throw new Error('No records were saved successfully');
                }
                
            } catch (error) {
                console.error('Failed to save training results:', error);
                // Always show error message for debugging
                message.error(`Failed to save training results: ${error.message || 'Unknown error'}`);
            } finally {
                setIsSaving(false);
                console.log('Finished saving training results');
            }
        };

        // Only save once when component mounts and user is logged in
        console.log('=== useEffect dependencies check ===');
        console.log('user:', user);
        console.log('hasSaved.current:', hasSaved.current);
        console.log('progress.rightNum + progress.wrongNum:', progress.rightNum + progress.wrongNum);
        
        if (user && !hasSaved.current && (progress.rightNum + progress.wrongNum > 0)) {
            console.log('✅ Conditions met - calling saveTrainingResults...');
            saveTrainingResults();
        } else {
            console.log('❌ Conditions not met for saving');
        }
    }, [user, progress.rightNum, progress.wrongNum]); // Depend on user and progress

    const restartTrain = () => {
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

                    {/* Commented out to prevent duplicate saves and UI confusion */}
                    {/* {user && (
                        <>
                            <Button type="default" style={{ margin: 10 }} block onClick={testDashboardAPIs} >Test Dashboard APIs</Button>
                            <Button 
                                type="default" 
                                style={{ margin: 10 }} 
                                block 
                                loading={isSaving}
                                onClick={async () => {
                                    console.log('=== MANUAL SAVE STARTED ===');
                                    
                                    // Reset save state to allow manual save
                                    hasSaved.current = false;
                                    setIsSaving(true);
                                    
                                    try {
                                        // First test the connection/authentication
                                        console.log('Testing API connection...');
                                        const testResult = await trainingService.testConnection();
                                        console.log('Connection test result:', testResult);
                                        
                                        if (!testResult.authenticated) {
                                            throw new Error('Not authenticated');
                                        }
                                        
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
                                        
                                        message.success(`Manually saved ${results.length} training records!`);
                                        hasSaved.current = true;
                                        
                                    } catch (error) {
                                        console.error('Manual save failed:', error);
                                        message.error(`Manual save failed: ${error.message}`);
                                    } finally {
                                        setIsSaving(false);
                                    }
                                }}
                            >
                                {isSaving ? 'Saving...' : 'Manual Save Training Results'}
                            </Button>
                        </>
                    )} */}

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