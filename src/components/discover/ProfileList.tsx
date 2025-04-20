import React from 'react';
import { ProfileCard } from './ProfileCard';

interface ProfileListProps {
  profiles: Array<{
    id: string;
    full_name: string;
    avatar_url: string | null;
    profile_data: {
      branch?: string;
      year?: string;
      skills?: string[];
    } | null;
  }>;
  onConnect: (profileId: string) => void;
  loading: boolean;
  allProfilesCount: number;
  sentConnections?: string[];
}

export const ProfileList = ({ profiles, onConnect, loading, allProfilesCount, sentConnections = [] }: ProfileListProps) => {
  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" role="status">
          <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">Loading...</span>
        </div>
        <p className="mt-2 text-gray-600">Searching for profiles...</p>
      </div>
    );
  }

  if (allProfilesCount === 0) {
    return (
      <div className="text-center text-gray-500 mt-8 p-6 border border-gray-200 rounded-lg">
        <p className="text-lg">No other users found in the system yet</p>
        <p className="mt-2 text-sm">Once more users join, you'll be able to discover and connect with them.</p>
      </div>
    );
  }

  if (profiles.length === 0) {
    return (
      <div className="text-center text-gray-500 mt-8 p-6 border border-gray-200 rounded-lg">
        <p className="text-lg">No matching profiles found</p>
        <p className="mt-2 text-sm">Try searching with different criteria or check your search term.</p>
      </div>
    );
  }

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
      {profiles.map((profile) => (
        <ProfileCard 
          key={profile.id} 
          profile={profile} 
          onConnect={onConnect}
          isConnectionSent={sentConnections.includes(profile.id)}
        />
      ))}
    </div>
  );
};
