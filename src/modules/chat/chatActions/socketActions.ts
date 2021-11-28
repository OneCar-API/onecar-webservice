import "reflect-metadata";
import { io } from "./http";
import ICreateMessageDTO from '@modules/chat/dtos/ICreateMessageDTO';
import CreateMessageService from '@modules/chat/services/CreateMessageService';
import GetMessagesByChatService from '@modules/chat/services/GetMessagesByChatService';
import { container } from 'tsyringe';

interface RoomUser {
  socket_id: string;
  sender_id: string;
  recepient_id: string;
  chat_id: string;
}

const createMessageService = container.resolve(CreateMessageService);
const getMessagesByChatService = container.resolve(GetMessagesByChatService);

const users: RoomUser[] = [];

io.on("connection", (socket) => {
  socket.on("select_room", (data, callback) => {
    socket.join(data.chat_id);

    const userInRoom = users.find((user) => user.chat_id === data.chat_id);

    if (userInRoom) {
      userInRoom.socket_id = socket.id;
    } else {
      users.push({
        socket_id: data.socket_id,
        sender_id: data.sender_id,
        recepient_id: data.recipient_id,
        chat_id: data.chat_id
      });
    }

    const messagesRoom = getMessagesRoom(data.chat_id);
    callback(messagesRoom);
  });

  socket.on("message", (data) => {
    const message: ICreateMessageDTO = {
      chat_id: data.chat_id,
      recipient_id: data.recipient_id,
      sender_id: data.sender_id,
      text: data.text,
    };

    createMessageService.execute(message);

    io.to(data.chat_id).emit("message", message);
  });
});

function getMessagesRoom(chat_id: string) {
  const messagesRoom = getMessagesByChatService.execute(chat_id);
  return messagesRoom;
}
