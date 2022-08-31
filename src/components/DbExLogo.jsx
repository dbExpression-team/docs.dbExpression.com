import Image from 'next/future/image'
import clsx from 'clsx'

export function DbExLogo(className, props) {
	return (
	<>
		<Image
			className= {clsx("inline dark:hidden border-0", className)}
			src="/logos/light/dbex-no-icon.png"
			alt="dbExpression"
			width={182}
			height={24}
			unoptimized
			priority
		/>
		<Image
			className= {clsx("dark:inline hidden border-0", className)}
			src="/logos/dark/dbex-no-icon.png"
			alt="dbExpression"
			width={182}
			height={24}
			unoptimized
			priority
		/></>
	)
}
