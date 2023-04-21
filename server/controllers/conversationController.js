import {
  getAllRelatedConversations,
  getAllMessages,
} from "../helpers/conversationHelpers.js"
import conversationModel from "../model/Conversations.js"
import messageModel from "../model/Messages.js"

export const getAllConversations = async (req, res) => {
  const { id } = req.user
  try {
    const conversations = await getAllRelatedConversations(id)
    res.json(conversations)
  } catch (error) {
    console.log(error)
    res
      .status(500)
      .json({ message: "Something went wrong, please try again later" })
  }
}

export const createNewConversation = async (req, res) => {
  try {
    const { id } = req.user
    let { members } = req.body
    members.push(id)
    let conversation
    if (req.body.isGroupChat) {
      conversation = new conversationModel({
        chatName: req.body.chatName,
        isGroupChat: true,
        groupAdmin: id,
        users: members,
      })
    } else {
      let existing = await conversationModel.find({
        users: { $all: members },
        isGroupChat: false,
      })
      console.log(existing)
      if (existing.length) {
        return res.status(409).json({
          message: "Conversation already exists",
          conversation: existing[0],
        })
      }
      conversation = new conversationModel({
        users: members,
      })
    }
    await conversation.save()
    return res.status(201).json(conversation)
  } catch (error) {
    console.log(error)
    res
      .status(500)
      .json({ message: "Something went wrong, please try again later" })
  }
}

export const getMessages = async (req, res) => {
  try {
    const { id } = req.user
    const { conversationId } = req.params
    const messages = await getAllMessages(conversationId, id)
    res.json(messages)
  } catch (error) {
    console.log(error)
    res
      .status(500)
      .json({ message: "Something went wrong, please try again later" })
  }
}

export const sendMessage = async (req, res) => {
  try {
    const { id } = req.user
    const { content } = req.body
    const { conversationId } = req.params
    const message = new messageModel({
      sender: id,
      content,
      conversation: conversationId,
    })
    await message.save()
    res.status(201).json({ success: true })
  } catch (error) {
    res
      .status(500)
      .json({ message: "Something went wrong, please try again later" })
  }
}
