import { useState, useEffect } from "react";

type Props = {
  endDate: Date;
  startDate: Date;
};

export default function Countdown({ endDate, startDate }: Props) {
  const [timeUp, setTimeUp] = useState(false);
  const [showStartCountdown, setShowStartCountdown] = useState(false);
  const [startTimer, setStartTimer] = useState<any>(null);

  const calculateTimeLeft = (): Record<string, number> => {
    const endTime: Date = new Date(endDate);
    const difference: number = Date.parse(endTime.toString()) - Date.now();

    let seconds: string = Math.floor((difference / 1000) % 60).toString();
    let minutes: string = Math.floor((difference / 1000 / 60) % 60).toString();
    let hours: string = Math.floor(
      (difference / (1000 * 60 * 60)) % 24
    ).toString();
    let days: string = Math.floor(
      difference / (1000 * 60 * 60 * 24)
    ).toString();

    hours = hours.padStart(2, "0");
    minutes = minutes.padStart(2, "0");
    seconds = seconds.padStart(2, "0");

    let timeLeft = {};

    if (difference > 0) {
      timeLeft = { days, hours, minutes, seconds };
    } else {
      setTimeUp(true);
      timeLeft = { hours: "00", minutes: "00", seconds: "00" };
    }

    return timeLeft;
  };

  const [timeLeft, setTimeLeft] = useState<Record<string, number>>(() =>
    calculateTimeLeft()
  );

  useEffect(() => {
    const today = new Date().setHours(0, 0, 0, 0);
    const startDateTime = new Date(startDate).setHours(0, 0, 0, 0);

    if (startDateTime === today) {
      setShowStartCountdown(true);
    } else {
      setShowStartCountdown(false);

      const timer = setInterval(() => {
        const timeUntilStart = calculateTimeLeft();
        setTimeLeft(timeUntilStart);

        const startDateTime = new Date(startDate).setHours(0, 0, 0, 0);
        const currentTime = new Date().setHours(0, 0, 0, 0);

        if (currentTime >= startDateTime) {
          setShowStartCountdown(true);
          clearInterval(timer);
        }
      }, 1000);

      setStartTimer(timer);
    }

    return () => {
      if (startTimer) {
        clearInterval(startTimer);
      }
    };
  }, []);

  return (
    <span className="text-xl text-[#ff7d1a] font-semibold">
      {showStartCountdown ? (
        timeUp ? (
          "Time's Up"
        ) : (
          `Ending in ${timeLeft.days == 0 ? "" : `${timeLeft.days} Days`} ${
            timeLeft.hours
          } hours ${timeLeft.minutes} minutes ${timeLeft.seconds} seconds`
        )
      ) : (
        <>
          Time until start: {timeLeft.hours} hours {timeLeft.minutes} minutes{" "}
          {timeLeft.seconds} seconds
        </>
      )}
    </span>
  );
}
