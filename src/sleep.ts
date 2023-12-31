export async function sleep(timeInMs: number) {
  return new Promise<void>(resolve => {
    setTimeout(() => {
      resolve();
    }, timeInMs);
  });
}
