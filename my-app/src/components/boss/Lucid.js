import { useEffect, useReducer, useRef, useState } from "react";
// useEffect로 state 관찰 후 패턴, 남은시간 변경
// 패턴, 남은시간 상태관리 해야할지.

const reducer = (state, action) => {
  if (typeof action.type === "number") {
    return action.type;
  }
  if (action.type === "start") {
    return state - 1;
  }
};

const Lucid = () => {
  // 발판 시간 입력하면 2분 주기 계산기
  // 폭탄 버튼 누르면 90초 쿨타임

  // 시간 입력 받아야함
  const [inputTime, setInputTime] = useState(""); // 입력받는 시간, 4자리
  const [currentTime, dispatch] = useReducer(reducer, 0); // 현재시간
  const [patternTime, setPatternTime] = useState(0); // 패턴시간
  const [remainingTime, setRemainingTime] = useState(0); // 남은시간
  const [buttonState, setButtonState] = useState(true); // 토글스위치

  const [boomTime, setBoomTime] = useState(0); // 폭탄시간
  const [boomRemaining, setBoomRemaining] = useState(0); // 폭탄남은시간

  const interval = useRef(null); // setInterval 경로

  useEffect(() => {
    if (currentTime >= patternTime) setRemainingTime(currentTime - patternTime); // 남은시간 계산

    if (boomTime > 0 && boomRemaining > 0)
      setBoomRemaining(currentTime - boomTime); // 폭탄남은시간 계산

    if (currentTime === boomTime) {
      console.log("Boom!!");
    }

    if (currentTime > 120 && currentTime === patternTime) {
      setPatternTime(currentTime - 120);
      console.log("Attack!!");
    }

    if (currentTime === 0) clearInterval(interval.current); // 현재시간이 0이 되면 setInterval 중지
  }, [currentTime]);

  return (
    <div className="lucid">
      <div className="">
        <input
          className="input_box"
          value={inputTime}
          onChange={(e) => {
            if (inputTime.length < 4) setInputTime(e.target.value);
            console.log(inputTime);
          }}
        />
        <input
          type="button"
          value={buttonState ? "시작" : "리셋"}
          onClick={() => {
            if (buttonState && inputTime.length === 4) {
              setButtonState(!buttonState);

              const minute = parseInt(inputTime[0] + inputTime[1]);
              const second = parseInt(inputTime[2] + inputTime[3]);

              const exchange_time = minute * 60 + second;

              dispatch({ type: exchange_time });
              setPatternTime(exchange_time);

              interval.current = setInterval(() => {
                dispatch({ type: "start" });
              }, 1000);

              console.log(exchange_time);
            } else if (!buttonState) {
              setButtonState(!buttonState);

              clearInterval(interval.current);

              setInputTime("");
              dispatch({ type: 0 });
              setPatternTime(0);
              setBoomTime(0);
              setBoomRemaining(0);
            }
          }}
        />
      </div>
      <div className="">
        현재시간 : {Math.floor(currentTime / 60)}분 {currentTime % 60}초
      </div>
      <div className="">
        패턴시간 : {Math.floor(patternTime / 60)}분 {patternTime % 60}초
      </div>
      <div className="">
        남은시간 : {Math.floor(remainingTime / 60)}분 {remainingTime % 60}초
      </div>
      <br />
      <div className="">
        폭탄 쿨타임{" "}
        <input
          type="button"
          value="시작"
          onClick={() => {
            if (!buttonState && currentTime >= 90) {
              setBoomTime(currentTime - 90);
              setBoomRemaining(90);
            }
          }}
        />
      </div>
      <div className="">
        폭탄시간 : {Math.floor(boomTime / 60)}분 {boomTime % 60}초 이후
      </div>
      <div className="">
        남은시간 : {Math.floor(boomRemaining / 60)}분 {boomRemaining % 60}초
      </div>
    </div>
  );
};

export default Lucid;