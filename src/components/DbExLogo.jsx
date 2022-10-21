import Image from 'next/future/image'
import clsx from 'clsx'
import dbexLogoLight from '../../public/logos/light/dbex-no-icon.png'
import dbexLogoDark from '../../public/logos/dark/dbex-no-icon.png'

export function DbExLogo(className, props) {
	return (
	<>
		<Image
			className= {clsx("inline dark:hidden border-0", className)}
			src={dbexLogoLight}
			alt="dbExpression"
			width={182}
			height={24}
			unoptimized
			priority
		/>
		<Image
			className= {clsx("dark:inline hidden border-0", className)}
			src={dbexLogoDark}
			alt="dbExpression"
			width={182}
			height={24}
			unoptimized
			priority
		/></>
	)
}
