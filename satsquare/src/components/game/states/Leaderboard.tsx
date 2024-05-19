export default function Leaderboard({ data: { leaderboard } }: any) {
  return (
    <section className="relative flex flex-col items-center justify-center flex-1 w-full px-2 mx-auto max-w-7xl">
      <h2 className="mb-6 text-5xl font-bold text-white drop-shadow-md">
        Classement
      </h2>
      <div className="flex flex-col w-full gap-2">
        {leaderboard.map(({ username, points }: any, key: any) => (
          <div
            key={key}
            className="flex justify-between w-full p-3 text-2xl font-bold text-white rounded-md bg-primary"
          >
            <span className="drop-shadow-md">{username}</span>
            <span className="drop-shadow-md">{points}</span>
          </div>
        ))}
      </div>
    </section>
  )
}
