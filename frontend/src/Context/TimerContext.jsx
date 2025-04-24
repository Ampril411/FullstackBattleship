import { createContext, useContext, useState, useEffect } from "react";

// Create a context for the game timer
const TimerContext = createContext();

export const TimerProvider = ({ children }) => {
    const [time, setTime] = useState(0);        // Elapsed time in seconds
    const [running, setRunning] = useState(false);

    // Load initial time on mount (for refresh resume)
    useEffect(() => {
        const savedStart = localStorage.getItem("timerStartTimestamp");
        if (savedStart) {
            const startTime = parseInt(savedStart, 10);
            const now = Date.now();
            const elapsed = Math.floor((now - startTime) / 1000);
            setTime(elapsed);
            setRunning(true); // Resume timer
        }
    }, []);

    // Timer interval effect
    useEffect(() => {
        let interval;
        if (running) {
            interval = setInterval(() => {
                setTime(prev => prev + 1);
            }, 1000);
        } else {
            clearInterval(interval);
        }
        return () => clearInterval(interval);
    }, [running]);

    // Start the timer and store the start timestamp
    const start = () => {
        if (!localStorage.getItem("timerStartTimestamp")) {
            localStorage.setItem("timerStartTimestamp", Date.now().toString());
        }
        setRunning(true);
    };

    // Stop the timer without clearing localStorage (optional)
    const stop = () => {
        setRunning(false);
    };

    // Reset timer and clear stored start time
    const reset = () => {
        setTime(0);
        setRunning(false);
        localStorage.removeItem("timerStartTimestamp");
    };

    return (
        <TimerContext.Provider value={{ time, start, stop, reset }}>
            {children}
        </TimerContext.Provider>
    );
};

// Custom hook to use the timer
export const useTimer = () => useContext(TimerContext);
