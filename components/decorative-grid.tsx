const rows = Array.from({ length: 6 }, (_, index) => index)
const columns = Array.from({ length: 9 }, (_, index) => index)

function GridPanel({ side }: { side: 'left' | 'right' }) {
  return (
    <div className={`decorative-grid-panel decorative-grid-panel-${side}`}>
      <div className={`decorative-grid-fade decorative-grid-fade-${side}`} />
      <div className="decorative-grid-lines">
        {rows.map(row => (
          <div key={row} className="decorative-grid-row">
            {columns.map(column => (
              <div key={`${row}-${column}`} className="decorative-grid-cell" />
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

export default function DecorativeGrid() {
  return (
    <div className="decorative-grid" aria-hidden="true">
      <GridPanel side="left" />
      <GridPanel side="right" />
    </div>
  )
}
