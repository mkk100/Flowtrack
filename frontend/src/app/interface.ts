export interface UserProfile {
  id: string;
  username: string;
  avatar: string;
  followers?: [];
  following?: [];
  logs?: [];
}

export interface PostSchema {
  id: string;
  description: string;
  deepWorkDuration: number;
  deepWorkLevel: number;
  createdAt: string;
  updatedAt: string;
  userId: string;
  img?: string | null;
  video?: string | null;
  user: {
    username: string;
    avatar: string;
  };
}

export interface Groups {
  name: string;
  createdAt: string;
  description: string;
  id: string;
  memberships: string[];
}

export interface GroupResponse {
  groupId: string;
  id: string;
  userId: string;
  group: {
    name: string;
    description: string;
    _count: {
      memberships: number;
    };
  };
}

export interface UnjoinedGroupResponse {
  description: string;
  id: string;
  name: string;

  _count: {
    memberships: number;
  };
}

export interface DeepWorkLogs {
  id: string;
  userId: string;
  description: string;
  minutesLogged: number;
  deepWorkLevel: number;
  logDate: string;
}

export interface Follower{
  followerId: string;
  username: string;
  avatar: string;
}

export interface Following{
  followingId: string;
  username: string;
  avatar: string;
}

