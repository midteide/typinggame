import React, {useState, useEffect, useRef} from 'react'
import './TypingGame.css'

const TypingGame = () => {
    //const maxTime = 10;
    const [maxTime, setMaxTime] = useState(15)
    const [text, setText] = useState("")
    const [isGameActive, setIsGameActive] = useState(false)
    const [isGameFinished, setIsGameFinished] = useState(false)
    const [isReplayActive, setIsReplayActive] = useState(false)
    ///////////////
    const [startTime, setStartTime] = useState();
    const [gameTime, setGameTime] = useState(0);
    const [replayTime, setReplayTime] = useState(0);
    const [letterArr, setLetterArr] = useState([])
    const interval = useRef();
    const textBox = useRef(null);
    
    const handleClick = (time) => {
        setMaxTime(time)
        textBox.current.focus();
        setText("")
        setLetterArr([])
        setStartTime(Date.now());
        setIsGameActive(true)
        setGameTime(0);
        interval.current = setInterval(() => {
            setGameTime(prev => prev + 0.005);
        textBox.current.focus();
        //console.log("a")
        }, 5);
    }
    
    useEffect(() => {
        //if ((gameTime % 1) === 0) 
        //console.log("Gametime222: ", gameTime)
        if(gameTime >= maxTime) {
            clearInterval(interval.current);
            setIsGameActive(false)
            console.log("Setting GameActive FALSE")
            setIsGameFinished(true)
            replay();
        }
    }, [gameTime]);

    /////////
    const handleChange = (props) => {
        

        //console.log("LetterArr: ", letterArr)
    }

    const onKeyPressHandler = (props) => {
        const {key} = props
        console.log("onKeyPressHandler pressed: ", key)
        let gameTimeTemp = parseFloat(gameTime.toFixed(3))
        let letterEntry = {letter: key, time: gameTimeTemp, key: gameTime}
        setLetterArr(prev => [...prev,letterEntry])
        setText(prev => prev + key)
    }
    const onKeyDownHandler = (props) => {
        //console.log("OnKeyDownHandler: ", props.key)
        const {key} = props
        if (key === 'Backspace'){
            console.log("onKeyDownHandler pressed: ", key)
            let gameTimeTemp = parseFloat(gameTime.toFixed(3))
            let letterEntry = {letter: key, time: gameTimeTemp, key: gameTime}
            setLetterArr(prev => [...prev,letterEntry])
    
            console.log("Found Backspace in handleChange")
            // let tempArray = text;
            // tempArray.pop();
            setText(text.slice(0, -1))
        } 
    }

    const replay = () => {
        setIsReplayActive(true)
        setReplayTime(0);
        setText("")
        interval.current = setInterval(() => {
            setReplayTime(prev => prev + 0.005);
        }, 5);
    }

    useEffect(() => {
        //if ((replayTime % 1) === 0) console.log("ReplayTime: ", gameTime)
        if(replayTime >= maxTime) {
            clearInterval(interval.current);
            setIsReplayActive(false)
        }
        letterArr.map((letter, index) => {
            if(parseFloat(replayTime.toFixed(3)) === letter.time) {
                console.log(letter.letter)
                if (letter.letter === 'Backspace') {
                    console.log("Found Backspace in UseEffect Replay:", index)
                    //let tempArray = text;
                    
                    setText(text.slice(0,-1));
                } else {
                    setText(prev => prev + letter.letter)
                }
            }
        //return <p>hei</p>
        })
    }, [replayTime]);
    
    const getNumberOfWords = () => {
        let tempText = text.trim();
        tempText = tempText.split(' ')
        //console.log("Text.length: ", tempText.length)
        //console.log("Text: ", tempText)
        return tempText.length
    }

    return (
        <div className="box">
            <h1>Hvor raskt klarer du å skrive?</h1>

            <textarea 
                value={text}
                ref={textBox}
                disabled={(isGameActive) ? false : true}
                onChange={handleChange} 
                onKeyPress={onKeyPressHandler}
                onKeyDown={onKeyDownHandler}
            />
            {isGameActive ? <p style={{textAlign: "left"}}> Time remaining: {parseFloat((maxTime-gameTime).toFixed()) } seconds </p>:<></>}
            {isReplayActive ? <p style={{textAlign: "left"}}> Playback time: {parseFloat((replayTime).toFixed()) } seconds </p>:<></>}
            <button 
                onClick={() => handleClick(5)} 
                disabled={!isGameActive ? false : true}
                > Start game (15sec)
            </button>
            <button 
                onClick={() => handleClick(30)} 
                disabled={!isGameActive ? false : true}
                > Start game (30sec)
            </button>
            <button 
                onClick={() => handleClick(45)} 
                disabled={!isGameActive ? false : true}
                > Start game (45sec)
            </button>
            <button 
                onClick={replay} 
                disabled={(letterArr && isGameActive) ? true : false}
                > Replay 
            </button>

            {gameTime ? 
                <>
            <p> Number of words typed:  {getNumberOfWords()} (Words per minute: {parseFloat( ( getNumberOfWords() * (60.0/gameTime)).toFixed(2) )})</p>
            <p> Number of characters typed:  {letterArr.length} (Characters per minute: {parseFloat( (letterArr.length / (gameTime/60)).toFixed(2) )})</p>
                </>
            : <></>}
        </div>

    )
}

export default TypingGame