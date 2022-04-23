import React from 'react';
import { useTranslation } from 'react-i18next';
import OnBoardingFirstItem from './on-boarding-first-item';
import OnBoardingSecondItem from './on-boarding-second-item';
import OnBoardingThirdItem from './on-boarding-third-item';
import OnBoardingFourthItem from './on-boarding-fourth-item';
import { Steps } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
const { Step } = Steps;
const ONBOARDING_STEP_1 = 0;
const ONBOARDING_STEP_2 = 1;
const ONBOARDING_STEP_3 = 2;
const ONBOARDING_STEP_4 = 3;
//  show onboarding at that step only 
// hide all step after that
const MAX_ONBOARDING = 2;

export default function (props) {
    const { t } = useTranslation();
    return (
        // only to hide review modal
        props.progress <= MAX_ONBOARDING && <div className="onboardingProgress">
            <Steps current={props.progress}>
                <Step icon={props.progress === ONBOARDING_STEP_1 ? <LoadingOutlined /> : null} title={t('onBoardingProgress.step1.title')} />
                <Step icon={props.progress === ONBOARDING_STEP_2 ? <LoadingOutlined /> : null} title={t('onBoardingProgress.step2.title')} />
                <Step icon={props.progress === ONBOARDING_STEP_3 ? <LoadingOutlined /> : null} title={t('onBoardingProgress.step3.title')} />
                {props.feedbackOnboarding && <Step icon={props.progress === ONBOARDING_STEP_4 ? <LoadingOutlined /> : null} title={t('onBoardingProgress.step4.title')} />}
            </Steps>
            {props.progress === 0 && (
                <OnBoardingFirstItem
                    progress={props.progress}
                    onProgressChange={props.onProgressChange}
                    spanTagAlreadyExist={props.spanTagAlreadyExist}
                    loading={props.loading}
                    spanTags={props.spanTags}
                />
            )}
            {props.progress === 1 && (
                <OnBoardingSecondItem
                    progress={props.progress}
                    onProgressChange={props.onProgressChange}
                    loading={props.saveButtonLoading}
                />
            )}
            {props.progress === 2 && (
                <OnBoardingThirdItem
                    progress={props.progress}
                    onProgressChange={props.onProgressChange}
                    value={props.value}
                    onChange={props.onChange}
                    setOnboardingSuccessModal={props.setOnboardingSuccessModal}
                />
            )}
            {props.progress === 3 && (
                <OnBoardingFourthItem
                    progress={props.progress}
                    onProgressChange={props.onProgressChange}
                    setFeedbackOnboarding={props.setFeedbackOnboarding}
                    setShowRecommendedApps={props.setShowRecommendedApps}
                />
            )}
        </div>
    );
}
