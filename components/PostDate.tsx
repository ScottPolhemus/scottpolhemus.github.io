import moment from 'moment'

export default function PostDate({ date }: { date: string }) {
  return (
    <span className="text-sm">
      {moment(date).format('dddd, MMMM Do YYYY')}
    </span>
  )
}
