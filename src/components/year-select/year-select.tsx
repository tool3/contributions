import s from './year-select.module.scss'

const CURRENT_YEAR = new Date().getFullYear()
const YEARS = [
  'default',
  ...Array.from({ length: 5 }, (_, i) => CURRENT_YEAR - i)
]

interface YearSelectorProps {
  year: number | string
  setYear: (year: number | string) => void
}

const YearSelector = ({ year, setYear }: YearSelectorProps) => {
  return (
    <select
      className={s.yearSelect}
      value={year}
      onChange={(e) => setYear(e.target.value)}
    >
      {YEARS.map((y) => (
        <option key={y} value={y}>
          {y}
        </option>
      ))}
    </select>
  )
}

export default YearSelector
