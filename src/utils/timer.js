import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, Image} from 'react-native';
import {FontSize, color, typography} from '../theme';

function Timer({setShowTimer, timer, title}) {
  const [minutes, setMinutes] = useState(
    timer?.length === 1 ? `0${timer}` : timer,
  );
  const [seconds, setSeconds] = useState('00');
  const [counter, setCounter] = useState(timer);
  const [redFlag, setRedFlag] = useState(false);
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (
      seconds === '00' &&
      minutes === '00' &&
      redFlag === true &&
      count === 0
    ) {
      setCount(1);
      setShowTimer(false);
    }
  }, [count, minutes, redFlag, seconds, setShowTimer]);

  useEffect(() => {
    setMinutes(timer?.length === 1 ? `0${timer}` : timer);
    setSeconds('00');
    setCounter(timer);
    setRedFlag(false);
    setCount(0);
  }, [timer]);

  useEffect(() => {
    setCounter(Number(timer) * 60);
  }, [timer]);

  useEffect(() => {
    let intervalId;

    if (counter > -1) {
      intervalId = setInterval(() => {
        const secondCounter = counter % 60;
        const minuteCounter = Math.floor(counter / 60);

        const computedSecond =
          String(secondCounter).length === 1
            ? `0${secondCounter}`
            : secondCounter;
        const computedMinute =
          String(minuteCounter).length === 1
            ? `0${minuteCounter}`
            : minuteCounter;

        setSeconds(computedSecond);
        setMinutes(computedMinute);
        if (counter >= 0) {
          setCounter(counter => counter - 1);
        }
        setRedFlag(true);
      }, 1000);
    }
    return () => clearInterval(intervalId);
  }, [minutes, counter]);

  return (
    <View style={styles.container}>
      <Text style={styles.normal}>{` ${minutes} : ${seconds}`}</Text>
    </View>
  );
}

export default Timer;

const styles = StyleSheet.create({
  textColor: {
    color: '#F32013',
    fontWeight: 'bold',
  },
  normal: {
    color: color.palette.btnColor,
    // fontWeight: 'bold',
    fontFamily: typography.secondary,
    fontSize: FontSize.font_medium_E,
    lineHeight: 22.63,
    marginTop: 10,
  },
  container: {
    flexDirection: 'row',
    // marginBottom: 20,
    justifyContent: 'flex-end',
  },
  colorTimer: {
    tintColor: '#F32013',
    height: 20,
    width: 20,
  },
  normalTimer: {
    tintColor: 'black',
    height: 20,
    width: 20,
  },
});
