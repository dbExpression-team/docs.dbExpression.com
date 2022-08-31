import Image from 'next/future/image'
import clsx from 'clsx'

export function DbExIcon(className, props) {
	return (
	<>
		<Image
			className= {clsx("inline dark:hidden border-0", className)}
			src="/logos/light/dbex-and-icon.png"
			alt="dbExpression"
			width={530}
			height={351}
			unoptimized
			priority
		/>
		<Image
			className= {clsx("dark:inline hidden border-0", className)}
			src="/logos/dark/dbex-and-icon.png"
			alt="dbExpression"
			width={530}
			height={351}
			unoptimized
			priority
		/></>
	)
}