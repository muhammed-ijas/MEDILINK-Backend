  import mongoose, { Schema, Document } from 'mongoose';

  interface IChatMessage extends Document {
      senderId: string;
      receiverId: string;
      message: string;
      timestamp: Date;
  }

  const ChatMessageSchema: Schema = new Schema({
      senderId: { type: String, required: true },     // ID of the user who sent the message
      receiverId: { type: String, required: true },   // ID of the user who received the message
      message: { type: String, required: true },      // Message content
      timestamp: { type: Date, default: Date.now },   // Message sent timestamp
  });

  export default mongoose.model<IChatMessage>('ChatMessage', ChatMessageSchema);
