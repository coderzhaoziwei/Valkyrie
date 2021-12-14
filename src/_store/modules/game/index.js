import login from "./login"
import tag from "./tag"
import score from "./score"
import pack from "./pack"
import skill from "./skill"
import task from "./task"

import room from "./room"
import items from "./items"

import chat from "./chat"
import text from "./text"


export default {
  namespaced: true,
  modules: { login, tag, score, pack, skill, task, chat, text, room, items },
}
