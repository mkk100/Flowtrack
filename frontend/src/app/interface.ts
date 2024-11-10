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
  username: string;
  avatar: string;
  userId: string;
  description: string;
  level: string;
  duration: number;
  createdAt: string;
  updatedAt: string;
}

export interface Groups {
  name: string;
  createdAt: string;
  description: string;
  id: string;
  memberships: string[];
}
