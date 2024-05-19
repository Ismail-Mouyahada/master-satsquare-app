let cooldownTimeout: NodeJS.Timeout | undefined;
let cooldownResolve: ((value?: void | PromiseLike<void>) => void) | undefined;

export const abortCooldown = () => {
  if (cooldownResolve) {
    cooldownResolve();
  }
  if (cooldownTimeout) {
    clearInterval(cooldownTimeout);
  }
};

export const cooldown = (ms: number, io: { to: (room: any) => any }, room: any) => {
  let count = ms - 1;

  return new Promise<void>((resolve) => {
    cooldownResolve = resolve;

    cooldownTimeout = setInterval(() => {
      if (count <= 0) {
        if (cooldownResolve) {
          cooldownResolve();
          cooldownResolve = undefined; // Reset cooldownResolve after resolving
        }
        clearInterval(cooldownTimeout!);
      } else {
        io.to(room).emit("game:cooldown", count);
        count -= 1;
      }
    }, 1000);
  });
};

export const sleep = (sec: number) => new Promise<void>((resolve) => setTimeout(resolve, sec * 1000));
