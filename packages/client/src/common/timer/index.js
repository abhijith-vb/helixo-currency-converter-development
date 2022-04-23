/* eslint-disable no-plusplus */
/* eslint-disable no-const-assign */
import React, { useState, useEffect } from 'react';

export default function Timer(props) {
    const { time = '0:0', setTimerStatus } = props;
    const [timerDisplay, setTimerDisplay] = useState(time);
    const [showHeartBeat, setHeartBeat] = useState(false);

    const HEART_BEAT_TRIGGER_MINUTES = 3;



    console.log(`Timer component rendering`);
    const splitTime = timerDisplay.split(':');
    const duration = +splitTime[0] * 60 + +splitTime[1]; // taking only minutes and seconds
    // setTimer(duration || 0);
    // const [timer, setTimer] = useState(duration || 0);


    useEffect(() => {
        let timerValue = duration;
        let heartBeatValid = false;
        const TIMER = setInterval(function () {
            const localMinutes = parseInt(timerValue / 60, 10);
            const localSeconds = parseInt(timerValue % 60, 10);

            const min = localMinutes < 10 ? `0${localMinutes}` : localMinutes;
            const sec = localSeconds < 10 ? `0${localSeconds}` : localSeconds;

            setTimerDisplay(`${min}:${sec}`);
            if (`${min}:${sec}` === "00:00") {
                setTimerStatus(true);
            }
            /* Adding urgency animation if timer below 3seconds */
            // if (minutes < 3) u$('.ufe .utimer val').addClass('uheartbeat');
            timerValue -= 1;
            if (min <= HEART_BEAT_TRIGGER_MINUTES && !heartBeatValid) {
                heartBeatValid = true;
                setHeartBeat(true);
            }
            // setTimer(timerValue);
            if (timerValue === -1) {
                // timer = duration;
                clearInterval(TIMER);
                // u$('.ufe .utimer val').removeClass('uheartbeat');
                // u$('.pre-title').hide('slow');
            }
        }, 1000);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return duration ?
        // eslint-disable-next-line react/react-in-jsx-scope
        <span>{timerDisplay}</span>

        : null;
}
