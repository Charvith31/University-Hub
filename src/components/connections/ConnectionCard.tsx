import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useNavigate } from "react-router-dom";

interface ConnectionCardProps {
  connection: any;
  currentUserId: string | undefined;
  onAccept?: () => void;
  onReject?: () => void;
}

export function ConnectionCard({ connection, currentUserId, onAccept, onReject }: ConnectionCardProps) {
  const navigate = useNavigate();
  const isReceiver = connection.receiver_id === currentUserId;
  const otherUser = isReceiver ? connection.sender : connection.receiver;
  const otherUserId = isReceiver ? connection.sender_id : connection.receiver_id;
  const isPending = connection.status === 'pending';

  const handleViewProfile = () => {
    navigate(`/profile/${otherUserId}`);
  };

  return (
    <Card className="p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Avatar>
            <AvatarImage src={otherUser?.avatar_url || "/placeholder.svg"} />
            <AvatarFallback>{otherUser?.full_name?.[0] || "U"}</AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-semibold">{otherUser?.full_name || "Anonymous User"}</h3>
            <p className="text-sm text-gray-500">
              {isPending 
                ? isReceiver 
                  ? "Wants to connect with you" 
                  : "Pending acceptance"
                : "Connected"
              }
            </p>
          </div>
        </div>
        
        <div className="flex gap-2">
          {isPending && isReceiver && (
            <>
              <Button variant="outline" size="sm" onClick={onReject}>
                Reject
              </Button>
              <Button size="sm" onClick={onAccept}>
                Accept
              </Button>
            </>
          )}
          
          <Button variant="outline" size="sm" onClick={handleViewProfile}>
            View Profile
          </Button>
        </div>
      </div>
    </Card>
  );
}
