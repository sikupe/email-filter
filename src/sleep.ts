export async function sleep(timeInMs: number) {
  return new Promise<void>((resolve, reject) => {
    setTimeout(() => {
      resolve();
    }, timeInMs);
  });
}
