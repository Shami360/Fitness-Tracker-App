import { getExercises, subscribe, type Exercise } from "@/store/exercises";
import { useEffect, useState } from "react";

export function useExercises(): Exercise[] {
  const [exercises, setExercises] = useState<Exercise[]>(getExercises());

  useEffect(() => {
    setExercises(getExercises());
    const unsubscribe = subscribe(() => {
      setExercises(getExercises());
    });
    return unsubscribe;
  }, []);

  return exercises;
}
