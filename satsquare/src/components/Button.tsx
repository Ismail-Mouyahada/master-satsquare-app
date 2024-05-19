import clsx from "clsx"

export default function Button({ children, className, ...otherProps }: any) {
  return (
    <button
      className={clsx(
        "outline-none ring-[#6a6b74!important] bg-[#F8D99B] hover:bg-[#c9aa6c!important] text-[#6a6b74] px-20 p-3 rounded-md font-bold",
        className,
      )}
      {...otherProps}
    >
      <span>{children}</span>
    </button>
  )
}
