import React, { useState } from 'react';
import { Card } from 'antd';
import FeedbackModal from './../../../common/onboarding-modals/modal-test-app';
import OnBoardingReview from '../../../common/on-boarding-review';
import '../../../style/components/onboardingProgress.scss';


export default function ({ progress, onProgressChange, setFeedbackOnboarding, setShowRecommendedApps }) {
    const [callbackVisibility, setCallbackVisibility] = useState(false);

    return (
        <div className='onBoardingItem'>
            <FeedbackModal callbackVisibility={callbackVisibility}
                callbackStatus={'review'}
                setCallbackVisibility={setCallbackVisibility}
                progress={progress}
                onProgressChange={onProgressChange}
            />
            <Card
                bordered={false}
            >
                <OnBoardingReview setVisibility={setFeedbackOnboarding} setShowRecommendedApps={setShowRecommendedApps} />
            </Card>
        </div>
    )
}