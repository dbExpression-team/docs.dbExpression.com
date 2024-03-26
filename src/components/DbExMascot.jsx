import Image from 'next/image'
import clsx from 'clsx'
import dbexMascot from '../../public/logos/dbex-mascot.png'

export function DbExMascot(className, props) {
	return (
		<Image
			className= {clsx("inline border-0", className)}
			src={dbexMascot}
			alt="dbex"
			width={50}
			height={50}
			unoptimized
			priority
		/>
	)
}