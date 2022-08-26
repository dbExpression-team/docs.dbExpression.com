import { useRouter } from 'next/router'
import Image from 'next/future/image'
import dbexIcon from '@/images/dbex-icon.png'

export function DbExLogo(props) {
  let router = useRouter()
  let isHomePage = router.pathname === '/'
  
  if (isHomePage)
	  return
  return (
    <Image
	  className= ""{...props}
	  src={dbexIcon}
	  alt=""
	  width={530}
	  height={530}
	  unoptimized
	  priority
	/>
  )
}
