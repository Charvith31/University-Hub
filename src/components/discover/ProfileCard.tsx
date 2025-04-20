import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface ProfileCardProps {
  profile: {
    id: string;
    full_name: string;
    avatar_url: string | null;
    profile_data: {
      branch?: string;
      year?: string;
      skills?: string[];
    } | null;
  };
  onConnect: (profileId: string) => void;
  isConnectionSent?: boolean;
}

export const ProfileCard = ({ profile, onConnect, isConnectionSent = false }: ProfileCardProps) => {
  const navigate = useNavigate();
  const [requestSent, setRequestSent] = useState(isConnectionSent);
  
  // Get actual name from either full_name or profile_data.personalInfo.name
  const displayName = profile.full_name || (profile.profile_data as any)?.personalInfo?.name || "Unknown User";
  
  // Create a fallback for the avatar
  const nameFallback = displayName?.[0] || "U";
  
  // Extract skills (handling both string[] and object[] formats)
  const skills = profile.profile_data?.skills || [];
  
  const handleConnect = () => {
    onConnect(profile.id);
    setRequestSent(true);
  };
  
  const handleViewProfile = () => {
    navigate(`/profile/${profile.id}`);
  };
  
  return (
    <Card className="p-4 flex flex-col items-center">
      <Avatar className="w-20 h-20 mb-4">
        <AvatarImage src={profile.avatar_url || "/placeholder.svg"} />
        <AvatarFallback>{nameFallback}</AvatarFallback>
      </Avatar>
      
      <h3 className="font-semibold text-lg mb-2">{displayName}</h3>
      
      <div className="text-sm text-gray-600 mb-4 text-center">
        {profile.profile_data?.branch && `Branch: ${profile.profile_data.branch}`}
        {profile.profile_data?.year && ` | Year: ${profile.profile_data.year}`}
      </div>
      
      {skills.length > 0 && (
        <div className="mb-4 text-center">
          <p className="text-sm font-medium mb-1">Skills:</p>
          <div className="flex flex-wrap justify-center gap-1">
            {skills.map((skill, index) => {
              const skillName = typeof skill === 'string' ? skill : (skill as any)?.name || '';
              return skillName ? (
                <span key={index} className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                  {skillName}
                </span>
              ) : null;
            })}
          </div>
        </div>
      )}
      
      <div className="flex space-x-2">
        <Button size="sm" variant="outline" onClick={handleViewProfile}>View Profile</Button>
        <Button 
          size="sm" 
          onClick={handleConnect}
          disabled={requestSent || isConnectionSent}
        >
          {requestSent || isConnectionSent ? 'Request Sent' : 'Connect'}
        </Button>
      </div>
    </Card>
  );
};
