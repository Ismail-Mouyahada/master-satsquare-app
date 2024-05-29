import clsx from "clsx"

export default function Input({ className, ...otherProps }: any) {
  return (
    <input
      className={clsx(
        "text-md text-gray-700 border-gray-300   outline outline-2 outline-none p-2.5 text-center rounded-md ",
        className,
      )}
      {...otherProps}
    />
  )
}
