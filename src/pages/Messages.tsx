import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "@/hooks/use-toast";
import {
  MessageSquare,
  Send,
  Search,
  MoreVertical,
  Archive,
  Star,
  Paperclip,
  Image,
  Download,
  Eye,
  Clock,
  CheckCheck,
  Plus,
  Filter,
} from "lucide-react";
import Layout from "@/components/Layout";
import {
  messagingService,
  type Conversation,
  type Message,
} from "@/lib/messaging-service";
import { pushNotificationService } from "@/lib/push-notification-service";
import { cn } from "@/lib/utils";

const Messages = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] =
    useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [isNewConversationOpen, setIsNewConversationOpen] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const currentUserId = "user-123"; // Would come from auth context

  useEffect(() => {
    loadConversations();
  }, []);

  useEffect(() => {
    if (selectedConversation) {
      loadMessages(selectedConversation.id);
      // Mark conversation as read
      messagingService.markConversationAsRead(
        selectedConversation.id,
        currentUserId,
      );
    }
  }, [selectedConversation]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const loadConversations = async () => {
    try {
      setIsLoading(true);
      const convs = await messagingService.getConversations(currentUserId);
      setConversations(convs);

      // Auto-select first conversation if none selected
      if (convs.length > 0 && !selectedConversation) {
        setSelectedConversation(convs[0]);
      }
    } catch (error) {
      console.error("Error loading conversations:", error);
      toast({
        title: "Error",
        description: "No se pudieron cargar las conversaciones",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const loadMessages = async (conversationId: string) => {
    try {
      const msgs = await messagingService.getMessages(conversationId);
      setMessages(msgs);
    } catch (error) {
      console.error("Error loading messages:", error);
      toast({
        title: "Error",
        description: "No se pudieron cargar los mensajes",
        variant: "destructive",
      });
    }
  };

  const sendMessage = async () => {
    if (!selectedConversation || !newMessage.trim() || isSending) return;

    try {
      setIsSending(true);
      const message = await messagingService.sendMessage(
        selectedConversation.id,
        currentUserId,
        newMessage.trim(),
        "text",
        undefined,
        {
          category: "general",
          urgency: "medium",
        },
      );

      // Update local state
      setMessages((prev) => [...prev, message]);
      setNewMessage("");

      // Update conversation list
      const updatedConversations = conversations.map((conv) =>
        conv.id === selectedConversation.id
          ? { ...conv, lastMessage: message, lastActivity: message.timestamp }
          : conv,
      );
      setConversations(updatedConversations);
      setSelectedConversation((prev) =>
        prev ? { ...prev, lastMessage: message } : null,
      );

      // Send push notification to receiver
      const receiverName =
        selectedConversation.participants.guestId === currentUserId
          ? selectedConversation.participants.hostName
          : selectedConversation.participants.guestName;

      const receiverId =
        selectedConversation.participants.guestId === currentUserId
          ? selectedConversation.participants.hostId
          : selectedConversation.participants.guestId;

      await pushNotificationService.notifyNewMessage(
        receiverId,
        message.id,
        message.senderName,
        message.content,
      );

      toast({
        title: "Mensaje enviado",
        description: "Tu mensaje ha sido enviado exitosamente",
      });
    } catch (error) {
      console.error("Error sending message:", error);
      toast({
        title: "Error",
        description: "No se pudo enviar el mensaje",
        variant: "destructive",
      });
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInMinutes = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60),
    );

    if (diffInMinutes < 1) return "Ahora";
    if (diffInMinutes < 60) return `${diffInMinutes}min`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h`;
    return date.toLocaleDateString("es-ES", { month: "short", day: "numeric" });
  };

  const filteredConversations = conversations.filter(
    (conv) =>
      conv.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      conv.participants.guestName
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      conv.participants.hostName
        .toLowerCase()
        .includes(searchTerm.toLowerCase()),
  );

  const getUnreadCount = (conversation: Conversation) => {
    return conversation.participants.guestId === currentUserId
      ? conversation.unreadCount.guest
      : conversation.unreadCount.host;
  };

  const archiveConversation = async (conversationId: string) => {
    try {
      await messagingService.archiveConversation(conversationId);
      setConversations((prev) =>
        prev.map((conv) =>
          conv.id === conversationId ? { ...conv, status: "archived" } : conv,
        ),
      );
      toast({
        title: "Conversación archivada",
        description: "La conversación ha sido archivada exitosamente",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo archivar la conversación",
        variant: "destructive",
      });
    }
  };

  return (
    <Layout>
      <div className="container mx-auto p-6 h-[calc(100vh-120px)]">
        <div className="flex h-full gap-6">
          {/* Conversations List */}
          <Card className="w-1/3 flex flex-col">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  Mensajes
                </CardTitle>
                <Dialog
                  open={isNewConversationOpen}
                  onOpenChange={setIsNewConversationOpen}
                >
                  <DialogTrigger asChild>
                    <Button size="sm" variant="outline">
                      <Plus className="h-4 w-4 mr-1" />
                      Nuevo
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Nueva Conversación</DialogTitle>
                      <DialogDescription>
                        Inicia una nueva conversación con un anfitrión
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <Input placeholder="Buscar anfitrión..." />
                      <Input placeholder="Asunto del mensaje" />
                      <Textarea
                        placeholder="Escribe tu mensaje inicial..."
                        rows={4}
                      />
                    </div>
                    <DialogFooter>
                      <Button
                        variant="outline"
                        onClick={() => setIsNewConversationOpen(false)}
                      >
                        Cancelar
                      </Button>
                      <Button>Iniciar Conversación</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar conversaciones..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </CardHeader>
            <CardContent className="flex-1 p-0">
              <ScrollArea className="h-full">
                {isLoading ? (
                  <div className="p-4 text-center text-muted-foreground">
                    Cargando conversaciones...
                  </div>
                ) : filteredConversations.length === 0 ? (
                  <div className="p-4 text-center text-muted-foreground">
                    {searchTerm
                      ? "No se encontraron conversaciones"
                      : "No hay conversaciones"}
                  </div>
                ) : (
                  filteredConversations.map((conversation) => {
                    const unreadCount = getUnreadCount(conversation);
                    const isActive =
                      selectedConversation?.id === conversation.id;
                    const otherParticipant =
                      conversation.participants.guestId === currentUserId
                        ? conversation.participants.hostName
                        : conversation.participants.guestName;

                    return (
                      <div
                        key={conversation.id}
                        className={cn(
                          "p-4 border-b cursor-pointer hover:bg-accent transition-colors",
                          isActive && "bg-accent",
                        )}
                        onClick={() => setSelectedConversation(conversation)}
                      >
                        <div className="flex items-start gap-3">
                          <Avatar className="h-10 w-10">
                            <AvatarImage
                              src={`/avatars/${otherParticipant.toLowerCase().replace(/\s+/g, "-")}.jpg`}
                            />
                            <AvatarFallback>
                              {otherParticipant
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <p className="font-medium text-sm truncate">
                                {otherParticipant}
                              </p>
                              <div className="flex items-center gap-1">
                                {unreadCount > 0 && (
                                  <Badge
                                    variant="destructive"
                                    className="h-5 w-5 p-0 text-xs flex items-center justify-center"
                                  >
                                    {unreadCount}
                                  </Badge>
                                )}
                                <span className="text-xs text-muted-foreground">
                                  {formatTime(conversation.lastActivity)}
                                </span>
                              </div>
                            </div>
                            <p className="text-sm font-medium text-muted-foreground mb-1 truncate">
                              {conversation.subject}
                            </p>
                            {conversation.lastMessage && (
                              <p className="text-sm text-muted-foreground truncate">
                                {conversation.lastMessage.senderRole ===
                                  "guest" &&
                                conversation.participants.guestId ===
                                  currentUserId
                                  ? "Tú: "
                                  : conversation.lastMessage.senderRole ===
                                        "host" &&
                                      conversation.participants.hostId ===
                                        currentUserId
                                    ? "Tú: "
                                    : ""}
                                {conversation.lastMessage.content}
                              </p>
                            )}
                            {conversation.metadata?.accommodationName && (
                              <Badge variant="outline" className="text-xs mt-1">
                                {conversation.metadata.accommodationName}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </ScrollArea>
            </CardContent>
          </Card>

          {/* Messages Area */}
          <Card className="flex-1 flex flex-col">
            {selectedConversation ? (
              <>
                {/* Conversation Header */}
                <CardHeader className="pb-3 border-b">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage
                          src={`/avatars/${(selectedConversation.participants
                            .guestId === currentUserId
                            ? selectedConversation.participants.hostName
                            : selectedConversation.participants.guestName
                          )
                            .toLowerCase()
                            .replace(/\s+/g, "-")}.jpg`}
                        />
                        <AvatarFallback>
                          {(selectedConversation.participants.guestId ===
                          currentUserId
                            ? selectedConversation.participants.hostName
                            : selectedConversation.participants.guestName
                          )
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-medium">
                          {selectedConversation.participants.guestId ===
                          currentUserId
                            ? selectedConversation.participants.hostName
                            : selectedConversation.participants.guestName}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {selectedConversation.subject}
                        </p>
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Star className="h-4 w-4 mr-2" />
                          Marcar importante
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() =>
                            archiveConversation(selectedConversation.id)
                          }
                        >
                          <Archive className="h-4 w-4 mr-2" />
                          Archivar conversación
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardHeader>

                {/* Messages */}
                <CardContent className="flex-1 p-0 overflow-hidden">
                  <ScrollArea className="h-full p-4">
                    <div className="space-y-4">
                      {messages.map((message) => {
                        const isOwn = message.senderId === currentUserId;
                        return (
                          <div
                            key={message.id}
                            className={cn(
                              "flex",
                              isOwn ? "justify-end" : "justify-start",
                            )}
                          >
                            <div
                              className={cn(
                                "max-w-[70%] rounded-lg p-3",
                                isOwn
                                  ? "bg-primary text-primary-foreground"
                                  : "bg-muted",
                              )}
                            >
                              <div className="space-y-2">
                                <p className="text-sm">{message.content}</p>

                                {/* Attachments */}
                                {message.attachments &&
                                  message.attachments.length > 0 && (
                                    <div className="space-y-2">
                                      {message.attachments.map((attachment) => (
                                        <div
                                          key={attachment.id}
                                          className={cn(
                                            "flex items-center gap-2 p-2 rounded border",
                                            isOwn
                                              ? "bg-primary-foreground/10"
                                              : "bg-background",
                                          )}
                                        >
                                          {attachment.type.startsWith(
                                            "image/",
                                          ) ? (
                                            <Image className="h-4 w-4" />
                                          ) : (
                                            <Paperclip className="h-4 w-4" />
                                          )}
                                          <span className="text-xs font-medium flex-1">
                                            {attachment.name}
                                          </span>
                                          <Button
                                            size="sm"
                                            variant="ghost"
                                            className="h-6 w-6 p-0"
                                          >
                                            {attachment.type.startsWith(
                                              "image/",
                                            ) ? (
                                              <Eye className="h-3 w-3" />
                                            ) : (
                                              <Download className="h-3 w-3" />
                                            )}
                                          </Button>
                                        </div>
                                      ))}
                                    </div>
                                  )}

                                <div className="flex items-center gap-1 text-xs opacity-70">
                                  <Clock className="h-3 w-3" />
                                  <span>{formatTime(message.timestamp)}</span>
                                  {isOwn && message.read && (
                                    <CheckCheck className="h-3 w-3 ml-1" />
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                      <div ref={messagesEndRef} />
                    </div>
                  </ScrollArea>
                </CardContent>

                {/* Message Input */}
                <div className="p-4 border-t">
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Paperclip className="h-4 w-4" />
                    </Button>
                    <div className="flex-1 relative">
                      <Textarea
                        placeholder="Escribe tu mensaje..."
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyPress={handleKeyPress}
                        className="min-h-[40px] max-h-[120px] resize-none pr-12"
                        rows={1}
                      />
                      <Button
                        size="sm"
                        onClick={sendMessage}
                        disabled={!newMessage.trim() || isSending}
                        className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 p-0"
                      >
                        <Send className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center space-y-3">
                  <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground" />
                  <div>
                    <h3 className="font-medium">Selecciona una conversación</h3>
                    <p className="text-sm text-muted-foreground">
                      Elige una conversación de la lista para comenzar a chatear
                    </p>
                  </div>
                </div>
              </div>
            )}
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Messages;
