import Room from "@/components/game/join/Room";
import Answers from "@/components/game/states/Answers";
import Leaderboard from "@/components/game/states/Leaderboard";
import Podium from "@/components/game/states/Podium";
import Prepared from "@/components/game/states/Prepared";
import Question from "@/components/game/states/Question";
import Result from "@/components/game/states/Result";
import Start from "@/components/game/states/Start";
import Wait from "@/components/game/states/Wait";
import Circle from "@/components/icons/Circle";
import Rhombus from "@/components/icons/Rhombus";
import Square from "@/components/icons/Square";
import Triangle from "@/components/icons/Triangle";
import * as dotenv from "dotenv"
dotenv.config()

export const WEBSOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL ;

export const ANSWERS_COLORS = [
  "bg-red-500",
  "bg-blue-500",
  "bg-yellow-500",
  "bg-green-500",
];

export const ANSWERS_ICONS = [Triangle, Rhombus, Circle, Square];

export const GAME_STATES = {
  status: {
    name: "WAIT",
    data: { text: "En attente des joueurs" },
  },
  question: {
    current: 1,
    total: null,
  },
  created: false,
};

export const GAME_STATE_COMPONENTS = {
  SELECT_ANSWER: Answers,
  SHOW_QUESTION: Question,
  WAIT: Wait,
  SHOW_START: Start,
  SHOW_RESULT: Result,
  SHOW_PREPARED: Prepared,
};

export const GAME_STATE_COMPONENTS_MANAGER : any = {
  ...GAME_STATE_COMPONENTS,
  SHOW_ROOM: Room,
  SHOW_RESPONSES: Answers,
  SHOW_LEADERBOARD: Leaderboard,
  FINISH: Podium,
};

export const SFX_ANSWERS_MUSIC = "/sounds/answersMusic.mp3";
export const SFX_ANSWERS_SOUND = "/sounds/answersSound.mp3";
export const SFX_RESULTS_SOUND = "/sounds/results.mp3";
export const SFX_SHOW_SOUND = "/sounds/show.mp3";
export const SFX_BOUMP_SOUND = "/sounds/boump.mp3";
export const SFX_PODIUM_THREE = "/sounds/three.mp3";
export const SFX_PODIUM_SECOND = "/sounds/second.mp3";
export const SFX_PODIUM_FIRST = "/sounds/first.mp3";
export const SFX_SNEAR_ROOL = "/sounds/snearRoll.mp3";
