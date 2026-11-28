import moment from 'moment'

const TIME_ZONE = 'America/New_York'

// publishedAt is a UTC ISO datetime (e.g. "2026-11-28T01:30:00.000Z"); render it
// in the author's timezone so evening posts don't show the next day's date.
// Values without a zone designator (legacy createdAt) are already local.
function toLocalMoment(date: string) {
  if (!/(Z|[+-]\d{2}:?\d{2})$/i.test(date)) return moment(date)

  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: TIME_ZONE,
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
  }).formatToParts(new Date(date))
  const get = (type: string) =>
    Number(parts.find((p) => p.type === type)?.value)

  return moment({ year: get('year'), month: get('month') - 1, day: get('day') })
}

export default function PostDate({ date }: { date: string }) {
  return (
    <span className="text-sm">
      {toLocalMoment(date).format('dddd, MMMM Do YYYY')}
    </span>
  )
}
