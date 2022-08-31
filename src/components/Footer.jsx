import Link from 'next/link'
import { GitHubIcon } from '@/components/GitHubIcon'

export function Footer() {
	return (
		<footer className="z-50 flex flex-wrap items-center justify-between bg-white px-4 py-2 sm:px-6 lg:px-8 dark:bg-slate-900/95 dark:backdrop-blur dark:[@supports(backdrop-filter:blur(0))]:bg-slate-900/75">
		<div>
			<p className="prose pl-2 text-sm dark:text-slate-400">&copy; 2022 HatTrick Labs, LLC. All rights reserved.</p>
		</div>
		<div>        
			<Link href="https://github.com/HatTrickLabs/dbExpression" className="group" aria-label="GitHub">
          		<GitHubIcon className="h-6 w-6 fill-slate-400 group-hover:fill-slate-500 dark:group-hover:fill-slate-300" />
        	</Link>
		</div>
		</footer>
	)
}
