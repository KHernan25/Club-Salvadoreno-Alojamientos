export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  receiverId: string;
  senderName: string;
  senderRole: "guest" | "host" | "admin";
  content: string;
  type: "text" | "image" | "document" | "system";
  timestamp: string;
  read: boolean;
  edited?: boolean;
  editedAt?: string;
  attachments?: MessageAttachment[];
  metadata?: {
    reservationId?: string;
    accommodationId?: string;
    urgency?: "low" | "medium" | "high";
    category?: "booking" | "payment" | "support" | "general";
  };
}

export interface MessageAttachment {
  id: string;
  name: string;
  type: string;
  size: number;
  url: string;
  thumbnailUrl?: string;
}

export interface Conversation {
  id: string;
  participants: {
    guestId: string;
    hostId: string;
    guestName: string;
    hostName: string;
  };
  subject: string;
  lastMessage?: Message;
  lastActivity: string;
  unreadCount: {
    guest: number;
    host: number;
  };
  status: "active" | "archived" | "closed";
  metadata?: {
    reservationId?: string;
    accommodationId?: string;
    accommodationName?: string;
  };
}

export interface MessageDraft {
  conversationId: string;
  content: string;
  lastSaved: string;
}

class MessagingService {
  private static instance: MessagingService;
  private conversations: Conversation[] = [];
  private messages: Map<string, Message[]> = new Map();
  private drafts: Map<string, MessageDraft> = new Map();

  public static getInstance(): MessagingService {
    if (!MessagingService.instance) {
      MessagingService.instance = new MessagingService();
    }
    return MessagingService.instance;
  }

  private constructor() {
    this.initializeMockData();
  }

  private initializeMockData(): void {
    // Mock conversations for demonstration
    const mockConversations: Conversation[] = [
      {
        id: "conv-1",
        participants: {
          guestId: "user-123",
          hostId: "host-456",
          guestName: "María González",
          hostName: "Carlos Méndez",
        },
        subject: "Consulta sobre Suite Premium - El Sunzal",
        lastActivity: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
        unreadCount: { guest: 0, host: 2 },
        status: "active",
        metadata: {
          reservationId: "RES-2024-001",
          accommodationId: "acc-sunzal-suite",
          accommodationName: "Suite Premium - El Sunzal",
        },
      },
      {
        id: "conv-2",
        participants: {
          guestId: "user-789",
          hostId: "host-456",
          guestName: "Ana Rodríguez",
          hostName: "Carlos Méndez",
        },
        subject: "Disponibilidad para fechas alternativas",
        lastActivity: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
        unreadCount: { guest: 1, host: 0 },
        status: "active",
        metadata: {
          accommodationId: "acc-corinto-cabin",
          accommodationName: "Cabaña Familiar - Corinto",
        },
      },
    ];

    const mockMessages: Message[] = [
      {
        id: "msg-1",
        conversationId: "conv-1",
        senderId: "user-123",
        receiverId: "host-456",
        senderName: "María González",
        senderRole: "guest",
        content:
          "Hola Carlos, tengo algunas preguntas sobre la Suite Premium. ¿Incluye desayuno y tiene vista al mar?",
        type: "text",
        timestamp: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
        read: true,
        metadata: {
          reservationId: "RES-2024-001",
          category: "booking",
          urgency: "medium",
        },
      },
      {
        id: "msg-2",
        conversationId: "conv-1",
        senderId: "host-456",
        receiverId: "user-123",
        senderName: "Carlos Méndez",
        senderRole: "host",
        content:
          "¡Hola María! Sí, la Suite Premium incluye desayuno continental y tiene una hermosa vista al océano. También cuenta con balcón privado y acceso directo a la playa.",
        type: "text",
        timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
        read: true,
        metadata: {
          reservationId: "RES-2024-001",
          category: "booking",
          urgency: "medium",
        },
      },
      {
        id: "msg-3",
        conversationId: "conv-1",
        senderId: "host-456",
        receiverId: "user-123",
        senderName: "Carlos Méndez",
        senderRole: "host",
        content:
          "Te he enviado algunas fotos adicionales de la suite y la vista. ¿Hay algo más específico que te gustaría saber?",
        type: "text",
        timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
        read: false,
        attachments: [
          {
            id: "att-1",
            name: "suite-vista-oceanica.jpg",
            type: "image/jpeg",
            size: 2048576,
            url: "/api/attachments/suite-vista-oceanica.jpg",
            thumbnailUrl: "/api/attachments/thumbs/suite-vista-oceanica.jpg",
          },
          {
            id: "att-2",
            name: "balcon-privado.jpg",
            type: "image/jpeg",
            size: 1536000,
            url: "/api/attachments/balcon-privado.jpg",
            thumbnailUrl: "/api/attachments/thumbs/balcon-privado.jpg",
          },
        ],
        metadata: {
          reservationId: "RES-2024-001",
          category: "booking",
          urgency: "low",
        },
      },
    ];

    this.conversations = mockConversations;
    this.messages.set("conv-1", mockMessages);

    // Update last message in conversations
    this.conversations.forEach((conv) => {
      const conversationMessages = this.messages.get(conv.id) || [];
      if (conversationMessages.length > 0) {
        conv.lastMessage =
          conversationMessages[conversationMessages.length - 1];
      }
    });
  }

  // Conversation management
  public async getConversations(userId: string): Promise<Conversation[]> {
    // In real implementation, filter by user participation
    return this.conversations.filter(
      (conv) =>
        conv.participants.guestId === userId ||
        conv.participants.hostId === userId,
    );
  }

  public async getConversation(
    conversationId: string,
  ): Promise<Conversation | null> {
    return (
      this.conversations.find((conv) => conv.id === conversationId) || null
    );
  }

  public async createConversation(
    guestId: string,
    hostId: string,
    subject: string,
    metadata?: Conversation["metadata"],
  ): Promise<Conversation> {
    const conversation: Conversation = {
      id: `conv-${Date.now()}`,
      participants: {
        guestId,
        hostId,
        guestName: "Usuario", // Would be fetched from user service
        hostName: "Anfitrión", // Would be fetched from user service
      },
      subject,
      lastActivity: new Date().toISOString(),
      unreadCount: { guest: 0, host: 0 },
      status: "active",
      metadata,
    };

    this.conversations.unshift(conversation);
    this.messages.set(conversation.id, []);

    // In real implementation, save to database
    console.log("✅ Conversation created:", conversation.id);
    return conversation;
  }

  // Message management
  public async getMessages(conversationId: string): Promise<Message[]> {
    return this.messages.get(conversationId) || [];
  }

  public async sendMessage(
    conversationId: string,
    senderId: string,
    content: string,
    type: Message["type"] = "text",
    attachments?: MessageAttachment[],
    metadata?: Message["metadata"],
  ): Promise<Message> {
    const conversation = await this.getConversation(conversationId);
    if (!conversation) {
      throw new Error("Conversation not found");
    }

    const receiverId =
      conversation.participants.guestId === senderId
        ? conversation.participants.hostId
        : conversation.participants.guestId;

    const senderRole: Message["senderRole"] =
      conversation.participants.guestId === senderId ? "guest" : "host";

    const senderName =
      conversation.participants.guestId === senderId
        ? conversation.participants.guestName
        : conversation.participants.hostName;

    const message: Message = {
      id: `msg-${Date.now()}`,
      conversationId,
      senderId,
      receiverId,
      senderName,
      senderRole,
      content,
      type,
      timestamp: new Date().toISOString(),
      read: false,
      attachments,
      metadata,
    };

    const messages = this.messages.get(conversationId) || [];
    messages.push(message);
    this.messages.set(conversationId, messages);

    // Update conversation
    conversation.lastMessage = message;
    conversation.lastActivity = message.timestamp;

    // Update unread count
    if (senderRole === "guest") {
      conversation.unreadCount.host++;
    } else {
      conversation.unreadCount.guest++;
    }

    // Clear draft if exists
    this.drafts.delete(conversationId);

    // In real implementation:
    // 1. Save to database
    // 2. Send push notification to receiver
    // 3. Send email notification if user is offline

    console.log("✅ Message sent:", message.id);
    return message;
  }

  public async markMessageAsRead(
    messageId: string,
    userId: string,
  ): Promise<boolean> {
    for (const [conversationId, messages] of this.messages.entries()) {
      const message = messages.find((m) => m.id === messageId);
      if (message && message.receiverId === userId) {
        message.read = true;

        // Update conversation unread count
        const conversation = await this.getConversation(conversationId);
        if (conversation) {
          if (message.senderRole === "guest") {
            conversation.unreadCount.host = Math.max(
              0,
              conversation.unreadCount.host - 1,
            );
          } else {
            conversation.unreadCount.guest = Math.max(
              0,
              conversation.unreadCount.guest - 1,
            );
          }
        }

        console.log("✅ Message marked as read:", messageId);
        return true;
      }
    }
    return false;
  }

  public async markConversationAsRead(
    conversationId: string,
    userId: string,
  ): Promise<boolean> {
    const messages = this.messages.get(conversationId) || [];
    let markedCount = 0;

    messages.forEach((message) => {
      if (message.receiverId === userId && !message.read) {
        message.read = true;
        markedCount++;
      }
    });

    // Reset unread count for this user
    const conversation = await this.getConversation(conversationId);
    if (conversation) {
      if (conversation.participants.guestId === userId) {
        conversation.unreadCount.guest = 0;
      } else {
        conversation.unreadCount.host = 0;
      }
    }

    console.log(
      `✅ ${markedCount} messages marked as read in conversation ${conversationId}`,
    );
    return markedCount > 0;
  }

  // Draft management
  public saveDraft(conversationId: string, content: string): void {
    this.drafts.set(conversationId, {
      conversationId,
      content,
      lastSaved: new Date().toISOString(),
    });
  }

  public getDraft(conversationId: string): MessageDraft | null {
    return this.drafts.get(conversationId) || null;
  }

  public clearDraft(conversationId: string): void {
    this.drafts.delete(conversationId);
  }

  // Search functionality
  public async searchMessages(
    userId: string,
    query: string,
    filters?: {
      conversationId?: string;
      dateFrom?: string;
      dateTo?: string;
      type?: Message["type"];
      category?: string;
    },
  ): Promise<Message[]> {
    const userConversations = await this.getConversations(userId);
    const userConversationIds = userConversations.map((conv) => conv.id);

    const allMessages: Message[] = [];
    for (const conversationId of userConversationIds) {
      const messages = this.messages.get(conversationId) || [];
      allMessages.push(...messages);
    }

    return allMessages.filter((message) => {
      // Text search
      const matchesQuery = message.content
        .toLowerCase()
        .includes(query.toLowerCase());

      // Apply filters
      if (
        filters?.conversationId &&
        message.conversationId !== filters.conversationId
      ) {
        return false;
      }

      if (filters?.type && message.type !== filters.type) {
        return false;
      }

      if (
        filters?.category &&
        message.metadata?.category !== filters.category
      ) {
        return false;
      }

      if (filters?.dateFrom && message.timestamp < filters.dateFrom) {
        return false;
      }

      if (filters?.dateTo && message.timestamp > filters.dateTo) {
        return false;
      }

      return matchesQuery;
    });
  }

  // Statistics
  public async getMessagingStats(userId: string): Promise<{
    totalConversations: number;
    activeConversations: number;
    unreadMessages: number;
    totalMessages: number;
  }> {
    const conversations = await this.getConversations(userId);
    const activeConversations = conversations.filter(
      (conv) => conv.status === "active",
    );

    let unreadMessages = 0;
    let totalMessages = 0;

    conversations.forEach((conv) => {
      if (conv.participants.guestId === userId) {
        unreadMessages += conv.unreadCount.guest;
      } else {
        unreadMessages += conv.unreadCount.host;
      }

      const messages = this.messages.get(conv.id) || [];
      totalMessages += messages.length;
    });

    return {
      totalConversations: conversations.length,
      activeConversations: activeConversations.length,
      unreadMessages,
      totalMessages,
    };
  }

  // Archive/Close conversation
  public async archiveConversation(conversationId: string): Promise<boolean> {
    const conversation = await this.getConversation(conversationId);
    if (conversation) {
      conversation.status = "archived";
      console.log("✅ Conversation archived:", conversationId);
      return true;
    }
    return false;
  }

  public async reopenConversation(conversationId: string): Promise<boolean> {
    const conversation = await this.getConversation(conversationId);
    if (conversation) {
      conversation.status = "active";
      conversation.lastActivity = new Date().toISOString();
      console.log("✅ Conversation reopened:", conversationId);
      return true;
    }
    return false;
  }
}

// Export singleton instance
export const messagingService = MessagingService.getInstance();
