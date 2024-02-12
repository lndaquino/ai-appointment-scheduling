// @typescript-eslint/no-explicit-any
export const debug = (msg: any) => {
  if (process.env.NEXT_PUBLIC_ENV === 'dev') {
    console.log(msg)
  }
}
