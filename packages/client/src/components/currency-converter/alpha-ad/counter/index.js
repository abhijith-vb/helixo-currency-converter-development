/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import { Row, Col, Typography } from 'antd';

const { Text, Title } = Typography;

const TIME_DIFFERENCE = 24 * 60 * 60 * 1000

export default function () {

    const tomorrowsDate = new Date().getTime() + TIME_DIFFERENCE;
    const [countdownDate] = useState(new Date(tomorrowsDate).getTime());


    const setNewTime = () => {
        if (countdownDate) {
            const currentTime = new Date().getTime();

            const distanceToDate = countdownDate - currentTime;

            let days = Math.floor(distanceToDate / (1000 * 60 * 60 * 24));
            let hours = Math.floor(
                (distanceToDate % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
            );
            let minutes = Math.floor(
                (distanceToDate % (1000 * 60 * 60)) / (1000 * 60),
            );
            let seconds = Math.floor((distanceToDate % (1000 * 60)) / 1000);

            const numbersToAddZeroTo = [1, 2, 3, 4, 5, 6, 7, 8, 9];

            days = `${days}`;
            if (numbersToAddZeroTo.includes(hours)) {
                hours = `0${hours}`;
            } else if (numbersToAddZeroTo.includes(minutes)) {
                minutes = `0${minutes}`;
            } else if (numbersToAddZeroTo.includes(seconds)) {
                seconds = `0${seconds}`;
            }

            setState({ days: days, hours: hours, minutes, seconds });
        }
    };
    const [state, setState] = useState({
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
    });

    useEffect(() => {
        setInterval(() => setNewTime(), 1000);
    }, [setNewTime]);



    return (
        <Row className="ad-counter">
            {state.hours !== 0 &&
                <Col className='counter-item'>
                    <span>{state.hours}</span>
                    <span> Hours</span>
                </Col>
            }
            {state.minutes !== 0 &&
                <Col className='counter-item '>
                    <span>{state.minutes}</span>
                    <span> Minutes</span>
                </Col>
            }

            {state.seconds !== 0 &&
                <Col className='counter-item '>
                    <span>{state.seconds}</span>
                    <span> Seconds</span>
                </Col>
            }
        </Row>
    );
};