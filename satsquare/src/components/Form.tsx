export default function Form({ children }: any) {
  return (
    <div className="z-10 flex flex-col w-full gap-4 p-6 bg-slate-50 rounded-md shadow-sm max-w-80">
      {children}
    </div>
  )
}
