import Image from 'next/future/image'
import clsx from 'clsx'

export function DbExMascot(className, props) {
	return (
		<Image
			className= {clsx("inline border-0", className)}
			src="/logos/dbex-mascot.png"
			alt="dbex"
			width={50}
			height={50}
			unoptimized
			priority
		/>
	)
}