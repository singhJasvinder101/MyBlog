import React, { useState, useEffect } from "react";
import { HiOutlineSpeakerWave } from "react-icons/hi2";
import { HiOutlineSpeakerXMark } from "react-icons/hi2";

const TextToSpeech = ({ text }) => {
    const [utterance, setUtterance] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);

    useEffect(() => {
        const synth = window.speechSynthesis;
        const u = new SpeechSynthesisUtterance(text);
        setUtterance(u);


    }, [text]);

    const handlePlay = () => {
        const synth = window.speechSynthesis;
        // console.log(synth)

        if (synth.paused) {
            synth.resume();
            setIsPlaying(true);
        } else if (synth.speaking) {
            synth.pause();
            setIsPlaying(false);
        } else {
            synth.speak(utterance);
            setIsPlaying(true);
        }
    };

    const handleStop = () => {
        const synth = window.speechSynthesis;
        synth.cancel();
    };

    return (
        <div>
            <button className="tts" onClick={handlePlay}>
                {isPlaying ? (
                    <HiOutlineSpeakerWave className="speaker" />
                ) : (
                        <HiOutlineSpeakerXMark className="speaker" />
                )}
            </button>
        </div>
    );
};

export default TextToSpeech;
