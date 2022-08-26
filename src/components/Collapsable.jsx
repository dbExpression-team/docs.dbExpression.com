export function Collapsable({ children, title }) {
  return (
    <details>
	<summary>{title}</summary>
      {children}
	</details>
  )
}
