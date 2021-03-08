// 실패작

import _, { delay } from '../util.js';
import { hexToDec } from '../convert.js';
import { blinkingPie } from '../canvasController.js';

const checkWhiteSpace = (str) => /\s/g.test(str);
const changeArrowLocation = (hexValue, arrowImage) => {
    const prevClassName = arrowImage.className;

    if (_.classContains(arrowImage, prevClassName))
        _.classRemove(arrowImage, prevClassName);

    _.classAdd(arrowImage, `transform__rotate__${hexToDec(hexValue)}`);
};

const changeArrowExecute = (changeArrowExTimerParams) => new Promise((resolve) => {
    const {
        timeout,
        resultData,
        anotherInput,
        anotherCanvasInfo,
        anotherCanvasInfo: { arrowImage },
    } = changeArrowExTimerParams;    
        
    for (let currChar of resultData) {             
        if (checkWhiteSpace(currChar)) continue;

        delay(timeout).then(() => {   
            anotherInput.value += currChar;                        
            blinkingPie(currChar, anotherCanvasInfo, timeout);
            changeArrowLocation(currChar, arrowImage);
        })          
    }
    resolve('changeArrowExecute OK');
});

// Promise & Timer ------------------------------------------------------------------------

// 화살표 위치 변경 전, 송수신기(canvas) 전체 애니메이션 적용 (깜박이는 애니메이션)
const receivedData = (canvas, timeout) => {
    _.classAdd(canvas, 'blinking');
    return delay(timeout, canvas).then(() => _.classRemove(canvas, 'blinking'));
};

// 화살표 위치 변경
const changeArrow = (infoFromPlanet, timeout) =>
    new Promise((resolve) => {
        const { anotherCanvasInfo, anotherInput, resultData, charPos } = infoFromPlanet;        
        const changeArrowExTimerParams = { timeout, resultData, charPos, anotherInput, anotherCanvasInfo };
    
        changeArrowExecute(changeArrowExTimerParams).then(() => resolve("changeArrow OK"));        
    });

// 다른 행성으로 메세지 전송 및 애니메이션
const sendMessageAnotherPlanet = (infoFromPlanet, timeout) => {
    const {
        anotherCanvasInfo: { canvas },
        anotherTranslateBtn,
    } = infoFromPlanet;

    receivedData(canvas, timeout)
        .then(() => 
        changeArrow(infoFromPlanet, timeout)
            .then(() => (anotherTranslateBtn.disabled = false)))
        .catch((err) => console.error(err));
};

export { sendMessageAnotherPlanet };
