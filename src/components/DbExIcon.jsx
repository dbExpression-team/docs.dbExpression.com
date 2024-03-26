import Image from 'next/image'
import clsx from 'clsx'
import dbexIconLight from '../../public/logos/light/dbex-and-icon.png'
import dbexIconDark from '../../public/logos/dark/dbex-and-icon.png'

export function DbExIcon(className, props) {
	return (
	<>
		<Image
			className= {clsx("inline dark:hidden border-0", className)}
			src={dbexIconLight}
			alt="dbExpression"
			width={530}
			height={351}
			unoptimized
			priority
		/>
		<Image
			className= {clsx("dark:inline hidden border-0", className)}
			src={dbexDarkLight}
			alt="dbExpression"
			width={530}
			height={351}
			unoptimized
			priority
		/></>
	)
}