export type Exercise = {
  id: string;
  name: string;
  category: string;
  description: string;
  image: string;
  completed: boolean;
  custom?: boolean;
};

const DEFAULT_EXERCISES: Exercise[] = [
  {
    id: "1",
    name: "Push Ups",
    category: "Chest",
    description:
      "A classic upper-body exercise that targets the chest, shoulders, and triceps. Start in a plank position with hands shoulder-width apart. Lower your body until your chest nearly touches the floor, then push back up.",
    image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&q=80",
    completed: false,
  },
  {
    id: "2",
    name: "Squats",
    category: "Legs",
    description:
      "A fundamental lower-body exercise that works the quadriceps, hamstrings, and glutes. Stand with feet shoulder-width apart, lower your hips as if sitting in a chair, then return to standing.",
    image: "https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=600&q=80",
    completed: false,
  },
  {
    id: "3",
    name: "Plank",
    category: "Core",
    description:
      "An isometric core exercise that builds stability and endurance. Hold a push-up position with your body in a straight line from head to heels. Engage your core and hold for as long as possible.",
    image: "https://images.unsplash.com/photo-1566241142559-40e1dab266c6?w=600&q=80",
    completed: false,
  },
  {
    id: "4",
    name: "Lunges",
    category: "Legs",
    description:
      "A unilateral leg exercise that improves balance and strengthens the quads, hamstrings, and glutes. Step forward with one leg, lower your hips until both knees are at 90 degrees, then return.",
    image: "https://images.unsplash.com/photo-1434682881908-b43d0467b798?w=600&q=80",
    completed: false,
  },
  {
    id: "5",
    name: "Burpees",
    category: "Full Body",
    description:
      "A high-intensity full-body exercise combining a squat, push-up, and jump. From standing, drop into a squat, kick feet back into a plank, do a push-up, jump feet forward, then leap up with arms overhead.",
    image: "https://images.unsplash.com/photo-1601422407692-ec4eeec1d9b3?w=600&q=80",
    completed: false,
  },
  {
    id: "6",
    name: "Jumping Jacks",
    category: "Cardio",
    description:
      "A simple cardio exercise that raises your heart rate. Start standing with feet together and arms at sides. Jump while spreading legs and raising arms overhead, then jump back to start.",
    image: "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=600&q=80",
    completed: false,
  },
];

let exercises: Exercise[] = [...DEFAULT_EXERCISES];
const listeners: Array<() => void> = [];

export function getExercises(): Exercise[] {
  return exercises;
}

export function addExercise(exercise: Omit<Exercise, "id" | "completed">): Exercise {
  const newExercise: Exercise = {
    ...exercise,
    id: Date.now().toString(),
    completed: false,
    custom: true,
  };
  exercises = [...exercises, newExercise];
  notifyListeners();
  return newExercise;
}

export function toggleCompleted(id: string): void {
  exercises = exercises.map((ex) =>
    ex.id === id ? { ...ex, completed: !ex.completed } : ex
  );
  notifyListeners();
}

export function getExerciseById(id: string): Exercise | undefined {
  return exercises.find((ex) => ex.id === id);
}

export function subscribe(listener: () => void): () => void {
  listeners.push(listener);
  return () => {
    const index = listeners.indexOf(listener);
    if (index > -1) listeners.splice(index, 1);
  };
}

function notifyListeners() {
  listeners.forEach((l) => l());
}
