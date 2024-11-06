export interface UserProfile {
  id: string;
  username: string;
  avatar: string;
  followers?: [];
  following?: [];
  logs?: [];
}
