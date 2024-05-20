let cooldownTimeout: NodeJS.Timeout | undefined;
let cooldownResolve: ((value?: void | PromiseLike<void>) => void) | undefined;

/**
 * Aborts the current cooldown by resolving the cooldown promise and clearing the interval.
 */
export const abortCooldown = (): void => {
  if (cooldownResolve) {
    cooldownResolve();
    cooldownResolve = undefined; // Reset cooldownResolve after resolving
  }
  if (cooldownTimeout) {
    clearInterval(cooldownTimeout);
    cooldownTimeout = undefined; // Reset cooldownTimeout after clearing
  }
};

/**
 * Initiates a cooldown period, emitting the remaining time to the specified room every second.
 * 
 * @param sec - The number of seconds for the cooldown.
 * @param io - The socket.io server instance.
 * @param room - The room to which the cooldown messages will be emitted.
 * @returns A promise that resolves when the cooldown completes.
 */
export const cooldown = (sec: number, io: { to: (room: any) => { emit: (event: string, data: any) => void } }, room: any): Promise<void> => {
  let count = sec - 1;

  return new Promise<void>((resolve) => {
    cooldownResolve = resolve;

    cooldownTimeout = setInterval(() => {
      if (count <= 0) {
        if (cooldownResolve) {
          cooldownResolve();
          cooldownResolve = undefined; // Reset cooldownResolve after resolving
        }
        clearInterval(cooldownTimeout!);
        cooldownTimeout = undefined; // Reset cooldownTimeout after clearing
      } else {
        io.to(room).emit("game:cooldown", count);
        count -= 1;
      }
    }, 1000);
  });
};

/**
 * Creates a promise that resolves after the specified number of seconds.
 * 
 * @param sec - The number of seconds to sleep.
 * @returns A promise that resolves after the specified number of seconds.
 */
export const sleep = (sec: number): Promise<void> => new Promise<void>((resolve) => setTimeout(resolve, sec * 1000));
