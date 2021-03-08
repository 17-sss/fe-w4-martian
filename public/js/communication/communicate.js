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

// Promise & Timer ------------------------------------------------------------------------

// 화살표 위치 변경 전, 송수신기(canvas) 전체 애니메이션 적용 (깜박이는 애니메이션)
const receivedData = (canvas, timeout) => {
    _.classAdd(canvas, 'blinking');
    return delay(timeout, canvas).then(() => _.classRemove(canvas, 'blinking'));
};

// 화살표 위치 변경, 캔버스 색상 변경   // delay 미적용.. 너무 돌고 도는중 / 미션 5하면서 프로미스 다시공부
const changeArrow = (infoFromPlanet, timeout) =>
    new Promise((resolve, reject) => {
        const { anotherCanvasInfo, anotherInput, resultData } = infoFromPlanet;
        let { charPos } = infoFromPlanet;
        const { arrowImage } = anotherCanvasInfo;

        const executeTimer = () => {
            setTimeout(() => {
                try {
                    if (resultData === anotherInput.value) {
                        arrowImage.className = '';
                        resolve('changeArrow OK');                        
                    } else {
                        let currChar = resultData[charPos];
                        if (!currChar)
                            throw new Error('Error - changeArrow');
                        anotherInput.value += currChar;
                        charPos++;

                        if (checkWhiteSpace(currChar)) {
                            currChar = resultData[charPos];
                            anotherInput.value += currChar;
                            charPos++;
                        }
                        blinkingPie(currChar, anotherCanvasInfo, timeout);
                        changeArrowLocation(currChar, arrowImage);
                        executeTimer();
                    }
                } catch (error) {
                    reject(error);
                }
            }, timeout);
        };
        executeTimer();
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

