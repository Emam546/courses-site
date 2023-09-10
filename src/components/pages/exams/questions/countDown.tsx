import { useEffect, useState } from "react";

function millisecondsToMinutesAndSeconds(milliseconds: number) {
    milliseconds = Math.max(0, milliseconds);
    const totalSeconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;

    // Ensure that single-digit seconds are formatted with a leading zero
    const firstString = minutes < 10 ? `0${minutes}` : `${minutes}`;
    const secondsString = seconds < 10 ? `0${seconds}` : `${seconds}`;

    return `${firstString}:${secondsString}`;
}
export interface CountDownProps {
    onFinish: () => {};
    remainingTime: number;
}
export function CountDown({ onFinish, remainingTime }: CountDownProps) {
    const [str, setStr] = useState<string>(
        millisecondsToMinutesAndSeconds(remainingTime)
    );
    useEffect(() => {
        const endTime = Date.now() + remainingTime;
        const inter = setInterval(() => {
            const t = endTime - Date.now();
            if (t > 0) setStr(millisecondsToMinutesAndSeconds(t));
            else {
                setStr(millisecondsToMinutesAndSeconds(0));
                onFinish();
                clearInterval(inter);
            }
        }, 1000);
        return () => clearInterval(inter);
    }, [remainingTime]);
    return <div className="countDown">{str}</div>;
}
