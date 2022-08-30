import Image from 'next/future/image'
import clsx from 'clsx'

export function DbExLogo(className, props) {
	return (
	<>
		<Image
			className= {clsx("block dark:hidden border-0", className)}
			src='/logos/light/dbex-and-icon.png'
			alt=""
			width={530}
			height={351}
			unoptimized
			priority
		/>
		<Image
			className= {clsx("dark:block hidden border-0", className)}
			src='/logos/dark/dbex-and-icon.png'
			alt=""
			width={530}
			height={351}
			unoptimized
			priority
		/></>
	)
}
