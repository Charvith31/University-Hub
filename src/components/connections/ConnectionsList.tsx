import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { Users } from "lucide-react";
import { toast } from "@/components/ui/sonner";
import { ConnectionCard } from "./ConnectionCard";

interface ConnectionsListProps {
  connections: any[];
  currentUserId: string | undefined;
  onUpdate: () => void;
  loading: boolean;
}

export function ConnectionsList({ connections, currentUserId, onUpdate, loading }: ConnectionsListProps) {
  const handleResponse = async (connectionId: string, accept: boolean) => {
    try {
      const { error } = await supabase
        .from('connections')
        .update({ status: accept ? 'accepted' : 'rejected' })
        .eq('id', connectionId);

      if (error) throw error;
      toast.success(accept ? 'Connection accepted!' : 'Connection rejected');
      onUpdate();
    } catch (error) {
      console.error('Error updating connection:', error);
      toast.error('Failed to update connection');
    }
  };

  if (loading) {
    return <div>Loading connections...</div>;
  }

  if (connections.length === 0) {
    return (
      <Card className="p-8 text-center">
        <Users className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-semibold">No connections yet</h3>
        <p className="mt-1 text-sm text-gray-500">
          Start connecting with other users to grow your network.
        </p>
      </Card>
    );
  }

  const pendingConnections = connections.filter(c => c.status === 'pending');
  const acceptedConnections = connections.filter(c => c.status === 'accepted');

  return (
    <div className="space-y-6">
      {pendingConnections.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold mb-4">Pending Requests</h2>
          <div className="grid gap-4">
            {pendingConnections.map((connection) => (
              <ConnectionCard
                key={connection.id}
                connection={connection}
                currentUserId={currentUserId}
                onAccept={() => handleResponse(connection.id, true)}
                onReject={() => handleResponse(connection.id, false)}
              />
            ))}
          </div>
        </div>
      )}

      {acceptedConnections.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold mb-4">Connected</h2>
          <div className="grid gap-4">
            {acceptedConnections.map((connection) => (
              <ConnectionCard
                key={connection.id}
                connection={connection}
                currentUserId={currentUserId}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
