import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "@/components/ui/sonner";

interface MessagesListProps {
  currentUserId?: string;
  onSelectConnection: (connectionId: string) => void;
  selectedConnectionId: string | null;
}

export function MessagesList({ currentUserId, onSelectConnection, selectedConnectionId }: MessagesListProps) {
  const [connections, setConnections] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (currentUserId) {
      fetchConnections();
    }
  }, [currentUserId]);

  const fetchConnections = async () => {
    try {
      // First, get connections where the current user is either sender or receiver
      // and the connection status is 'accepted'
      const { data: connectionsData, error: connectionsError } = await supabase
        .from('connections')
        .select('*')
        .eq('status', 'accepted')
        .or(`sender_id.eq.${currentUserId},receiver_id.eq.${currentUserId}`);

      if (connectionsError) throw connectionsError;
      
      if (!connectionsData || connectionsData.length === 0) {
        setConnections([]);
        setLoading(false);
        return;
      }
      
      // Fetch profiles for each connection
      const enhancedConnections = await Promise.all(connectionsData.map(async (connection) => {
        const otherUserId = connection.sender_id === currentUserId 
          ? connection.receiver_id 
          : connection.sender_id;
          
        // Get other user's profile
        const { data: otherUserData, error: profileError } = await supabase
          .from('profiles')
          .select('id, full_name, avatar_url')
          .eq('id', otherUserId)
          .single();
          
        if (profileError) {
          console.error('Error fetching profile:', profileError);
          return {
            ...connection,
            otherUser: { id: otherUserId, full_name: 'Unknown User', avatar_url: null }
          };
        }
        
        return {
          ...connection,
          otherUser: otherUserData
        };
      }));

      setConnections(enhancedConnections || []);
    } catch (error) {
      console.error('Error fetching connections:', error);
      toast.error('Failed to load connections');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-4">
        <div className="animate-pulse flex space-x-4">
          <div className="rounded-full bg-gray-300 h-10 w-10"></div>
          <div className="flex-1 space-y-2 py-1">
            <div className="h-4 bg-gray-300 rounded w-3/4"></div>
            <div className="h-4 bg-gray-300 rounded w-1/2"></div>
          </div>
        </div>
      </div>
    );
  }

  if (connections.length === 0) {
    return (
      <Card className="p-4 text-center">
        <p className="text-gray-500">No connections yet</p>
        <p className="text-sm text-gray-400 mt-1">
          Connect with others to start chatting
        </p>
      </Card>
    );
  }

  return (
    <div className="space-y-2">
      {connections.map((connection) => (
        <Card 
          key={connection.id}
          className={`p-4 cursor-pointer transition-colors ${
            selectedConnectionId === connection.id ? 'bg-accent' : 'hover:bg-accent/50'
          }`}
          onClick={() => onSelectConnection(connection.id)}
        >
          <div className="flex items-center space-x-3">
            <Avatar>
              <AvatarImage src={connection.otherUser?.avatar_url || "/placeholder.svg"} />
              <AvatarFallback>{connection.otherUser?.full_name?.[0] || "U"}</AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-semibold">{connection.otherUser?.full_name || "Anonymous User"}</h3>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
