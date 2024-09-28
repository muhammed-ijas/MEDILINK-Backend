import ChatRepository from "../infrastructure/repository/chatRepository";

class ChatUseCase {
  private ChatRepository: ChatRepository;
  

  constructor(
    ChatRepository: ChatRepository,
    
  ) {
    this.ChatRepository = ChatRepository;
    
  }

  async getProvidersList(userId: string) {
    try {
      const providers = await this.ChatRepository.findProvidersByUserId(userId);
      return providers; 
    } catch (error) {
      throw error;
    }
  }

   // Send a new message
   async sendMessage(senderId: string, receiverId: string, message: string) {
    try {
        return await this.ChatRepository.saveMessage(senderId, receiverId, message);
    } catch (error) {
        throw error;
    }
}

// Get messages between two users
async getMessages(senderId: string, receiverId: string) {
    try {
        return await this.ChatRepository.getMessages(senderId, receiverId);
    } catch (error) {
        throw error;
    }
}





















async SPgetUsersList(providerId: string) {
  try {
    const providers = await this.ChatRepository.findUsersByProviderId(providerId);
    return providers; 
  } catch (error) {
    throw error;
  }
}

 // Send a new message
 async SPsendMessage(senderId: string, receiverId: string, message: string) {
  try {
      return await this.ChatRepository.saveMessage(senderId, receiverId, message);
  } catch (error) {
      throw error;
  }
}

// Get messages between two users
async SPgetMessages(senderId: string, receiverId: string) {
  try {
      return await this.ChatRepository.getMessages(senderId, receiverId);
  } catch (error) {
      throw error;
  }
}

  


}

export default ChatUseCase;
