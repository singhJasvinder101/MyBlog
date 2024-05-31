import React, { useEffect, useState } from "react";
import { HiOutlineSpeakerWave } from "react-icons/hi2";
import { HiOutlineSpeakerXMark } from "react-icons/hi2";
import { convert } from 'html-to-text';

const TextToSpeech = ({ text }) => {
    const [isPlaying, setIsPlaying] = useState(false);

    useEffect(() => {
        const synth = window.speechSynthesis;
        synth.cancel();
        setIsPlaying(false);
    }, []);

    let isSpeaking = false;
    
    const handlePlay = () => {
        const synth = window.speechSynthesis;

        if (!synth.speaking) {
            const speech = new SpeechSynthesisUtterance();
            speech.text = text;

            synth.speak(speech);
            setIsPlaying(true);

            speech.onend = () => {
                setIsPlaying(false);
            };
        }else if (synth.paused) {
            synth.resume();
            isSpeaking = true;
            setIsPlaying(true);
        } else {
            synth.pause();
            isSpeaking = false;
            setIsPlaying(false);
        } 
        
    };


    const handleStop = () => {
        const synth = window.speechSynthesis;
        synth.cancel(); 
        setIsPlaying(false); 
    };

    return (
        <div>
            <button className="tts" onClick={handlePlay}>
                {isPlaying ? (
                    <HiOutlineSpeakerWave  />
                ) : (
                    <HiOutlineSpeakerXMark />
                )}
            </button>
            {/* <button onClick={handleStop}>Stop</button> */}
        </div>
    );
};

export default TextToSpeech;
