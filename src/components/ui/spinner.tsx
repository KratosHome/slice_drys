export default function Spinner() {
  return (
    <div className="w-20">
      <div
        style={{
          width: '1rem',
          height: '1rem',
          border: '2px solid #FFF',
          borderBottomColor: 'transparent',
          borderRadius: '50%',
          display: 'inline-block',
          boxSizing: 'border-box',
          animation: 'rotation 1s linear infinite',
        }}
      />
    </div>
  )
}
