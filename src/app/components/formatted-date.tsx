export type FormattedDateProps = {
  date: Date;
}

export const FormattedDate = ({ date }: FormattedDateProps) => (
  <time dateTime={date.toISOString()}>
    {
      date.toLocaleDateString('en-us', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })
    }
  </time>
)
