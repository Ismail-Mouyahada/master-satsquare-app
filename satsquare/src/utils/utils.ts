export const shuffleArray = (array: any[]) => {
<<<<<<< HEAD
    return [...array].sort(() => Math.random() - 0.5);
  };
  

  export function exclude<User extends { [key: string]: any }, Key extends keyof User>(
    user: User,
    keys: Key[]
  ): Omit<User, Key> {
    return Object.fromEntries(
      Object.entries(user).filter(([key]) => !keys.includes(key as Key))
    ) as Omit<User, Key>;
  }
=======
  return [...array].sort(() => Math.random() - 0.5);
};

export function exclude<
  User extends { [key: string]: any },
  Key extends keyof User,
>(user: User, keys: Key[]): Omit<User, Key> {
  return Object.fromEntries(
    Object.entries(user).filter(([key]) => !keys.includes(key as Key))
  ) as Omit<User, Key>;
}
>>>>>>> 5fcdb68c7599f107d3a7513047445fb37443f27b
