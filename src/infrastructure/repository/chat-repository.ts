import ChatMessageModel from "../database/chat-model"
import AppointmentModel from "../database/Appointment-model";

class ChatRepository {

    async findProvidersByUserId(userId: string) {
        try {
            
            // Fetch appointments for the user
            const appointments = await AppointmentModel.find({ user: userId })
                .populate('serviceProvider'); // Populate the serviceProvider field to get provider details
    
            // Extract unique providers from the appointments
            const providers = appointments.map(appointment => appointment.serviceProvider);
            
            // Remove duplicates (optional)
            const uniqueProviders = [...new Map(providers.map(provider => [provider._id, provider])).values()];
    
            return uniqueProviders;
        } catch (error) {
            throw error; 
        }
    }
    

    async findUsersByProviderId(providerId: string) {
        try {
            // Fetch appointments for the provider
            const appointments = await AppointmentModel.find({ serviceProvider: providerId })
                .populate('user'); // Populate the user field to get user details
    
            // Extract unique users from the appointments
            const users = appointments.map(appointment => appointment.user);
            
            // Remove duplicates (optional)
            const uniqueUsers = [...new Map(users.map(user => [user._id, user])).values()];
    
            return uniqueUsers;
        } catch (error) {
            throw error; 
        }
    }




     // To save a new message
     async saveMessage(senderId: string, receiverId: string, message: string) {
        try {
            const newMessage = new ChatMessageModel({ senderId, receiverId, message });
            await newMessage.save();
            return newMessage;
        } catch (error) {
            throw error;
        }
    }

    // To get all messages between two users
    async getMessages(senderId: string, receiverId: string) {
        try {
            return await ChatMessageModel.find({
                $or: [
                    { senderId, receiverId },
                    { senderId: receiverId, receiverId: senderId }
                ]
            }).sort({ timestamp: 1 }); // Sort messages by timestamp (oldest first)
        } catch (error) {
            throw error;
        }
    }
  
  
  
}

export default ChatRepository;
