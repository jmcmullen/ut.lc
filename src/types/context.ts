export interface Context {
  user?: {
    id: string;
    email: string;
    name?: string;
    image?: string;
    emailVerified: boolean;
    createdAt: Date;
    updatedAt: Date;
  };
}
