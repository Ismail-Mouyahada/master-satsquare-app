export default function Form({ children }: any) {
  return (
    <div className="z-10 flex flex-col w-full gap-4 p-6 bg-white rounded-md shadow-sm max-w-80">
      {children}
    </div>
  )
}
