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

export const TrainResult = () => {
    const { trainState, setTrainState, progress, setProgress, config, setConfig, user } = useContext(ConfigContext)
    const [progressInfos, setProgressInfos] = useState(getProgressInfos(progress, config))
    const [isSaving, setIsSaving] = useState(false)
    const hasSaved = useRef(false) // Track if we've already saved

    // Save training results when component mounts (session completed)
    useEffect(() => {
        const saveTrainingResults = async () => {
            console.log('TrainResult: useEffect triggered, user:', user, 'hasSaved:', hasSaved.current, 'isSaving:', isSaving);
            
            // Only save if user is logged in and we haven't saved yet
            if (!user || hasSaved.current || isSaving) {
                if (!user) console.log('Guest user - training results not saved');
                if (hasSaved.current) console.log('Already saved, skipping...');
                if (isSaving) console.log('Currently saving, skipping...');
                return;
            }
            
            hasSaved.current = true; // Mark as saved immediately to prevent duplicates
            setIsSaving(true);
            console.log('Starting to save training results...');
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
                const sessionId = crypto.randomUUID();
                
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
                                trainingType: config.trainingType || 'interval_recognition',
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
                                trainingType: config.trainingType || 'interval_recognition',
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
                            trainingType: config.trainingType || 'interval_recognition',
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
                            trainingType: config.trainingType || 'interval_recognition',
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
        console.log('useEffect dependencies - user:', user, 'hasSaved:', hasSaved.current);
        if (user && !hasSaved.current) {
            console.log('Calling saveTrainingResults...');
            saveTrainingResults();
        }
    }, [user]); // Only depend on user

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

                    {user && (
                        <Button type="default" style={{ margin: 10 }} block onClick={testDashboardAPIs} >Test Dashboard APIs</Button>
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